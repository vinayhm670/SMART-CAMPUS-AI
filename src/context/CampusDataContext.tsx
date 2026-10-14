import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Building, 
  Room, 
  TimetableEntry, 
  BusRoute, 
  Bus, 
  Laboratory, 
  LabEquipment, 
  LabReservation, 
  Grievance, 
  EnergyMetric, 
  CampusAnnouncement, 
  EmergencyAlert, 
  QueueToken, 
  LostFoundItem, 
  CampusDocument, 
  AIRecommendation, 
  NotificationItem,
  UserRole
} from '../types/index.js';
import { useAuth } from './AuthContext.js';

interface CampusDataContextType {
  buildings: Building[];
  rooms: Room[];
  timetables: TimetableEntry[];
  busRoutes: BusRoute[];
  buses: Bus[];
  laboratories: Laboratory[];
  equipment: LabEquipment[];
  reservations: LabReservation[];
  grievances: Grievance[];
  energyMetrics: EnergyMetric[];
  announcements: CampusAnnouncement[];
  emergencyAlerts: EmergencyAlert[];
  queueTokens: QueueToken[];
  lostFound: LostFoundItem[];
  documents: CampusDocument[];
  recommendations: AIRecommendation[];
  notifications: NotificationItem[];
  loading: boolean;
  refreshData: () => Promise<void>;
  
  // Mutations
  createReservation: (data: { labId: string; equipmentId?: string; date: string; startTime: string; endTime: string; purpose: string }) => Promise<{ success: boolean; message: string }>;
  updateReservationStatus: (id: string, status: 'confirmed' | 'rejected', reason?: string) => Promise<boolean>;
  submitGrievance: (data: { title: string; description: string; category: any; location: string; priority?: any; buildingId?: string; roomId?: string }) => Promise<{ success: boolean; referenceNo?: string; error?: string }>;
  updateGrievanceStatus: (id: string, updates: Partial<Grievance>) => Promise<boolean>;
  resolveTimetableConflict: (timetableId: string, targetRoomId: string, targetRoomName: string) => Promise<boolean>;
  takeQueueToken: (serviceType: 'registrar' | 'accounts' | 'library' | 'hostel_desk' | 'id_cards') => Promise<QueueToken | null>;
  advanceQueueToken: (tokenId: string, status: 'called' | 'completed' | 'cancelled', counterNumber?: number) => Promise<boolean>;
  acknowledgeEmergencyAlert: (alertId: string) => Promise<boolean>;
  publishEmergencyAlert: (data: { title: string; severity: 'critical' | 'warning' | 'info'; message: string; location: string; recommendedActions: string[] }) => Promise<boolean>;
  reportLostFound: (data: Omit<LostFoundItem, 'id' | 'status' | 'dateReported'>) => Promise<boolean>;
  runOrchestrationScenario: (scenarioId: string) => Promise<{ success: boolean; workflowTitle: string; stepsExecuted: any[] }>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  applyRecommendation: (id: string) => void;
}

const CampusDataContext = createContext<CampusDataContextType | undefined>(undefined);

export const CampusDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [timetables, setTimetables] = useState<TimetableEntry[]>([]);
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [equipment, setEquipment] = useState<LabEquipment[]>([]);
  const [reservations, setReservations] = useState<LabReservation[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [energyMetrics, setEnergyMetrics] = useState<EnergyMetric[]>([]);
  const [announcements, setAnnouncements] = useState<CampusAnnouncement[]>([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [queueTokens, setQueueTokens] = useState<QueueToken[]>([]);
  const [lostFound, setLostFound] = useState<LostFoundItem[]>([]);
  const [documents, setDocuments] = useState<CampusDocument[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/data/all');
      if (!res.ok) throw new Error('Failed to fetch campus dataset');
      const data = await res.json();
      setBuildings(data.buildings || []);
      setRooms(data.rooms || []);
      setTimetables(data.timetables || []);
      setBusRoutes(data.busRoutes || []);
      setBuses(data.buses || []);
      setLaboratories(data.laboratories || []);
      setEquipment(data.equipment || []);
      setReservations(data.reservations || []);
      setGrievances(data.grievances || []);
      setEnergyMetrics(data.energyMetrics || []);
      setAnnouncements(data.announcements || []);
      setEmergencyAlerts(data.emergencyAlerts || []);
      setQueueTokens(data.queueTokens || []);
      setLostFound(data.lostFound || []);
      setDocuments(data.documents || []);
      setRecommendations(data.recommendations || []);
      setNotifications(data.notifications || []);
    } catch (err) {
      console.warn('Campus data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Live update interval for moving buses, room occupants, and energy telemetry
    const interval = setInterval(() => {
      fetchData();
    }, 6000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const createReservation = async (data: { labId: string; equipmentId?: string; date: string; startTime: string; endTime: string; purpose: string }) => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role
        })
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, message: resData.error || 'Failed to submit reservation' };
      }
      await fetchData();
      return { success: true, message: resData.message || 'Reservation confirmed!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error' };
    }
  };

  const updateReservationStatus = async (id: string, status: 'confirmed' | 'rejected', rejectionReason?: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason })
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const submitGrievance = async (data: { title: string; description: string; category: any; location: string; priority?: any; buildingId?: string; roomId?: string }) => {
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          studentId: currentUser.idNumber,
          studentName: currentUser.name,
          studentEmail: currentUser.email
        })
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Submission failed' };
      }
      await fetchData();
      return { success: true, referenceNo: resData.referenceNo };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  };

  const updateGrievanceStatus = async (id: string, updates: Partial<Grievance>) => {
    try {
      const res = await fetch(`/api/grievances/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const resolveTimetableConflict = async (timetableId: string, targetRoomId: string, targetRoomName: string) => {
    setTimetables(prev => prev.map(t => {
      if (t.id === timetableId) {
        return {
          ...t,
          roomId: targetRoomId,
          roomName: targetRoomName,
          isConflict: false,
          conflictReason: undefined,
          alternativeSuggestion: undefined
        };
      }
      return t;
    }));
    return true;
  };

  const takeQueueToken = async (serviceType: 'registrar' | 'accounts' | 'library' | 'hostel_desk' | 'id_cards') => {
    try {
      const res = await fetch('/api/queue/take-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType,
          studentName: currentUser.name,
          studentId: currentUser.idNumber
        })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchData();
        return data.token;
      }
      return null;
    } catch {
      return null;
    }
  };

  const advanceQueueToken = async (tokenId: string, status: 'called' | 'completed' | 'cancelled', counterNumber?: number) => {
    try {
      const res = await fetch(`/api/queue/${tokenId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, counterNumber })
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const acknowledgeEmergencyAlert = async (alertId: string) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/acknowledge`, { method: 'POST' });
      if (res.ok) {
        setEmergencyAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledgedCount: a.acknowledgedCount + 1 } : a));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const publishEmergencyAlert = async (data: { title: string; severity: 'critical' | 'warning' | 'info'; message: string; location: string; recommendedActions: string[] }) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const reportLostFound = async (data: Omit<LostFoundItem, 'id' | 'status' | 'dateReported'>) => {
    try {
      const res = await fetch('/api/lost-found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const runOrchestrationScenario = async (scenarioId: string) => {
    try {
      const res = await fetch('/api/orchestrator/run-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId })
      });
      const data = await res.json();
      await fetchData();
      return data;
    } catch (err: any) {
      return { success: false, workflowTitle: 'Cascade execution failed', stepsExecuted: [] };
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const applyRecommendation = (id: string) => {
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
    // If it's the conflict recommendation, apply it
    if (id === 'rec_1') {
      resolveTimetableConflict('tt_4_conflict', 'rm_b202', 'Machine Learning Seminar Lab (B-202)');
    }
  };

  return (
    <CampusDataContext.Provider value={{
      buildings,
      rooms,
      timetables,
      busRoutes,
      buses,
      laboratories,
      equipment,
      reservations,
      grievances,
      energyMetrics,
      announcements,
      emergencyAlerts,
      queueTokens,
      lostFound,
      documents,
      recommendations,
      notifications,
      loading,
      refreshData: fetchData,
      createReservation,
      updateReservationStatus,
      submitGrievance,
      updateGrievanceStatus,
      resolveTimetableConflict,
      takeQueueToken,
      advanceQueueToken,
      acknowledgeEmergencyAlert,
      publishEmergencyAlert,
      reportLostFound,
      runOrchestrationScenario,
      markNotificationRead,
      markAllNotificationsRead,
      applyRecommendation
    }}>
      {children}
    </CampusDataContext.Provider>
  );
};

export const useCampusData = () => {
  const context = useContext(CampusDataContext);
  if (!context) {
    throw new Error('useCampusData must be used within a CampusDataProvider');
  }
  return context;
};
