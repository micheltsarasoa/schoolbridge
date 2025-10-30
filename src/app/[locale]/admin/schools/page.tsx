
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { School } from '@/generated/prisma';
import { useRole } from '@/hooks/useRole';
import { UserRole } from '@/generated/prisma';
import EditSchoolModal from '@/components/admin/EditSchoolModal';

export default function SchoolsPage() {
  const { isAuthorized, isLoading: isAuthLoading } = useRole(UserRole.ADMIN);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // Form state
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolCode, setNewSchoolCode] = useState('');
  const [newSchoolAddress, setNewSchoolAddress] = useState('');
  const [newSchoolPhone, setNewSchoolPhone] = useState('');
  const [newSchoolEmail, setNewSchoolEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSchools = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/schools');
      if (!response.ok) {
        throw new Error('Failed to fetch schools.');
      }
      const data = await response.json();
      setSchools(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchSchools();
    }
  }, [isAuthorized]);

  const handleCreateSchool = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
        const response = await fetch('/api/admin/schools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: newSchoolName,
              code: newSchoolCode,
              address: newSchoolAddress,
              phone: newSchoolPhone,
              email: newSchoolEmail,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create school');
        }

        // Refresh the list
        fetchSchools();
        setNewSchoolName('');
        setNewSchoolCode('');
        setNewSchoolAddress('');
        setNewSchoolPhone('');
        setNewSchoolEmail('');

    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleEditClick = (school: School) => {
    setSelectedSchool(school);
  };

  const handleCloseModal = () => {
    setSelectedSchool(null);
  };

  const handleSchoolUpdate = (updatedSchool: School) => {
    setSchools(schools.map(s => s.id === updatedSchool.id ? updatedSchool : s));
  };

  const handleDeleteClick = async (schoolId: string) => {
    if (!window.confirm("Are you sure you want to delete this school? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/schools/${schoolId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete school.");
      }

      setSchools(schools.filter(s => s.id !== schoolId));

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
    <>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">School Management</h1>

        {/* Create School Form */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Create New School</h2>
          <form onSubmit={handleCreateSchool}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                value={newSchoolName}
                onChange={(e) => setNewSchoolName(e.target.value)}
                placeholder="School Name"
                className="p-2 border rounded w-full"
                required
              />
              <input
                type="text"
                value={newSchoolCode}
                onChange={(e) => setNewSchoolCode(e.target.value)}
                placeholder="School Code (e.g., SCH001)"
                className="p-2 border rounded w-full"
                required
              />
              <input
                type="text"
                value={newSchoolAddress}
                onChange={(e) => setNewSchoolAddress(e.target.value)}
                placeholder="Address (Optional)"
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                value={newSchoolPhone}
                onChange={(e) => setNewSchoolPhone(e.target.value)}
                placeholder="Phone (Optional)"
                className="p-2 border rounded w-full"
              />
              <input
                type="email"
                value={newSchoolEmail}
                onChange={(e) => setNewSchoolEmail(e.target.value)}
                placeholder="Email (Optional)"
                className="p-2 border rounded w-full"
              />
              <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300">
                {isSubmitting ? 'Creating...' : 'Create School'}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>

        {/* Schools List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Existing Schools</h2>
          {isLoading ? (
            <p>Loading schools...</p>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {schools.map((school) => (
                  <li key={school.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">{school.name}</p>
                      <p className="text-sm text-gray-500">Code: {school.code}</p>
                    </div>
                    <div className="space-x-2">
                      <button onClick={() => handleEditClick(school)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteClick(school.id)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {selectedSchool && (
        <EditSchoolModal 
          school={selectedSchool} 
          onClose={handleCloseModal} 
          onSchoolUpdate={handleSchoolUpdate} 
        />
      )}
    </>
  );
}
