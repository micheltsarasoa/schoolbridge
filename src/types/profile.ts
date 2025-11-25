/**
 * User Profile Types for Onboarding
 * 
 * Profile data is stored in User.settings JSON field
 * Each role has specific mandatory fields that must be completed
 */

import { UserRole } from '@/generated/prisma';

export interface StudentProfile {
  gradeLevel: string;
  dateOfBirth: string; // ISO date string
  parentContact: string;
  interests?: string;
  profileComplete: boolean;
}

export interface TeacherProfile {
  subjects: string[]; // Array of subject IDs or names
  qualifications: string;
  bio: string;
  profileComplete: boolean;
}

export interface ParentProfile {
  linkedChildren?: string[]; // Array of student user IDs
  contactPreferences: {
    preferredMethod: 'email' | 'phone' | 'both';
    preferredTime?: string;
  };
  profileComplete: boolean;
}

export interface AdminProfile {
  department: string;
  adminLevel: 'super' | 'school' | 'department';
  profileComplete: boolean;
}

// Union type for all profiles
export type UserProfile = StudentProfile | TeacherProfile | ParentProfile | AdminProfile;

// Helper to check if profile is complete
export function isProfileComplete(settings: any, role: UserRole): boolean {
  if (!settings || typeof settings !== 'object') return false;
  
  switch (role) {
    case 'STUDENT':
      return !!(
        settings.gradeLevel &&
        settings.dateOfBirth &&
        settings.parentContact &&
        settings.profileComplete === true
      );
    
    case 'TEACHER':
      return !!(
        Array.isArray(settings.subjects) &&
        settings.subjects.length > 0 &&
        settings.qualifications &&
        settings.bio &&
        settings.profileComplete === true
      );
    
    case 'PARENT':
      return !!(
        settings.contactPreferences &&
        settings.contactPreferences.preferredMethod &&
        settings.profileComplete === true
      );
    
    case 'ADMIN':
    case 'EDUCATIONAL_MANAGER':
      return !!(
        settings.department &&
        settings.adminLevel &&
        settings.profileComplete === true
      );
    
    default:
      return false;
  }
}

// Get empty profile template for role
export function getEmptyProfile(role: UserRole): Partial<UserProfile> {
  switch (role) {
    case 'STUDENT':
      return {
        gradeLevel: '',
        dateOfBirth: '',
        parentContact: '',
        interests: '',
        profileComplete: false,
      } as StudentProfile;
    
    case 'TEACHER':
      return {
        subjects: [],
        qualifications: '',
        bio: '',
        profileComplete: false,
      } as TeacherProfile;
    
    case 'PARENT':
      return {
        linkedChildren: [],
        contactPreferences: {
          preferredMethod: 'email',
          preferredTime: '',
        },
        profileComplete: false,
      } as ParentProfile;
    
    case 'ADMIN':
    case 'EDUCATIONAL_MANAGER':
      return {
        department: '',
        adminLevel: 'school',
        profileComplete: false,
      } as AdminProfile;
    
    default:
      return { profileComplete: false };
  }
}
