
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { UserRelationship, User } from '@/generated/prisma';
import { useRole } from '@/hooks/useRole';
import { UserRole } from '@/generated/prisma';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RelationshipWithUsers extends UserRelationship {
  parent: { id: string; name: string; email: string | null };
  student: { id: string; name: string; email: string | null };
}

export default function RelationshipsPage() {
  const { isAuthorized, isLoading: isAuthLoading } = useRole(UserRole.ADMIN);
  const [relationships, setRelationships] = useState<RelationshipWithUsers[]>([]);
  const [parents, setParents] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedParentId, setSelectedParentId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRelationships = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/relationships');
      if (!response.ok) {
        throw new Error('Failed to fetch relationships.');
      }
      const data = await response.json();
      setRelationships(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsersForDropdowns = async () => {
    try {
      const response = await fetch('/api/admin/users'); // Re-using the existing admin users API
      if (!response.ok) {
        throw new Error('Failed to fetch users for dropdowns.');
      }
      const data: User[] = await response.json();
      setParents(data.filter(user => user.role === UserRole.PARENT));
      setStudents(data.filter(user => user.role === UserRole.STUDENT));
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchRelationships();
      fetchUsersForDropdowns();
    }
  }, [isAuthorized]);

  const handleCreateRelationship = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
        const response = await fetch('/api/admin/relationships', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parentId: selectedParentId, studentId: selectedStudentId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create relationship');
        }

        // Refresh the list
        fetchRelationships();
        setSelectedParentId('');
        setSelectedStudentId('');

    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (relationshipId: string) => {
    if (!window.confirm("Are you sure you want to delete this relationship? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/relationships/${relationshipId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete relationship.");
      }

      fetchRelationships(); // Re-fetch all relationships to update the list

    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-4">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Parent-Student Relationships</h1>

      {/* Create Relationship Form */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Create New Relationship</h2>
        <form onSubmit={handleCreateRelationship}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">Parent</label>
              <Select value={selectedParentId} onValueChange={setSelectedParentId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a parent" />
                </SelectTrigger>
                <SelectContent>
                  {parents.map(parent => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name} ({parent.email || parent.phone})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student</label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.email || student.phone})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <button type="submit" disabled={isSubmitting || !selectedParentId || !selectedStudentId} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300">
              {isSubmitting ? 'Creating...' : 'Create Relationship'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>

      {/* Relationships List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Existing Relationships</h2>
        {isLoading ? (
          <p>Loading relationships...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {relationships.map((rel) => (
                <li key={rel.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">Parent: {rel.parent.name} ({rel.parent.email || rel.parent.id})</p>
                    <p className="text-sm text-gray-500">Student: {rel.student.name} ({rel.student.email || rel.student.id})</p>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => handleDeleteClick(rel.id)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
