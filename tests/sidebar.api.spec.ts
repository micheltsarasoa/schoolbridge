import { GET, PUT } from '@/app/api/admin/schools/[schoolId]/sidebar/route';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextRequest } from 'next/server';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    sidebarConfiguration: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    school: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@/auth');

const mockAuth = auth as jest.Mock;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Sidebar API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);
      const request = new NextRequest('http://localhost');
      const response = await GET(request, { params: { schoolId: '1' } });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe('Unauthorized');
    });

    it('should return 400 if schoolId is not provided', async () => {
        mockAuth.mockResolvedValue({ user: { id: '1' } });
        const request = new NextRequest('http://localhost');
        // @ts-ignore
        const response = await GET(request, { params: {} });
        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body.error).toBe('School ID is required');
    });

    it('should return an empty configuration if none is found', async () => {
      mockAuth.mockResolvedValue({ user: { id: '1' } });
      (mockPrisma.sidebarConfiguration.findUnique as jest.Mock).mockResolvedValue(null);
      const request = new NextRequest('http://localhost');
      const response = await GET(request, { params: { schoolId: '1' } });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({ items: [] });
    });

    it('should return the sidebar configuration if found', async () => {
      const config = { items: [{ type: 'link', id: '1', label: 'Home', href: '/', roles: ['ADMIN'] }] };
      mockAuth.mockResolvedValue({ user: { id: '1' } });
      (mockPrisma.sidebarConfiguration.findUnique as jest.Mock).mockResolvedValue({ id: '1', schoolId: '1', configuration: config, isDeleted: false, createdAt: new Date(), updatedAt: new Date(), clientUpdatedAt: new Date(), clientId: '1' });
      const request = new NextRequest('http://localhost');
      const response = await GET(request, { params: { schoolId: '1' } });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual(config);
    });
  });

  describe('PUT', () => {
    const validConfig = {
      items: [
        { id: 'home', type: 'link', label: 'Home', href: '/', roles: ['STUDENT'] },
        { type: 'divider', roles: ['STUDENT'] },
        { id: 'courses', type: 'group', label: 'Courses', roles: ['STUDENT'], children: [
            { id: 'math', type: 'link', label: 'Mathematics', href: '/courses/math', roles: ['STUDENT'] }
        ]}
      ],
    };

    it('should return 401 if user is not an ADMIN or SUPER_ADMIN', async () => {
      mockAuth.mockResolvedValue({ user: { id: '1', role: 'STUDENT' } });
      const request = new NextRequest('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(validConfig),
      });
      const response = await PUT(request, { params: { schoolId: '1' } });
      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid configuration', async () => {
      mockAuth.mockResolvedValue({ user: { id: '1', role: 'ADMIN' } });
      const request = new NextRequest('http://localhost', {
        method: 'PUT',
        body: JSON.stringify({ items: [{ type: 'invalid' }] }),
      });
      const response = await PUT(request, { params: { schoolId: '1' } });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toBe('Invalid configuration format');
    });

    it('should return 404 if school not found', async () => {
        mockAuth.mockResolvedValue({ user: { id: '1', role: 'ADMIN' } });
        (mockPrisma.school.findUnique as jest.Mock).mockResolvedValue(null);
        const request = new NextRequest('http://localhost', {
            method: 'PUT',
            body: JSON.stringify(validConfig),
        });
        const response = await PUT(request, { params: { schoolId: 'non-existent' } });
        expect(response.status).toBe(404);
        const body = await response.json();
        expect(body.error).toBe('School not found');
    });

    it('should update the configuration successfully', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-1', role: 'ADMIN' } });
      (mockPrisma.school.findUnique as jest.Mock).mockResolvedValue({ id: 'school-1', name: 'Test School', isDeleted: false, createdAt: new Date(), updatedAt: new Date() });
      (mockPrisma.sidebarConfiguration.upsert as jest.Mock).mockResolvedValue({ id: 'config-1', schoolId: 'school-1', configuration: validConfig, isDeleted: false, createdAt: new Date(), updatedAt: new Date(), clientUpdatedAt: new Date(), clientId: 'user-1' });
      
      const request = new NextRequest('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(validConfig),
      });
      const response = await PUT(request, { params: { schoolId: 'school-1' } });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual(validConfig);
      expect(mockPrisma.sidebarConfiguration.upsert).toHaveBeenCalledWith({
        where: { schoolId: 'school-1' },
        update: {
          configuration: validConfig,
          clientUpdatedAt: expect.any(Date),
        },
        create: {
          schoolId: 'school-1',
          configuration: validConfig,
          clientId: 'user-1',
        },
      });
    });
  });
});