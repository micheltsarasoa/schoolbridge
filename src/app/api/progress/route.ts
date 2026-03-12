import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface ClientUpdate {
  localId: string;
  clientTime: string; // Client's local time of last change for this record
  modelName: 'CourseProgress' | 'LectureProgress' | 'QuizAttempt' | 'Note';
  updateData: any; // The actual data changes
}

/**
 * GET /api/progress - Pull server updates since last sync (US 4.6)
 * Fetches all progress data updated or deleted since the provided lastSyncedAt timestamp.
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const url = new URL(request.url);
        const lastSyncedAtString = url.searchParams.get('lastSyncedAt');
        let lastSyncedAt: Date | undefined;

        if (lastSyncedAtString) {
            lastSyncedAt = new Date(lastSyncedAtString);
        }

        // Shared WHERE clauses for updated/deleted records
        const updateFilter = lastSyncedAt ? { updatedAt: { gt: lastSyncedAt }, isDeleted: false } : { isDeleted: false };
        const deleteFilter = lastSyncedAt ? { clientUpdatedAt: { gt: lastSyncedAt }, isDeleted: true } : { isDeleted: true };
        
        // Helper to construct query, handling different foreign key names
        const whereClause = (fkName: 'userId' | 'studentId') => ({ [fkName]: userId });

        const models = [
            { model: prisma.courseProgress, fk: 'studentId' },
            { model: prisma.lectureProgress, fk: 'userId' },
            { model: prisma.quizAttempt, fk: 'userId' },
            { model: prisma.note, fk: 'userId' },
        ];
        
        const serverUpdates: any = { deleted: [] };

        // Use a transaction to fetch all updates concurrently
        await prisma.$transaction(async (tx) => {
            for (const { model, fk } of models) {
                // We use model._dmmf.name for keys in the result object
                const modelName = (model as any)._DMMF.name; 

                const updated = await (model as any).findMany({ 
                    where: { ...whereClause(fk as any), ...updateFilter }
                });
                
                // Fetch metadata for soft-deleted records to inform client of deletions
                const deleted = await (model as any).findMany({
                    where: { ...whereClause(fk as any), ...deleteFilter },
                    select: { id: true, isDeleted: true, clientUpdatedAt: true, clientId: true }
                });

                serverUpdates[modelName] = updated.map((p: any) => ({ ...p, modelName }));
                serverUpdates.deleted.push(...deleted.map((d: any) => ({ ...d, modelName })));
            }
        });

        return NextResponse.json({ updates: serverUpdates, currentServerTime: new Date().toISOString() });
    } catch (error) {
        console.error('Error fetching delta progress:', error);
        return NextResponse.json(
            { message: 'Internal server error during delta pull' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/progress - Push client changes to the server (US 4.6, 4.3, 4.5)
 * Handles incoming client updates using a Last-Write-Wins conflict resolution strategy.
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;
        const body = await request.json();
        const clientUpdates: ClientUpdate[] = body.updates || [];
        const deviceId = body.deviceId || 'unknown-device';
        const results: any[] = [];

        for (const update of clientUpdates) {
            const { localId, clientTime, modelName, updateData } = update;
            const clientUpdateDate = new Date(clientTime);

            const modelConfig: any = {
                CourseProgress: { model: prisma.courseProgress, keys: ['courseId', 'studentId'], fk: 'studentId' },
                LectureProgress: { model: prisma.lectureProgress, keys: ['lectureId', 'userId'], fk: 'userId' },
                QuizAttempt: { model: prisma.quizAttempt, keys: ['quizId', 'userId', 'attemptNumber'], fk: 'userId' },
                Note: { model: prisma.note, keys: ['clientId'], fk: 'userId' },
            }[modelName];

            if (!modelConfig) {
                results.push({ localId, status: 'rejected', reason: `Unknown model: ${modelName}` });
                continue;
            }
            
            // Prepare data, ensuring FKs are correct for the current user
            const data: any = {
                ...updateData,
                // Assign user foreign key based on model requirements
                ...(modelConfig.fk === 'userId' ? { userId } : {}),
                ...(modelConfig.fk === 'studentId' ? { studentId: userId } : {}),
                // Remove internal fields that shouldn't be updated or created by client
                id: undefined,
                updatedAt: undefined,
                createdAt: undefined,
                clientUpdatedAt: undefined,
            };

            // 1. Handle Deletion (soft delete)
            if (updateData.isDeleted === true) {
                try {
                    if (localId.startsWith('new-')) {
                        results.push({ localId, status: 'deleted_locally' });
                    } else if (localId.length === 36) { // Server ID assumption
                        const deletedRecord = await modelConfig.model.update({
                            where: { id: localId },
                            data: { isDeleted: true },
                        });
                        results.push({ localId, status: 'deleted_server', serverId: deletedRecord.id });
                    }
                } catch (e: any) {
                    results.push({ localId, status: 'failed_delete', reason: e.message });
                }
                continue;
            }
            
            // 2. Handle Upsert/Update

            let existingRecord = null;
            
            // Try lookup by server ID if known
            if (!localId.startsWith('new-') && localId.length === 36) {
                existingRecord = await modelConfig.model.findUnique({ where: { id: localId } });
            } 
            
            // If not found by server ID, or if it's a new record, try finding by unique key(s)
            if (!existingRecord) {
                const uniqueWhere: any = {};
                
                // Construct unique lookup criteria
                modelConfig.keys.forEach((key: string) => {
                    if (data[key]) {
                        uniqueWhere[key] = data[key];
                    }
                });
                
                // Add the user foreign key to the lookup criteria
                uniqueWhere[modelConfig.fk] = userId;

                if (Object.keys(uniqueWhere).length > 1 || (modelName === 'Note' && uniqueWhere.clientId)) {
                    // Use findFirst for models with composite unique constraints or Notes
                    existingRecord = await modelConfig.model.findFirst({ where: uniqueWhere });
                }
            }


            if (existingRecord) {
                // US 4.5: Conflict Resolution (Last-Write-Wins based on server updatedAt)
                if (existingRecord.updatedAt && clientUpdateDate < existingRecord.updatedAt) {
                    results.push({ localId, status: 'conflict', serverId: existingRecord.id, serverUpdatedAt: existingRecord.updatedAt });
                    continue;
                }

                // Apply Update
                try {
                    const updatedRecord = await modelConfig.model.update({
                        where: { id: existingRecord.id },
                        data,
                    });
                    results.push({ localId, status: 'updated', serverId: updatedRecord.id, serverUpdatedAt: updatedRecord.updatedAt });
                } catch (e: any) {
                    results.push({ localId, status: 'failed_update', reason: e.message });
                }

            } else {
                // Create New Record
                try {
                    // Need to ensure clientId is set for new records for future syncs
                    data.clientId = updateData.clientId || localId;
                    
                    const newRecord = await modelConfig.model.create({ data });
                    results.push({ localId, status: 'created', serverId: newRecord.id, serverUpdatedAt: newRecord.updatedAt });
                } catch (e: any) {
                    results.push({ localId, status: 'failed_create', reason: e.message });
                }
            }
        }

        // Update the OfflineSync record for this user/device
        await prisma.offlineSync.upsert({
            where: { userId_deviceId: { userId, deviceId } },
            update: { lastSyncAt: new Date() },
            create: { userId, deviceId, lastSyncAt: new Date(), pendingChanges: {} }
        });

        return NextResponse.json({ syncResults: results, currentServerTime: new Date().toISOString() });
    } catch (error) {
        console.error('Error handling client updates:', error);
        return NextResponse.json(
            { message: 'Internal server error during delta push' },
            { status: 500 }
        );
    }
}