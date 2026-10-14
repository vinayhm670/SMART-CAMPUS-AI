import { 
  User, 
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
  NotificationItem 
} from '../src/types/index.js';

export class CampusDatabase {
  users: User[] = [
    {
      id: 'usr_stu_1',
      name: 'Aarav Sharma',
      email: 'aarav.s@campus.edu',
      role: 'student',
      department: 'Computer Science & Engineering',
      idNumber: 'STU-2024-8192',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'usr_fac_1',
      name: 'Prof. Elena Vance',
      email: 'e.vance@campus.edu',
      role: 'faculty',
      department: 'Electrical & Computer Engineering',
      idNumber: 'FAC-E-104',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'usr_trn_1',
      name: 'Marcus Brody',
      email: 'm.brody@campus.edu',
      role: 'transport_admin',
      department: 'Campus Logistics & Fleet Operations',
      idNumber: 'TRN-OPS-002',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'usr_lab_1',
      name: 'Dr. Sarah Chen',
      email: 's.chen@campus.edu',
      role: 'lab_admin',
      department: 'Advanced Sciences & Quantum Systems',
      idNumber: 'LAB-DIR-055',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'usr_adm_1',
      name: 'Dean Robert Sterling',
      email: 'dean.sterling@campus.edu',
      role: 'campus_admin',
      department: 'Office of the Vice Chancellor & Operations',
      idNumber: 'ADM-EXEC-001',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
    }
  ];

  buildings: Building[] = [
    {
      id: 'bld_a',
      name: 'Engineering Hall',
      code: 'ENG-A',
      floors: 3,
      totalRooms: 12,
      energyConsumptionKw: 142.8,
      aqi: 34,
      tempC: 22.4,
      accessible: true,
      occupancyRate: 78
    },
    {
      id: 'bld_b',
      name: 'Computing & AI Complex',
      code: 'COMP-B',
      floors: 4,
      totalRooms: 16,
      energyConsumptionKw: 218.4,
      aqi: 28,
      tempC: 21.0,
      accessible: true,
      occupancyRate: 85
    },
    {
      id: 'bld_c',
      name: 'Humanities & Core Arts',
      code: 'HUM-C',
      floors: 2,
      totalRooms: 10,
      energyConsumptionKw: 74.2,
      aqi: 41,
      tempC: 23.8,
      accessible: false, // Older building, has ramp on ground floor only
      occupancyRate: 42
    },
    {
      id: 'bld_l',
      name: 'Advanced Discovery Research Labs',
      code: 'LAB-L',
      floors: 3,
      totalRooms: 8,
      energyConsumptionKw: 310.5,
      aqi: 18,
      tempC: 20.2,
      accessible: true,
      occupancyRate: 64
    },
    {
      id: 'bld_s',
      name: 'Student Services & Academic Commons',
      code: 'SVC-S',
      floors: 2,
      totalRooms: 6,
      energyConsumptionKw: 92.0,
      aqi: 38,
      tempC: 22.8,
      accessible: true,
      occupancyRate: 90
    }
  ];

  rooms: Room[] = [
    {
      id: 'rm_a101',
      buildingId: 'bld_a',
      buildingName: 'Engineering Hall',
      roomNumber: 'A-101',
      name: 'Turing Auditorium',
      capacity: 120,
      type: 'lecture_hall',
      floor: 1,
      equipment: ['Dual Laser Projectors', 'Surround Audio', 'Hearing Loop', 'Lecture Capture Camera'],
      isAccessible: true,
      currentOccupancy: 94,
      occupancyStatus: 'occupied',
      sensorId: 'ESP32-PIR-A101',
      powerKw: 18.2,
      tempC: 22.0,
      co2Ppm: 540,
      humidityPct: 45,
      isSimulatedSensor: true
    },
    {
      id: 'rm_a102',
      buildingId: 'bld_a',
      buildingName: 'Engineering Hall',
      roomNumber: 'A-102',
      name: 'Mechatronics Seminar Room',
      capacity: 45,
      type: 'seminar',
      floor: 1,
      equipment: ['Interactive Smart Board', 'Teleconference Kit'],
      isAccessible: true,
      currentOccupancy: 0,
      occupancyStatus: 'available',
      sensorId: 'ESP32-PIR-A102',
      powerKw: 2.1,
      tempC: 21.8,
      co2Ppm: 415,
      humidityPct: 42,
      isSimulatedSensor: true
    },
    {
      id: 'rm_a201',
      buildingId: 'bld_a',
      buildingName: 'Engineering Hall',
      roomNumber: 'A-201',
      name: 'Thermodynamics Lecture Room',
      capacity: 60,
      type: 'classroom',
      floor: 2,
      equipment: ['4K Projector', 'Whiteboard Wall'],
      isAccessible: true,
      currentOccupancy: 48,
      occupancyStatus: 'occupied',
      sensorId: 'ESP32-PIR-A201',
      powerKw: 7.4,
      tempC: 23.1,
      co2Ppm: 680,
      humidityPct: 48,
      isSimulatedSensor: true
    },
    {
      id: 'rm_a204',
      buildingId: 'bld_a',
      buildingName: 'Engineering Hall',
      roomNumber: 'A-204',
      name: 'Fluids & Hydraulics Lab Classroom',
      capacity: 35,
      type: 'science_lab',
      floor: 2,
      equipment: ['Fume Hood', 'Safety Shower', 'Overhead Projector'],
      isAccessible: true,
      currentOccupancy: 0,
      occupancyStatus: 'maintenance',
      sensorId: 'ESP32-PIR-A204',
      powerKw: 1.0,
      tempC: 24.5,
      co2Ppm: 420,
      humidityPct: 52,
      isSimulatedSensor: true
    },
    {
      id: 'rm_b101',
      buildingId: 'bld_b',
      buildingName: 'Computing & AI Complex',
      roomNumber: 'B-101',
      name: 'Grace Hopper Computing Hub',
      capacity: 80,
      type: 'computer_lab',
      floor: 1,
      equipment: ['80 Workstations', 'Dual 4K Displays', 'Gigabit Ethernet', 'Wheelchair Stations'],
      isAccessible: true,
      currentOccupancy: 72,
      occupancyStatus: 'occupied',
      sensorId: 'ESP32-PIR-B101',
      powerKw: 28.6,
      tempC: 20.8,
      co2Ppm: 610,
      humidityPct: 40,
      isSimulatedSensor: true
    },
    {
      id: 'rm_b202',
      buildingId: 'bld_b',
      buildingName: 'Computing & AI Complex',
      roomNumber: 'B-202',
      name: 'Machine Learning Seminar Lab',
      capacity: 50,
      type: 'computer_lab',
      floor: 2,
      equipment: ['Workstations', 'High-Spec GPUs', 'Smart Screen'],
      isAccessible: true,
      currentOccupancy: 0,
      occupancyStatus: 'available',
      sensorId: 'ESP32-PIR-B202',
      powerKw: 3.5,
      tempC: 21.2,
      co2Ppm: 430,
      humidityPct: 39,
      isSimulatedSensor: true
    },
    {
      id: 'rm_b305',
      buildingId: 'bld_b',
      buildingName: 'Computing & AI Complex',
      roomNumber: 'B-305',
      name: 'Software Systems Classroom',
      capacity: 65,
      type: 'classroom',
      floor: 3,
      equipment: ['Laser Projector', 'Hybrid Mic System'],
      isAccessible: true,
      currentOccupancy: 58,
      occupancyStatus: 'occupied',
      sensorId: 'ESP32-PIR-B305',
      powerKw: 8.9,
      tempC: 22.4,
      co2Ppm: 590,
      humidityPct: 44,
      isSimulatedSensor: true
    },
    {
      id: 'rm_c101',
      buildingId: 'bld_c',
      buildingName: 'Humanities & Core Arts',
      roomNumber: 'C-101',
      name: 'Philosophy & Ethics Hall',
      capacity: 90,
      type: 'lecture_hall',
      floor: 1,
      equipment: ['Acoustic Panels', 'Standard Projector'],
      isAccessible: true,
      currentOccupancy: 15,
      occupancyStatus: 'occupied', // Underutilized detection
      sensorId: 'ESP32-PIR-C101',
      powerKw: 11.2,
      tempC: 23.5,
      co2Ppm: 480,
      humidityPct: 46,
      isSimulatedSensor: true
    },
    {
      id: 'rm_c203',
      buildingId: 'bld_c',
      buildingName: 'Humanities & Core Arts',
      roomNumber: 'C-203',
      name: 'Linguistics Lab',
      capacity: 40,
      type: 'classroom',
      floor: 2,
      equipment: ['Audio Recording Booths', 'Projector'],
      isAccessible: false, // Staircase access only!
      currentOccupancy: 0,
      occupancyStatus: 'available',
      sensorId: 'ESP32-PIR-C203',
      powerKw: 1.8,
      tempC: 24.0,
      co2Ppm: 410,
      humidityPct: 49,
      isSimulatedSensor: true
    },
    {
      id: 'rm_l101',
      buildingId: 'bld_l',
      buildingName: 'Advanced Discovery Research Labs',
      roomNumber: 'L-101',
      name: 'Nanotechnology Cleanroom 1',
      capacity: 20,
      type: 'science_lab',
      floor: 1,
      equipment: ['HEPA Air Filter Array', 'Scanning Electron Microscope', 'Vibration Isolated Tables'],
      isAccessible: true,
      currentOccupancy: 12,
      occupancyStatus: 'occupied',
      sensorId: 'ESP32-PIR-L101',
      powerKw: 42.0,
      tempC: 19.8,
      co2Ppm: 390,
      humidityPct: 35,
      isSimulatedSensor: true
    }
  ];

  timetables: TimetableEntry[] = [
    {
      id: 'tt_1',
      courseCode: 'CS-401',
      courseName: 'Deep Learning & Neural Networks',
      facultyId: 'usr_fac_1',
      facultyName: 'Prof. Elena Vance',
      roomId: 'rm_a101',
      roomName: 'Turing Auditorium (A-101)',
      buildingName: 'Engineering Hall',
      dayOfWeek: 1, // Mon
      startTime: '09:00',
      endTime: '10:30',
      studentCount: 105,
      department: 'Computer Science',
      requiresProjector: true,
      requiresComputers: false
    },
    {
      id: 'tt_2',
      courseCode: 'EE-205',
      courseName: 'Signals & Embedded Systems',
      facultyId: 'usr_fac_1',
      facultyName: 'Prof. Elena Vance',
      roomId: 'rm_b101',
      roomName: 'Grace Hopper Computing Hub (B-101)',
      buildingName: 'Computing & AI Complex',
      dayOfWeek: 1, // Mon
      startTime: '11:00',
      endTime: '12:30',
      studentCount: 75,
      department: 'Electrical Engineering',
      requiresProjector: true,
      requiresComputers: true
    },
    {
      id: 'tt_3',
      courseCode: 'ME-302',
      courseName: 'Advanced Fluid Mechanics',
      facultyId: 'usr_fac_2',
      facultyName: 'Dr. Aris Thorne',
      roomId: 'rm_a201',
      roomName: 'Thermodynamics Lecture Room (A-201)',
      buildingName: 'Engineering Hall',
      dayOfWeek: 1, // Mon
      startTime: '14:00',
      endTime: '15:30',
      studentCount: 52,
      department: 'Mechanical Engineering',
      requiresProjector: true,
      requiresComputers: false
    },
    {
      id: 'tt_4_conflict',
      courseCode: 'CS-310',
      courseName: 'Distributed Cloud Architectures',
      facultyId: 'usr_fac_3',
      facultyName: 'Prof. Samantha Ray',
      roomId: 'rm_b101', // Overlaps with EE-205 on Monday 11:00-12:30!
      roomName: 'Grace Hopper Computing Hub (B-101)',
      buildingName: 'Computing & AI Complex',
      dayOfWeek: 1,
      startTime: '11:00',
      endTime: '12:30',
      studentCount: 45,
      department: 'Computer Science',
      requiresProjector: true,
      requiresComputers: true,
      isConflict: true,
      conflictReason: 'Double booking: Room B-101 is already allocated to EE-205 (Signals & Embedded Systems) from 11:00 to 12:30.',
      alternativeSuggestion: {
        roomId: 'rm_b202',
        roomName: 'Machine Learning Seminar Lab (B-202)',
        reason: 'Capacity 50 (matches 45 students), fully equipped with high-spec workstations and projector, located on floor 2 with elevator accessibility, completely vacant at 11:00 AM.'
      }
    },
    {
      id: 'tt_5',
      courseCode: 'HUM-102',
      courseName: 'Ethics in Technology & Society',
      facultyId: 'usr_fac_4',
      facultyName: 'Dr. Miriam Osei',
      roomId: 'rm_c101',
      roomName: 'Philosophy & Ethics Hall (C-101)',
      buildingName: 'Humanities & Core Arts',
      dayOfWeek: 2, // Tue
      startTime: '10:00',
      endTime: '11:30',
      studentCount: 85,
      department: 'Humanities',
      requiresProjector: true,
      requiresComputers: false
    },
    {
      id: 'tt_6',
      courseCode: 'CS-480',
      courseName: 'Quantum Computing Fundamentals',
      facultyId: 'usr_lab_1',
      facultyName: 'Dr. Sarah Chen',
      roomId: 'rm_b305',
      roomName: 'Software Systems Classroom (B-305)',
      buildingName: 'Computing & AI Complex',
      dayOfWeek: 2, // Tue
      startTime: '14:00',
      endTime: '16:00',
      studentCount: 40,
      department: 'Computer Science',
      requiresProjector: true,
      requiresComputers: false
    }
  ];

  busRoutes: BusRoute[] = [
    {
      id: 'route_1',
      routeNumber: 'Route 1 - North Express',
      routeName: 'North Metro Interchange ⇄ Campus Main Terminal',
      totalDistanceKm: 14.2,
      activeBusId: 'bus_101',
      operatingHours: '06:30 - 21:00',
      stops: [
        { id: 'stop_1_1', name: 'North Metro Station', lat: 12.982, lng: 77.585, sequence: 1, scheduledArrivalTime: '08:00' },
        { id: 'stop_1_2', name: 'Cyber Park Junction', lat: 12.975, lng: 77.592, sequence: 2, scheduledArrivalTime: '08:14' },
        { id: 'stop_1_3', name: 'Orchard Lake Gate', lat: 12.969, lng: 77.601, sequence: 3, scheduledArrivalTime: '08:26' },
        { id: 'stop_1_4', name: 'Campus Main Gate Hub', lat: 12.960, lng: 77.610, sequence: 4, scheduledArrivalTime: '08:40' },
        { id: 'stop_1_5', name: 'Engineering & Lab Quadrant', lat: 12.958, lng: 77.614, sequence: 5, scheduledArrivalTime: '08:45' }
      ]
    },
    {
      id: 'route_2',
      routeNumber: 'Route 2 - South Corridor',
      routeName: 'South Tech City ⇄ Student Hostels ⇄ Campus Hub',
      totalDistanceKm: 11.8,
      activeBusId: 'bus_102',
      operatingHours: '07:00 - 20:30',
      stops: [
        { id: 'stop_2_1', name: 'South Tech City Hub', lat: 12.940, lng: 77.590, sequence: 1, scheduledArrivalTime: '08:05' },
        { id: 'stop_2_2', name: 'Greenwood Hostels Block 1-4', lat: 12.949, lng: 77.602, sequence: 2, scheduledArrivalTime: '08:20' },
        { id: 'stop_2_3', name: 'Faculty Residences Gate B', lat: 12.955, lng: 77.608, sequence: 3, scheduledArrivalTime: '08:32' },
        { id: 'stop_2_4', name: 'Campus Main Gate Hub', lat: 12.960, lng: 77.610, sequence: 4, scheduledArrivalTime: '08:42' }
      ]
    },
    {
      id: 'route_3',
      routeNumber: 'Route 3 - East Hills Feeder',
      routeName: 'East Ring Road ⇄ Research Park ⇄ Main Campus',
      totalDistanceKm: 18.5,
      activeBusId: 'bus_103',
      operatingHours: '06:45 - 22:00',
      stops: [
        { id: 'stop_3_1', name: 'East Ring Transit Center', lat: 12.965, lng: 77.640, sequence: 1, scheduledArrivalTime: '07:50' },
        { id: 'stop_3_2', name: 'Biotech Research Circle', lat: 12.962, lng: 77.625, sequence: 2, scheduledArrivalTime: '08:10' },
        { id: 'stop_3_3', name: 'University Medical Center', lat: 12.959, lng: 77.618, sequence: 3, scheduledArrivalTime: '08:28' },
        { id: 'stop_3_4', name: 'Engineering & Lab Quadrant', lat: 12.958, lng: 77.614, sequence: 4, scheduledArrivalTime: '08:40' }
      ]
    },
    {
      id: 'route_4',
      routeNumber: 'Route 4 - Campus Internal Shuttle',
      routeName: 'Sports Arena ⇄ Library ⇄ Admin ⇄ Hostels Loop',
      totalDistanceKm: 5.2,
      activeBusId: 'bus_104',
      operatingHours: '07:30 - 23:00 (Every 15 mins)',
      stops: [
        { id: 'stop_4_1', name: 'Olympic Sports Complex', lat: 12.955, lng: 77.612, sequence: 1, scheduledArrivalTime: 'Continuous' },
        { id: 'stop_4_2', name: 'Central University Library', lat: 12.957, lng: 77.611, sequence: 2, scheduledArrivalTime: 'Continuous' },
        { id: 'stop_4_3', name: 'Engineering Hall (A-Block)', lat: 12.958, lng: 77.614, sequence: 3, scheduledArrivalTime: 'Continuous' },
        { id: 'stop_4_4', name: 'Student Services Commons', lat: 12.960, lng: 77.609, sequence: 4, scheduledArrivalTime: 'Continuous' }
      ]
    }
  ];

  buses: Bus[] = [
    {
      id: 'bus_101',
      busNumber: 'KA-04-E-8821 (Bus #01)',
      routeId: 'route_1',
      routeName: 'Route 1 - North Express',
      driverName: 'Vikram Singh',
      driverPhone: '+91 98450 12345',
      capacity: 54,
      currentPassengers: 46,
      status: 'on_route',
      delayMinutes: 2,
      currentLat: 12.971,
      currentLng: 77.598,
      speedKmh: 38,
      nextStopId: 'stop_1_3',
      nextStopName: 'Orchard Lake Gate',
      estimatedArrivalMins: 4,
      isSimulated: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'bus_102',
      busNumber: 'KA-04-E-8822 (Bus #02)',
      routeId: 'route_2',
      routeName: 'Route 2 - South Corridor',
      driverName: 'Joseph D\'Souza',
      driverPhone: '+91 98450 67890',
      capacity: 54,
      currentPassengers: 52,
      status: 'on_route',
      delayMinutes: 0,
      currentLat: 12.952,
      currentLng: 77.605,
      speedKmh: 42,
      nextStopId: 'stop_2_3',
      nextStopName: 'Faculty Residences Gate B',
      estimatedArrivalMins: 3,
      isSimulated: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'bus_103',
      busNumber: 'KA-04-E-8823 (Bus #03)',
      routeId: 'route_3',
      routeName: 'Route 3 - East Hills Feeder',
      driverName: 'Ramesh Gowda',
      driverPhone: '+91 98450 54321',
      capacity: 50,
      currentPassengers: 39,
      status: 'delayed',
      delayMinutes: 18,
      currentLat: 12.963,
      currentLng: 77.632,
      speedKmh: 14, // Traffic crawl
      nextStopId: 'stop_3_2',
      nextStopName: 'Biotech Research Circle',
      estimatedArrivalMins: 22,
      isSimulated: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'bus_104',
      busNumber: 'KA-04-EV-9001 (Electric Shuttle #04)',
      routeId: 'route_4',
      routeName: 'Route 4 - Campus Internal Shuttle',
      driverName: 'Deepa Kulkarni',
      driverPhone: '+91 98450 99887',
      capacity: 32,
      currentPassengers: 19,
      status: 'on_route',
      delayMinutes: 0,
      currentLat: 12.957,
      currentLng: 77.612,
      speedKmh: 20,
      nextStopId: 'stop_4_2',
      nextStopName: 'Central University Library',
      estimatedArrivalMins: 2,
      isSimulated: true,
      lastUpdated: new Date().toISOString()
    }
  ];

  laboratories: Laboratory[] = [
    {
      id: 'lab_1',
      name: 'Quantum & Advanced Nanomaterials Lab',
      department: 'Physics & Materials Science',
      buildingId: 'bld_l',
      buildingName: 'Advanced Discovery Research Labs',
      roomNumber: 'L-101 Cleanroom',
      capacity: 15,
      inChargeName: 'Dr. Sarah Chen',
      openHours: '08:00 - 20:00',
      restrictedAccess: true,
      safetyLevel: 'cleanroom'
    },
    {
      id: 'lab_2',
      name: 'High-Performance AI & Supercomputing Cluster',
      department: 'Computer Science & Engineering',
      buildingId: 'bld_b',
      buildingName: 'Computing & AI Complex',
      roomNumber: 'B-008 Sub-level',
      capacity: 25,
      inChargeName: 'Prof. Marcus Vance',
      openHours: '24/7 (Authorized Pass Only)',
      restrictedAccess: true,
      safetyLevel: 'standard'
    },
    {
      id: 'lab_3',
      name: 'Autonomous Robotics & Drones Testbed',
      department: 'Robotics & Automation',
      buildingId: 'bld_a',
      buildingName: 'Engineering Hall',
      roomNumber: 'A-012 Flight Bay',
      capacity: 30,
      inChargeName: 'Dr. Tanya Reynolds',
      openHours: '08:30 - 18:30',
      restrictedAccess: false,
      safetyLevel: 'high_voltage'
    },
    {
      id: 'lab_4',
      name: 'Biochemical Synthesis & Chromatography Lab',
      department: 'Chemical Engineering',
      buildingId: 'bld_l',
      buildingName: 'Advanced Discovery Research Labs',
      roomNumber: 'L-204',
      capacity: 20,
      inChargeName: 'Dr. Walter Bishop',
      openHours: '09:00 - 17:00',
      restrictedAccess: true,
      safetyLevel: 'hazmat'
    }
  ];

  equipment: LabEquipment[] = [
    {
      id: 'eq_1',
      labId: 'lab_1',
      labName: 'Quantum & Advanced Nanomaterials Lab',
      name: 'FEI Nova NanoSEM 450 (Scanning Electron Microscope)',
      serialNumber: 'SEM-FEI-2023-09',
      category: 'Microscopy',
      status: 'available',
      specs: { 'Resolution': '1.0 nm at 15 kV', 'Vacuum': 'High/Low Vacuum', 'Detector': 'ETD, TLD' },
      restricted: true,
      maintenanceDue: '2026-11-20',
      lastServiced: '2026-08-15'
    },
    {
      id: 'eq_2',
      labId: 'lab_2',
      labName: 'High-Performance AI & Supercomputing Cluster',
      name: 'NVIDIA DGX H100 Node #4 (8x 80GB GPUs)',
      serialNumber: 'DGX-H100-NODE04',
      category: 'Compute Cluster',
      status: 'in_use',
      specs: { 'Total VRAM': '640 GB SXM5', 'Interconnect': 'NVLink 900 GB/s', 'FP8 Peak': '32 PetaFLOPS' },
      restricted: true,
      maintenanceDue: '2026-12-01',
      lastServiced: '2026-09-10'
    },
    {
      id: 'eq_3',
      labId: 'lab_3',
      labName: 'Autonomous Robotics & Drones Testbed',
      name: 'Vicon Vero Optical Motion Capture System (16 Cameras)',
      serialNumber: 'VICON-VERO-SYS16',
      category: 'Tracking & Sensing',
      status: 'available',
      specs: { 'Frame Rate': '420 fps', 'Latency': '< 4 ms', 'Tracking Volume': '10m x 8m x 4m' },
      restricted: false,
      maintenanceDue: '2026-11-05',
      lastServiced: '2026-07-22'
    },
    {
      id: 'eq_4',
      labId: 'lab_4',
      labName: 'Biochemical Synthesis & Chromatography Lab',
      name: 'Agilent 1290 Infinity II UHPLC System',
      serialNumber: 'AGILENT-UHPLC-774',
      category: 'Chromatography',
      status: 'faulty', // Active fault trigger
      specs: { 'Pressure Limit': '1300 bar', 'Flow Range': '0.05 - 5 mL/min', 'Autosampler': 'Dual Needle' },
      restricted: true,
      maintenanceDue: 'Immediate',
      lastServiced: '2026-06-12'
    }
  ];

  reservations: LabReservation[] = [
    {
      id: 'res_1',
      labId: 'lab_2',
      labName: 'High-Performance AI & Supercomputing Cluster',
      equipmentId: 'eq_2',
      equipmentName: 'NVIDIA DGX H100 Node #4 (8x 80GB GPUs)',
      userId: 'usr_stu_1',
      userName: 'Aarav Sharma',
      userRole: 'student',
      purpose: 'Training 7B parameter multimodal student assistant model for thesis project.',
      date: '2026-10-14',
      startTime: '10:00',
      endTime: '14:00',
      status: 'confirmed',
      createdAt: '2026-10-12T14:30:00Z'
    },
    {
      id: 'res_2',
      labId: 'lab_1',
      labName: 'Quantum & Advanced Nanomaterials Lab',
      equipmentId: 'eq_1',
      equipmentName: 'FEI Nova NanoSEM 450 (Scanning Electron Microscope)',
      userId: 'usr_fac_1',
      userName: 'Prof. Elena Vance',
      userRole: 'faculty',
      purpose: 'Graphene wafer cross-section imaging for DARPA-sponsored substrate grant.',
      date: '2026-10-15',
      startTime: '13:00',
      endTime: '16:00',
      status: 'confirmed',
      createdAt: '2026-10-13T09:15:00Z'
    },
    {
      id: 'res_3',
      labId: 'lab_1',
      labName: 'Quantum & Advanced Nanomaterials Lab',
      equipmentId: 'eq_1',
      equipmentName: 'FEI Nova NanoSEM 450 (Scanning Electron Microscope)',
      userId: 'usr_stu_1',
      userName: 'Aarav Sharma',
      userRole: 'student',
      purpose: 'Undergraduate Senior Capstone: Characterization of 2D molybdenum disulfide.',
      date: '2026-10-16',
      startTime: '14:00',
      endTime: '17:00',
      status: 'pending_approval',
      createdAt: '2026-10-14T06:00:00Z'
    }
  ];

  grievances: Grievance[] = [
    {
      id: 'grv_1041',
      referenceNo: 'GRV-2026-1041',
      studentId: 'STU-2024-8192',
      studentName: 'Aarav Sharma',
      studentEmail: 'aarav.s@campus.edu',
      title: 'Main Projector Bulb Flickering and Overheating in B-305',
      description: 'During CS-480 lecture yesterday, the ceiling ceiling projector cut off 4 times with an orange thermal warning light. Faculty could not display slide deck.',
      category: 'facilities',
      location: 'Computing & AI Complex, Room B-305',
      buildingId: 'bld_b',
      roomId: 'rm_b305',
      priority: 'high',
      status: 'in_progress',
      assignedDepartment: 'Campus IT & AV Support',
      staffNotes: 'Technician Rajesh assigned with replacement Epson EB-L200F bulb. Scheduled service today 14:00.',
      createdAt: '2026-10-13T16:20:00Z',
      isDuplicate: false,
      duplicateClusterId: 'cluster_av_b305'
    },
    {
      id: 'grv_1042',
      referenceNo: 'GRV-2026-1042',
      studentId: 'STU-2023-4410',
      studentName: 'Rohan Mehra',
      studentEmail: 'rohan.m@campus.edu',
      title: 'Projector in B-305 completely turns black after 10 mins',
      description: 'Second time this week! Projector lamp in B-305 is dying. Whole class had to crowd around one laptop.',
      category: 'facilities',
      location: 'Computing & AI Complex, Room B-305',
      buildingId: 'bld_b',
      roomId: 'rm_b305',
      priority: 'high',
      status: 'in_progress',
      assignedDepartment: 'Campus IT & AV Support',
      staffNotes: 'AI Duplicate Cluster Detection: linked with GRV-2026-1041. Single unified AV dispatch created.',
      createdAt: '2026-10-14T07:10:00Z',
      isDuplicate: true,
      duplicateClusterId: 'cluster_av_b305'
    },
    {
      id: 'grv_1043',
      referenceNo: 'GRV-2026-1043',
      studentId: 'STU-2024-9912',
      studentName: 'Priya Nambiar',
      studentEmail: 'priya.n@campus.edu',
      title: 'Water Cooler on 2nd Floor Engineering Hall leaking onto floor',
      description: 'Cold water dispenser near Room A-201 has a cracked drain tube. Puddle is creating a serious slip hazard for students exiting the stairwell.',
      category: 'electrical_water',
      location: 'Engineering Hall, 2nd Floor Corridor',
      buildingId: 'bld_a',
      priority: 'urgent',
      status: 'submitted',
      assignedDepartment: 'Facilities & Plumbing Maintenance',
      createdAt: '2026-10-14T06:45:00Z'
    },
    {
      id: 'grv_1044',
      referenceNo: 'GRV-2026-1044',
      studentId: 'STU-2022-1204',
      studentName: 'Kunal Patel',
      studentEmail: 'kunal.p@campus.edu',
      title: 'Campus Bus #03 delayed by 25+ mins twice this week without notification',
      description: 'Route 3 from East Ring road has repeatedly arrived after 8:30 AM lectures started. Need better real-time SMS alerts or driver backup.',
      category: 'transport',
      location: 'Route 3 - East Hills',
      priority: 'medium',
      status: 'under_review',
      assignedDepartment: 'Transport & Fleet Logistics',
      createdAt: '2026-10-13T11:00:00Z'
    },
    {
      id: 'grv_1045',
      referenceNo: 'GRV-2026-1045',
      studentId: 'STU-2024-8192',
      studentName: 'Aarav Sharma',
      studentEmail: 'aarav.s@campus.edu',
      title: 'Wi-Fi 6 Access Point dropping packets in Turing Auditorium',
      description: 'Ping to campus gateway spikes to 800ms when more than 60 students connect simultaneously to AP-A101-North.',
      category: 'connectivity',
      location: 'Engineering Hall, Room A-101',
      buildingId: 'bld_a',
      roomId: 'rm_a101',
      priority: 'medium',
      status: 'resolved',
      assignedDepartment: 'Network Infrastructure',
      staffNotes: 'Firmware upgraded to v5.4.12; channel width expanded to 80MHz with load balancing active.',
      createdAt: '2026-10-10T14:00:00Z',
      resolvedAt: '2026-10-12T17:30:00Z'
    }
  ];

  energyMetrics: EnergyMetric[] = [
    {
      buildingId: 'bld_a',
      buildingName: 'Engineering Hall',
      currentKw: 142.8,
      dailyKwh: 1240.5,
      peakKwToday: 178.0,
      costEstUsd: 186.07,
      carbonKg: 521.0,
      timestamp: new Date().toISOString(),
      historicalHourly: [
        { hour: '00:00', kw: 45 }, { hour: '03:00', kw: 38 }, { hour: '06:00', kw: 52 },
        { hour: '09:00', kw: 154 }, { hour: '12:00', kw: 178 }, { hour: '15:00', kw: 162 },
        { hour: '18:00', kw: 110 }, { hour: '21:00', kw: 72 }
      ]
    },
    {
      buildingId: 'bld_b',
      buildingName: 'Computing & AI Complex',
      currentKw: 218.4,
      dailyKwh: 2680.0,
      peakKwToday: 265.0,
      costEstUsd: 402.00,
      carbonKg: 1125.6,
      timestamp: new Date().toISOString(),
      historicalHourly: [
        { hour: '00:00', kw: 120 }, { hour: '03:00', kw: 115 }, { hour: '06:00', kw: 130 },
        { hour: '09:00', kw: 230 }, { hour: '12:00', kw: 265 }, { hour: '15:00', kw: 248 },
        { hour: '18:00', kw: 195 }, { hour: '21:00', kw: 150 }
      ]
    },
    {
      buildingId: 'bld_c',
      buildingName: 'Humanities & Core Arts',
      currentKw: 74.2,
      dailyKwh: 610.2,
      peakKwToday: 95.0,
      costEstUsd: 91.53,
      carbonKg: 256.3,
      timestamp: new Date().toISOString(),
      historicalHourly: [
        { hour: '00:00', kw: 18 }, { hour: '03:00', kw: 16 }, { hour: '06:00', kw: 24 },
        { hour: '09:00', kw: 88 }, { hour: '12:00', kw: 95 }, { hour: '15:00', kw: 78 },
        { hour: '18:00', kw: 42 }, { hour: '21:00', kw: 25 }
      ]
    },
    {
      buildingId: 'bld_l',
      buildingName: 'Advanced Discovery Research Labs',
      currentKw: 310.5,
      dailyKwh: 4120.8,
      peakKwToday: 340.0,
      costEstUsd: 618.12,
      carbonKg: 1730.7,
      timestamp: new Date().toISOString(),
      historicalHourly: [
        { hour: '00:00', kw: 220 }, { hour: '03:00', kw: 215 }, { hour: '06:00', kw: 240 },
        { hour: '09:00', kw: 310 }, { hour: '12:00', kw: 340 }, { hour: '15:00', kw: 335 },
        { hour: '18:00', kw: 290 }, { hour: '21:00', kw: 255 }
      ]
    }
  ];

  announcements: CampusAnnouncement[] = [
    {
      id: 'anc_1',
      title: 'Fall Semester Midterm Examination Timetable Released',
      content: 'The official schedule for all undergraduate and postgraduate midterm examinations is now published in the Timetable Portal. Room assignments include accessibility accommodations for special needs.',
      category: 'academic',
      audience: ['all'],
      priority: 'important',
      createdAt: '2026-10-12T08:00:00Z',
      expiresAt: '2026-10-30T23:59:59Z',
      author: 'Office of the Academic Registrar'
    },
    {
      id: 'anc_2',
      title: 'Route 3 Bus Service Detour due to East Ring Road Flyover Construction',
      content: 'Starting Thursday, Bus Route 3 will bypass the East Ring Transit Center and stop at the alternate Northbound Shelter. Please anticipate a 10-15 minute variation during peak morning hours.',
      category: 'transport',
      audience: ['students', 'staff'],
      priority: 'important',
      createdAt: '2026-10-13T10:00:00Z',
      expiresAt: '2026-10-25T23:59:59Z',
      author: 'Fleet Management Division'
    },
    {
      id: 'anc_3',
      title: 'Campus-wide Green Energy Initiative: Night-time Idle Power Cutoff',
      content: 'Automatic smart relay cutoffs will be enabled across Blocks A, B, and C between 22:30 and 06:00 for non-essential lighting and HVAC. Authorized researchers in Block L are exempt.',
      category: 'maintenance',
      audience: ['all'],
      priority: 'normal',
      createdAt: '2026-10-11T12:00:00Z',
      expiresAt: '2026-11-15T23:59:59Z',
      author: 'Sustainability & Facilities Council'
    }
  ];

  emergencyAlerts: EmergencyAlert[] = [
    {
      id: 'emg_101',
      title: 'Severe Thunderstorm & Flash Flood Advisory',
      severity: 'warning',
      message: 'Meteorological Department issued an orange alert for high wind gusts (65 km/h) and heavy precipitation between 16:30 and 20:00 today. All evening outdoor sports events are suspended. Internal shuttle frequency increased.',
      location: 'Greater Metropolitan Area & University Campus Grounds',
      recommendedActions: [
        'Use indoor covered pedestrian walkways connecting Blocks A, B, and S',
        'Board campus transport at covered Main Gate Terminal',
        'Report standing water or roof leaks immediately via Grievance portal'
      ],
      active: true,
      timestamp: '2026-10-14T07:00:00Z',
      acknowledgedCount: 482
    }
  ];

  queueTokens: QueueToken[] = [
    {
      id: 'q_1',
      serviceType: 'registrar',
      serviceName: 'Academic Transcripts & Verification Counter',
      tokenNumber: 'REG-104',
      studentName: 'Aarav Sharma',
      studentId: 'STU-2024-8192',
      status: 'waiting',
      estWaitMinutes: 8,
      issuedAt: new Date(Date.now() - 12 * 60000).toISOString()
    },
    {
      id: 'q_2',
      serviceType: 'registrar',
      serviceName: 'Academic Transcripts & Verification Counter',
      tokenNumber: 'REG-103',
      studentName: 'Neha Kapoor',
      studentId: 'STU-2023-1102',
      status: 'called',
      counterNumber: 2,
      estWaitMinutes: 0,
      issuedAt: new Date(Date.now() - 25 * 60000).toISOString()
    },
    {
      id: 'q_3',
      serviceType: 'accounts',
      serviceName: 'Fee & Scholarship Administration Desk',
      tokenNumber: 'ACC-042',
      studentName: 'Zainab Qureshi',
      studentId: 'STU-2022-9014',
      status: 'waiting',
      estWaitMinutes: 14,
      issuedAt: new Date(Date.now() - 8 * 60000).toISOString()
    },
    {
      id: 'q_4',
      serviceType: 'library',
      serviceName: 'Reference Desk & Inter-Library Loan',
      tokenNumber: 'LIB-089',
      studentName: 'David Kim',
      studentId: 'STU-2024-5519',
      status: 'waiting',
      estWaitMinutes: 4,
      issuedAt: new Date(Date.now() - 5 * 60000).toISOString()
    }
  ];

  lostFound: LostFoundItem[] = [
    {
      id: 'lf_1',
      type: 'found',
      title: 'Apple iPad Air (Space Gray) in Black Folio Case',
      description: 'Found on desk row 3 in Turing Auditorium (A-101) after the 10:30 AM CS-401 lecture. Lock screen has a picture of a golden retriever.',
      category: 'electronics',
      locationFound: 'Engineering Hall, Room A-101',
      dateReported: '2026-10-14T11:00:00Z',
      reportedBy: 'Facilities Staff (R. Kumar)',
      contactEmail: 'security@campus.edu',
      status: 'open'
    },
    {
      id: 'lf_2',
      type: 'lost',
      title: 'Navy Blue Casio Scientific Calculator (fx-991CW)',
      description: 'Left in B-101 Grace Hopper Lab during Monday morning tutorial. Has small yellow sticker on the battery cover with initials AS.',
      category: 'electronics',
      locationFound: 'Computing Complex, B-101',
      dateReported: '2026-10-13T15:30:00Z',
      reportedBy: 'Aarav Sharma',
      contactEmail: 'aarav.s@campus.edu',
      status: 'open'
    },
    {
      id: 'lf_3',
      type: 'found',
      title: 'Leather Wallet with Student ID Card and Bus Pass',
      description: 'Handed over by driver Vikram Singh from Route 1 Bus #01 at Main Gate Dispatch.',
      category: 'accessories',
      locationFound: 'Bus #01 (Route 1)',
      dateReported: '2026-10-14T08:50:00Z',
      reportedBy: 'Driver Vikram Singh',
      contactEmail: 'lostfound@campus.edu',
      status: 'open'
    }
  ];

  documents: CampusDocument[] = [
    {
      id: 'doc_1',
      title: 'University Classroom & Resource Scheduling Policy',
      category: 'policy',
      summary: 'Rules governing room allocations, minimum attendance thresholds, conflict mediation, and wheelchair accessibility compliance.',
      content: `1. Room capacity must exceed registered course enrollment by at least 10%.
2. All courses containing students registered with the Accessibility Office must be assigned to Ground Floor classrooms or rooms in buildings equipped with operational ADA-compliant elevators.
3. Timetable conflicts must be reconciled through the AI Mediation Engine or Academic Dean signoff. No faculty may unilaterally occupy an unassigned lecture hall.
4. Rooms left vacant for more than 20 minutes without prior rescheduling may be flagged by automated PIR sensors for temporary release.`,
      lastUpdated: '2026-09-01'
    },
    {
      id: 'doc_2',
      title: 'Advanced Research Laboratory Access & Safety Guidelines',
      category: 'lab_manual',
      summary: 'Safety protocol for Cleanroom L-101, Supercomputing Cluster B-008, Hazmat storage, and student supervision quotas.',
      content: `1. Cleanroom L-101 requires Class 1000 gowning, safety glasses, and anti-static ESD booties.
2. High-performance compute nodes (DGX H100) must be reserved 24 hours in advance via the Laboratory Management portal. Max continuous job slot for undergraduate students is 4 hours unless endorsed by a Principal Investigator.
3. Equipment faults must be logged within 30 minutes of occurrence to trigger automatic maintenance tickets.`,
      lastUpdated: '2026-08-15'
    },
    {
      id: 'doc_3',
      title: 'Campus Fleet Transit Operations & Student Grievance SLA',
      category: 'transport',
      summary: 'Operating schedules, emergency breakdown procedures, GPS telemetry reporting, and resolution SLAs for student complaints.',
      content: `1. All fleet buses are equipped with GPS telemetry transmitting position, passenger loading, and velocity every 15 seconds.
2. Delays exceeding 15 minutes trigger automated notification broadcasts to registered riders and affected academic departments.
3. Grievances regarding vehicle safety or mechanical faults are tagged Priority 1 (Urgent) with a mandatory 4-hour inspection SLA.`,
      lastUpdated: '2026-09-20'
    }
  ];

  recommendations: AIRecommendation[] = [
    {
      id: 'rec_1',
      title: 'Resolve Timetable Conflict: CS-310 Double Booking in Room B-101',
      category: 'scheduling',
      description: 'Room B-101 is concurrently scheduled for EE-205 (75 students) and CS-310 (45 students) on Monday at 11:00 AM.',
      impact: 'Prevents 120 students from classroom disruption',
      confidence: 0.98,
      reasoning: 'Reassign CS-310 to Room B-202 (Machine Learning Lab). Room B-202 has 50 workstations, projector, elevator access, and is 100% vacant at 11:00 AM.',
      status: 'pending',
      actionLabel: 'Apply Room Reassignment',
      createdAt: '2026-10-14T07:10:00Z'
    },
    {
      id: 'rec_2',
      title: 'HVAC Schedule Optimization: Consolidate Evening Classes in Block C',
      category: 'energy',
      description: 'Philosophy Hall C-101 currently operates central HVAC for only 15 students in a 90-capacity hall between 16:00 and 18:00.',
      impact: 'Est. 42.5 kWh saved per day ($190/mo, 38 kg CO2 reduction)',
      confidence: 0.92,
      reasoning: 'Relocate this seminar to Seminar Room A-102 (capacity 45), enabling earlier HVAC setback for the entire C-Block East Wing.',
      status: 'pending',
      actionLabel: 'Schedule Relocation',
      createdAt: '2026-10-14T06:30:00Z'
    },
    {
      id: 'rec_3',
      title: 'Transit Dispatch Adjustment: Route 3 Morning Congestion Mitigation',
      category: 'transit',
      description: 'Bus #03 has accumulated average delay of 16.4 mins over the last 4 days near East Ring Road junction.',
      impact: 'Reduces student class tardiness by 84%',
      confidence: 0.89,
      reasoning: 'Advance departure by 12 minutes from East Ring Transit Center or route through Biotech Bypass lane during peak 07:45-08:15 window.',
      status: 'pending',
      actionLabel: 'Publish Route Advisory',
      createdAt: '2026-10-13T18:00:00Z'
    }
  ];

  notifications: NotificationItem[] = [
    {
      id: 'notif_1',
      title: 'Severe Thunderstorm Warning',
      message: 'High wind gusts and heavy rain forecast from 16:30. Covered walkways open; shuttle frequency doubled.',
      type: 'safety',
      timestamp: '15 mins ago',
      read: false
    },
    {
      id: 'notif_2',
      title: 'Schedule Mediation Required',
      message: 'Room B-101 has a scheduling conflict between CS-310 and EE-205 on Monday 11:00 AM.',
      type: 'academic',
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: 'notif_3',
      title: 'Bus #03 Running 18 Mins Late',
      message: 'Traffic congestion on East Ring Road. Next arrival at Biotech Circle delayed to 08:32.',
      type: 'transit',
      timestamp: '25 mins ago',
      read: false
    },
    {
      id: 'notif_4',
      title: 'Lab Booking Confirmed',
      message: 'Your reservation for NVIDIA DGX H100 Node #4 on 2026-10-14 10:00 AM has been approved.',
      type: 'lab',
      timestamp: '3 hours ago',
      read: true
    }
  ];

  // Helper methods to update state
  updateBusPosition() {
    this.buses = this.buses.map(bus => {
      // Simulate realistic jitter along route
      const deltaLat = (Math.random() - 0.48) * 0.0008;
      const deltaLng = (Math.random() - 0.48) * 0.0008;
      const speed = Math.max(10, Math.min(55, bus.speedKmh + (Math.random() - 0.5) * 6));
      return {
        ...bus,
        currentLat: Number((bus.currentLat + deltaLat).toFixed(5)),
        currentLng: Number((bus.currentLng + deltaLng).toFixed(5)),
        speedKmh: Math.round(speed),
        lastUpdated: new Date().toISOString()
      };
    });
  }

  updateRoomTelemetry() {
    this.rooms = this.rooms.map(room => {
      if (room.occupancyStatus === 'occupied') {
        const delta = Math.floor((Math.random() - 0.45) * 4);
        const newOccupancy = Math.max(1, Math.min(room.capacity, room.currentOccupancy + delta));
        const newPower = Number((room.powerKw + (Math.random() - 0.5) * 0.4).toFixed(1));
        const newCo2 = Math.round(room.co2Ppm + (Math.random() - 0.48) * 15);
        return {
          ...room,
          currentOccupancy: newOccupancy,
          powerKw: Math.max(0.5, newPower),
          co2Ppm: Math.max(380, Math.min(1100, newCo2))
        };
      }
      return room;
    });
  }
}

export const campusDb = new CampusDatabase();
