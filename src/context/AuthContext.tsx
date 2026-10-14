import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.js';

interface AuthContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  availableUsers: User[];
  isRole: (role: UserRole | UserRole[]) => boolean;
}

const DEFAULT_USERS: Record<UserRole, User> = {
  student: {
    id: 'usr_stu_1',
    name: 'Aarav Sharma',
    email: 'aarav.s@campus.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    idNumber: 'STU-2024-8192',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  faculty: {
    id: 'usr_fac_1',
    name: 'Prof. Elena Vance',
    email: 'e.vance@campus.edu',
    role: 'faculty',
    department: 'Electrical & Computer Engineering',
    idNumber: 'FAC-E-104',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  },
  transport_admin: {
    id: 'usr_trn_1',
    name: 'Marcus Brody',
    email: 'm.brody@campus.edu',
    role: 'transport_admin',
    department: 'Campus Logistics & Fleet Operations',
    idNumber: 'TRN-OPS-002',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  lab_admin: {
    id: 'usr_lab_1',
    name: 'Dr. Sarah Chen',
    email: 's.chen@campus.edu',
    role: 'lab_admin',
    department: 'Advanced Sciences & Quantum Systems',
    idNumber: 'LAB-DIR-055',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
  },
  campus_admin: {
    id: 'usr_adm_1',
    name: 'Dean Robert Sterling',
    email: 'dean.sterling@campus.edu',
    role: 'campus_admin',
    department: 'Office of the Vice Chancellor & Operations',
    idNumber: 'ADM-EXEC-001',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('smart_campus_role') as UserRole;
    return saved && DEFAULT_USERS[saved] ? saved : 'campus_admin'; // Default to admin so all modules are directly visible & interactive
  });

  const currentUser = DEFAULT_USERS[currentRole];

  const switchRole = (role: UserRole) => {
    if (DEFAULT_USERS[role]) {
      setCurrentRole(role);
      localStorage.setItem('smart_campus_role', role);
    }
  };

  const isRole = (role: UserRole | UserRole[]) => {
    if (Array.isArray(role)) {
      return role.includes(currentRole);
    }
    return currentRole === role;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      switchRole,
      availableUsers: Object.values(DEFAULT_USERS),
      isRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
