import { render, screen, waitFor } from '@testing-library/react';
import DynamicSidebar from '@/components/layout/Sidebar/DynamicSidebar';
import { SessionProvider } from 'next-auth/react';
import { UserRole } from '@/generated/prisma';

// Mock the fetch function
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

describe('DynamicSidebar Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should render the correct sidebar items for an admin user', async () => {
    const mockConfig = {
      items: [
        { id: '1', type: 'link', label: 'Admin Dashboard', href: '/admin', roles: ['ADMIN'] },
        { id: '2', type: 'link', label: 'Students', href: '/admin/students', roles: ['ADMIN'] },
        { id: '3', type: 'link', label: 'My Courses', href: '/student/courses', roles: ['STUDENT'] },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockConfig,
    });

    render(
      <SessionProvider session={{ user: { id: '1', schoolId: '1', role: UserRole.ADMIN }, expires: '1' }}>
        <DynamicSidebar />
      </SessionProvider>
    );

    // Wait for the sidebar items to be rendered
    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Students')).toBeInTheDocument();
      expect(screen.queryByText('My Courses')).not.toBeInTheDocument();
    });
  });

  it('should render the correct sidebar items for a student user', async () => {
    const mockConfig = {
      items: [
        { id: '1', type: 'link', label: 'Admin Dashboard', href: '/admin', roles: ['ADMIN'] },
        { id: '3', type: 'link', label: 'My Courses', href: '/student/courses', roles: ['STUDENT'] },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockConfig,
    });

    render(
      <SessionProvider session={{ user: { id: '1', schoolId: '1', role: UserRole.STUDENT }, expires: '1' }}>
        <DynamicSidebar />
      </SessionProvider>
    );

    // Wait for the sidebar items to be rendered
    await waitFor(() => {
      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
      expect(screen.getByText('My Courses')).toBeInTheDocument();
    });
  });
});