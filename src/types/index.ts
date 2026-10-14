export type UserRole = 
  | 'student' 
  | 'faculty' 
  | 'transport_admin' 
  | 'lab_admin' 
  | 'campus_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  idNumber: string; // Student ID or Faculty/Staff Emp ID
  avatarUrl?: string;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  floors: number;
  totalRooms: number;
  energyConsumptionKw: number;
  aqi: number;
  tempC: number;
  accessible: boolean;
  occupancyRate: number; // percentage 0-100
}

export type RoomType = 'lecture_hall' | 'seminar' | 'computer_lab' | 'science_lab' | 'classroom';
export type RoomOccupancyStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface Room {
  id: string;
  buildingId: string;
  buildingName: string;
  roomNumber: string;
  name: string;
  capacity: number;
  type: RoomType;
  floor: number;
  equipment: string[];
  isAccessible: boolean;
  currentOccupancy: number;
  occupancyStatus: RoomOccupancyStatus;
  sensorId: string;
  powerKw: number;
  tempC: number;
  co2Ppm: number;
  humidityPct: number;
  isSimulatedSensor?: boolean;
}

export interface TimetableEntry {
  id: string;
  courseCode: string;
  courseName: string;
  facultyId: string;
  facultyName: string;
  roomId: string;
  roomName: string;
  buildingName: string;
  dayOfWeek: number; // 1 = Mon, 2 = Tue, ..., 5 = Fri
  startTime: string; // '09:00'
  endTime: string;   // '10:30'
  studentCount: number;
  department: string;
  requiresProjector: boolean;
  requiresComputers: boolean;
  isConflict?: boolean;
  conflictReason?: string;
  alternativeSuggestion?: {
    roomId: string;
    roomName: string;
    reason: string;
  };
}

export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  sequence: number;
  scheduledArrivalTime: string;
}

export interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  totalDistanceKm: number;
  activeBusId: string;
  operatingHours: string;
  stops: BusStop[];
}

export type BusStatus = 'on_route' | 'delayed' | 'maintenance' | 'idle';

export interface Bus {
  id: string;
  busNumber: string;
  routeId: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  currentPassengers: number;
  status: BusStatus;
  delayMinutes: number;
  currentLat: number;
  currentLng: number;
  speedKmh: number;
  nextStopId: string;
  nextStopName: string;
  estimatedArrivalMins: number;
  isSimulated: boolean;
  lastUpdated: string;
}

export interface Laboratory {
  id: string;
  name: string;
  department: string;
  buildingId: string;
  buildingName: string;
  roomNumber: string;
  capacity: number;
  inChargeName: string;
  openHours: string;
  restrictedAccess: boolean;
  safetyLevel: 'standard' | 'hazmat' | 'cleanroom' | 'high_voltage';
}

export type EquipmentStatus = 'available' | 'in_use' | 'maintenance' | 'faulty';

export interface LabEquipment {
  id: string;
  labId: string;
  labName: string;
  name: string;
  serialNumber: string;
  category: string;
  status: EquipmentStatus;
  specs: Record<string, string>;
  restricted: boolean;
  maintenanceDue?: string;
  lastServiced?: string;
}

export interface LabReservation {
  id: string;
  labId: string;
  labName: string;
  equipmentId?: string;
  equipmentName?: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending_approval' | 'rejected' | 'cancelled';
  createdAt: string;
  rejectionReason?: string;
}

export type GrievanceCategory = 
  | 'facilities' 
  | 'electrical_water' 
  | 'connectivity' 
  | 'transport' 
  | 'lab_equipment' 
  | 'cleanliness' 
  | 'hostel' 
  | 'other';

export type GrievancePriority = 'low' | 'medium' | 'high' | 'urgent';
export type GrievanceStatus = 'submitted' | 'under_review' | 'in_progress' | 'resolved' | 'closed';

export interface Grievance {
  id: string;
  referenceNo: string; // e.g. "GRV-2026-1042"
  studentId: string;
  studentName: string;
  studentEmail: string;
  title: string;
  description: string;
  category: GrievanceCategory;
  location: string;
  buildingId?: string;
  roomId?: string;
  priority: GrievancePriority;
  status: GrievanceStatus;
  assignedDepartment: string;
  staffNotes?: string;
  createdAt: string;
  resolvedAt?: string;
  isDuplicate?: boolean;
  duplicateClusterId?: string;
  aiSuggestedCategory?: GrievanceCategory;
  aiSuggestedPriority?: GrievancePriority;
}

export interface EnergyMetric {
  buildingId: string;
  buildingName: string;
  currentKw: number;
  dailyKwh: number;
  peakKwToday: number;
  costEstUsd: number;
  carbonKg: number;
  timestamp: string;
  historicalHourly: { hour: string; kw: number }[];
}

export interface CampusAnnouncement {
  id: string;
  title: string;
  content: string;
  category: 'academic' | 'transport' | 'maintenance' | 'event' | 'safety';
  audience: ('all' | 'students' | 'faculty' | 'staff')[];
  priority: 'normal' | 'important' | 'urgent';
  createdAt: string;
  expiresAt: string;
  author: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  location: string;
  recommendedActions: string[];
  active: boolean;
  timestamp: string;
  acknowledgedCount: number;
}

export interface QueueToken {
  id: string;
  serviceType: 'registrar' | 'accounts' | 'library' | 'hostel_desk' | 'id_cards';
  serviceName: string;
  tokenNumber: string;
  studentName: string;
  studentId: string;
  status: 'waiting' | 'called' | 'completed' | 'cancelled';
  estWaitMinutes: number;
  counterNumber?: number;
  issuedAt: string;
}

export interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: 'electronics' | 'id_cards' | 'books' | 'accessories' | 'keys' | 'clothing';
  locationFound: string;
  dateReported: string;
  reportedBy: string;
  contactEmail: string;
  status: 'open' | 'claimed' | 'resolved';
  potentialMatchId?: string;
}

export interface CampusDocument {
  id: string;
  title: string;
  category: 'policy' | 'timetable' | 'lab_manual' | 'transport' | 'safety';
  summary: string;
  content: string;
  lastUpdated: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  category: 'resource' | 'energy' | 'transit' | 'scheduling';
  description: string;
  impact: string;
  confidence: number;
  reasoning: string;
  status: 'pending' | 'accepted' | 'dismissed';
  actionLabel?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'academic' | 'transit' | 'lab' | 'grievance' | 'maintenance' | 'safety';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface OrchestrationStep {
  stepNumber: number;
  module: string;
  action: string;
  outcome: string;
  status: 'done' | 'in_progress' | 'pending';
}

export interface OrchestrationScenario {
  id: string;
  title: string;
  description: string;
  impactedAreas: string[];
  steps: OrchestrationStep[];
}
