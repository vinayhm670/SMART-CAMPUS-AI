import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-Memory Database for Smart Campus AI
class CampusDatabase {
  users = [
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

  buildings = [
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
      accessible: false,
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

  rooms = [
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
      occupancyStatus: 'occupied',
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
      isAccessible: false,
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

  timetables = [
    {
      id: 'tt_1',
      courseCode: 'CS-401',
      courseName: 'Deep Learning & Neural Networks',
      facultyId: 'usr_fac_1',
      facultyName: 'Prof. Elena Vance',
      roomId: 'rm_a101',
      roomName: 'Turing Auditorium (A-101)',
      buildingName: 'Engineering Hall',
      dayOfWeek: 1,
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
      dayOfWeek: 1,
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
      dayOfWeek: 1,
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
      roomId: 'rm_b101',
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
      dayOfWeek: 2,
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
      dayOfWeek: 2,
      startTime: '14:00',
      endTime: '16:00',
      studentCount: 40,
      department: 'Computer Science',
      requiresProjector: true,
      requiresComputers: false
    }
  ];

  busRoutes = [
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

  buses = [
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
      speedKmh: 14,
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

  laboratories = [
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

  equipment = [
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
      status: 'faulty',
      specs: { 'Pressure Limit': '1300 bar', 'Flow Range': '0.05 - 5 mL/min', 'Autosampler': 'Dual Needle' },
      restricted: true,
      maintenanceDue: 'Immediate',
      lastServiced: '2026-06-12'
    }
  ];

  reservations = [
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

  grievances = [
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

  energyMetrics = [
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

  announcements = [
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

  emergencyAlerts = [
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

  queueTokens = [
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

  lostFound = [
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

  documents = [
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

  recommendations = [
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

  notifications = [
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

  updateBusPosition() {
    this.buses = this.buses.map(bus => {
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

const campusDb = new CampusDatabase();

// Initialize Google GenAI SDK if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Background simulation ticker
setInterval(() => {
  campusDb.updateBusPosition();
  campusDb.updateRoomTelemetry();
}, 6000);

// API Routes
app.get('/api/data/all', (req: Request, res: Response) => {
  res.json({
    users: campusDb.users,
    buildings: campusDb.buildings,
    rooms: campusDb.rooms,
    timetables: campusDb.timetables,
    busRoutes: campusDb.busRoutes,
    buses: campusDb.buses,
    laboratories: campusDb.laboratories,
    equipment: campusDb.equipment,
    reservations: campusDb.reservations,
    grievances: campusDb.grievances,
    energyMetrics: campusDb.energyMetrics,
    announcements: campusDb.announcements,
    emergencyAlerts: campusDb.emergencyAlerts,
    queueTokens: campusDb.queueTokens,
    lostFound: campusDb.lostFound,
    documents: campusDb.documents,
    recommendations: campusDb.recommendations,
    notifications: campusDb.notifications,
  });
});

app.post('/api/gemini/assistant', async (req: Request, res: Response) => {
  try {
    const { query, userRole, userName } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query string is required' });
    }

    const contextSnapshot = {
      userRole: userRole || 'student',
      userName: userName || 'Aarav Sharma',
      roomsCount: campusDb.rooms.length,
      vacantRooms: campusDb.rooms.filter(r => r.occupancyStatus === 'available').map(r => `${r.name} (${r.roomNumber}, cap: ${r.capacity})`),
      activeBuses: campusDb.buses.map(b => `${b.routeName}: ${b.busNumber} near ${b.nextStopName}, delay: ${b.delayMinutes}m, ETA: ${b.estimatedArrivalMins}m`),
      myNextClasses: campusDb.timetables.slice(0, 3).map(t => `${t.courseCode} ${t.courseName} in ${t.roomName} at ${t.startTime}`),
      unresolvedGrievances: campusDb.grievances.filter(g => g.status !== 'resolved').map(g => `[${g.referenceNo}] ${g.title} (${g.status}, priority: ${g.priority})`),
      activeAlerts: campusDb.emergencyAlerts.filter(a => a.active).map(a => `${a.title}: ${a.message}`),
      equipmentAvailability: campusDb.equipment.map(e => `${e.name} in ${e.labName}: ${e.status}`),
    };

    if (aiClient) {
      try {
        const systemPrompt = `You are the official Smart Campus AI Assistant for Apex Institute of Technology & Science.
Your persona is knowledgeable, efficient, clear, and reassuring.
Current User: ${contextSnapshot.userName} (Role: ${contextSnapshot.userRole})
Campus Context:
- Vacant Rooms Right Now: ${contextSnapshot.vacantRooms.join(', ')}
- Live Transit Status: ${contextSnapshot.activeBuses.join('; ')}
- Today's Classes: ${contextSnapshot.myNextClasses.join('; ')}
- Unresolved Issues: ${contextSnapshot.unresolvedGrievances.join('; ')}
- Active Safety Alerts: ${contextSnapshot.activeAlerts.join('; ')}
- Lab Equipment Status: ${contextSnapshot.equipmentAvailability.join('; ')}

Rules:
1. Always base answers on authorized campus data and verify facts.
2. Quote reference IDs (e.g. GRV-2026-1041, Room A-101, Bus #01) where relevant.
3. If user asks to change or book a resource, outline the clear next step and ask for confirmation.
4. Keep responses concise, well-structured, and helpful.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${systemPrompt}\n\nUser Question: ${query}`,
        });

        const reply = response.text || 'I analyzed the campus records but could not compile a response. Please try again.';
        return res.json({ reply, source: 'gemini-3.8-flash', verified: true });
      } catch (geminiErr: any) {
        console.warn('Gemini API call failed, falling back to deterministic engine:', geminiErr?.message);
      }
    }

    // Deterministic High-Fidelity Fallback
    const qLower = query.toLowerCase();
    let fallbackReply = '';
    let actionSuggestion = undefined;

    if (qLower.includes('class') || qLower.includes('timetable') || qLower.includes('where is my')) {
      const nextClass = campusDb.timetables[0];
      fallbackReply = `Your next scheduled lecture is **${nextClass.courseCode}: ${nextClass.courseName}** with ${nextClass.facultyName}.\n\n` +
        `📍 **Location:** ${nextClass.roomName} (${nextClass.buildingName})\n` +
        `⏰ **Time:** Monday, ${nextClass.startTime} - ${nextClass.endTime}\n` +
        `👥 **Registered Students:** ${nextClass.studentCount} enrolled\n` +
        `ℹ️ Room has been verified accessible with dual laser projection.`;
      actionSuggestion = { type: 'view_timetable', label: 'Open Interactive Timetable' };
    } else if (qLower.includes('bus') || qLower.includes('transport') || qLower.includes('gate') || qLower.includes('reach')) {
      const bus1 = campusDb.buses[0];
      const bus3 = campusDb.buses[2];
      fallbackReply = `Here is the live transit telemetry:\n\n` +
        `🚍 **${bus1.routeName}** (${bus1.busNumber}): Approaching **${bus1.nextStopName}**. Current speed: ${bus1.speedKmh} km/h. ETA to Campus Main Gate Hub is **${bus1.estimatedArrivalMins} minutes**.\n\n` +
        `⚠️ **${bus3.routeName}** (${bus3.busNumber}): Operating with a **${bus3.delayMinutes} min traffic delay** near Biotech Circle. Alternate Route 1 shuttle is recommended.`;
      actionSuggestion = { type: 'view_transit', label: 'View Live Transport Map' };
    } else if (qLower.includes('lab') || qLower.includes('equipment') || qLower.includes('gpu') || qLower.includes('microscope')) {
      const freeEquipment = campusDb.equipment.filter(e => e.status === 'available');
      fallbackReply = `Currently available research equipment for booking:\n\n` +
        freeEquipment.map(e => `• **${e.name}** in *${e.labName}* (Status: Available)`).join('\n') +
        `\n\nNote: Restricted items such as the FEI Nova NanoSEM require faculty endorsement prior to slot confirmation.`;
      actionSuggestion = { type: 'book_lab', label: 'Reserve Equipment Slot' };
    } else if (qLower.includes('room') || qLower.includes('vacant') || qLower.includes('available') || qLower.includes('occupancy')) {
      const freeRooms = campusDb.rooms.filter(r => r.occupancyStatus === 'available');
      fallbackReply = `Currently vacant campus spaces with active sensor monitoring:\n\n` +
        freeRooms.map(r => `• **${r.name} (${r.roomNumber})**: Capacity ${r.capacity}, Floor ${r.floor} in ${r.buildingName}. Equipment: ${r.equipment.join(', ')}`).join('\n') +
        `\n\nPIR sensors report 0 present occupants. All HVAC units set to ambient standby.`;
      actionSuggestion = { type: 'view_occupancy', label: 'Check Floor Map' };
    } else if (qLower.includes('grievance') || qLower.includes('complaint') || qLower.includes('projector') || qLower.includes('broken')) {
      const activeComplaints = campusDb.grievances.filter(g => g.status !== 'resolved');
      fallbackReply = `Active issue tracking summary:\n\n` +
        activeComplaints.slice(0, 3).map(g => `• **[${g.referenceNo}] ${g.title}**\n  Status: *${g.status}* | Priority: *${g.priority}* | Assigned: *${g.assignedDepartment}*`).join('\n\n') +
        `\n\nTo report a new facility or equipment issue, use the Grievance Submission form. AI duplicate clustering is active.`;
      actionSuggestion = { type: 'submit_grievance', label: 'Submit Facility Issue' };
    } else if (qLower.includes('alert') || qLower.includes('weather') || qLower.includes('emergency') || qLower.includes('rain')) {
      const alert = campusDb.emergencyAlerts[0];
      fallbackReply = `🚨 **${alert.title}** [${alert.severity.toUpperCase()}]\n\n${alert.message}\n\n**Official Recommended Actions:**\n` +
        alert.recommendedActions.map(a => `• ${a}`).join('\n');
    } else {
      fallbackReply = `Smart Campus AI is monitoring 5 buildings, 4 bus transit corridors, 6 research labs, and live IoT environmental sensors.\n\n` +
        `You can ask me to:\n` +
        `• Look up classroom availability or resolve timetable clashes\n` +
        `• Check live bus GPS positions and arrival estimates\n` +
        `• Reserve specialized laboratory apparatus\n` +
        `• Track or submit campus maintenance grievances\n` +
        `• Review energy consumption and environmental telemetry`;
    }

    return res.json({ reply: fallbackReply, source: 'campus-rag-engine', actionSuggestion, verified: true });
  } catch (err: any) {
    console.error('Assistant error:', err);
    res.status(500).json({ error: 'Internal assistant error', details: err?.message });
  }
});

app.post('/api/gemini/classify-complaint', async (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description required' });
  }

  const tLower = (title + ' ' + description).toLowerCase();
  let duplicateClusterId: string | undefined = undefined;
  let isDuplicate = false;

  const existingProjectorMatch = campusDb.grievances.find(g => 
    (g.roomId === 'rm_b305' || g.location.toLowerCase().includes('b-305')) &&
    (g.title.toLowerCase().includes('projector') || g.description.toLowerCase().includes('projector'))
  );

  if (existingProjectorMatch && (tLower.includes('projector') || tLower.includes('b-305') || tLower.includes('display'))) {
    isDuplicate = true;
    duplicateClusterId = existingProjectorMatch.duplicateClusterId || 'cluster_av_b305';
  }

  let category: string = 'facilities';
  let priority: string = 'medium';
  let assignedDepartment = 'Campus IT & AV Support';

  if (tLower.includes('water') || tLower.includes('leak') || tLower.includes('pipe') || tLower.includes('toilet') || tLower.includes('power')) {
    category = 'electrical_water';
    priority = tLower.includes('leak') || tLower.includes('hazard') ? 'urgent' : 'high';
    assignedDepartment = 'Facilities & Plumbing Maintenance';
  } else if (tLower.includes('wifi') || tLower.includes('internet') || tLower.includes('network') || tLower.includes('router')) {
    category = 'connectivity';
    priority = 'medium';
    assignedDepartment = 'Network Infrastructure';
  } else if (tLower.includes('bus') || tLower.includes('driver') || tLower.includes('transport') || tLower.includes('route')) {
    category = 'transport';
    priority = 'high';
    assignedDepartment = 'Transport & Fleet Logistics';
  } else if (tLower.includes('lab') || tLower.includes('microscope') || tLower.includes('gpu') || tLower.includes('chemical')) {
    category = 'lab_equipment';
    priority = 'high';
    assignedDepartment = 'Central Laboratory Administration';
  } else if (tLower.includes('trash') || tLower.includes('clean') || tLower.includes('garbage')) {
    category = 'cleanliness';
    priority = 'low';
    assignedDepartment = 'Campus Housekeeping Services';
  }

  res.json({
    suggestedCategory: category,
    suggestedPriority: priority,
    assignedDepartment,
    isDuplicate,
    duplicateClusterId,
    confidence: 0.94,
    explanation: isDuplicate 
      ? `AI detected an existing active ticket (${existingProjectorMatch?.referenceNo}) for this hardware in Room B-305. Consolidated into maintenance cluster ${duplicateClusterId}.`
      : `Categorized as '${category}' based on facility context with priority '${priority}'.`
  });
});

app.post('/api/orchestrator/run-workflow', (req: Request, res: Response) => {
  const { scenarioId } = req.body;

  if (scenarioId === 'classroom_maintenance') {
    const targetRoom = campusDb.rooms.find(r => r.id === 'rm_a201');
    if (targetRoom) {
      targetRoom.occupancyStatus = 'maintenance';
    }

    const affectedClass = campusDb.timetables.find(t => t.roomId === 'rm_a201');
    if (affectedClass) {
      affectedClass.roomId = 'rm_a102';
      affectedClass.roomName = 'Mechatronics Seminar Room (A-102)';
      affectedClass.alternativeSuggestion = {
        roomId: 'rm_a102',
        roomName: 'A-102',
        reason: 'Automated transfer from A-201 following HVAC compressor failure.'
      };
    }

    const newGrievance = {
      id: `grv_${Date.now()}`,
      referenceNo: `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: 'SYS-ORCH-01',
      studentName: 'Autonomous Facilities Dispatcher',
      studentEmail: 'facilities-bot@campus.edu',
      title: 'Automated Ticket: HVAC Compressor Overhaul in Room A-201',
      description: 'PIR and temperature sensor telemetry detected thermal runaway (31.2°C). HVAC safety circuit tripped.',
      category: 'facilities',
      location: 'Engineering Hall, Room A-201',
      buildingId: 'bld_a',
      roomId: 'rm_a201',
      priority: 'urgent',
      status: 'in_progress',
      assignedDepartment: 'HVAC & Mechanical Engineering',
      staffNotes: 'Emergency technician dispatch approved. Class ME-302 safely routed to A-102.',
      createdAt: new Date().toISOString()
    };
    campusDb.grievances.unshift(newGrievance as any);

    campusDb.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: 'Room Relocation: ME-302 Moved to A-102',
      message: 'Room A-201 is temporarily offline for HVAC servicing. ME-302 relocated to Mechatronics Seminar Room A-102.',
      type: 'academic',
      timestamp: 'Just now',
      read: false
    });

    return res.json({
      success: true,
      workflowTitle: 'Classroom Maintenance & Academic Reassignment Cascade',
      stepsExecuted: [
        { module: 'Sensors & Facilities', action: 'Thermal alarm triggered in Room A-201 (31.2°C)', status: 'done' },
        { module: 'Academic Scheduling', action: 'ME-302 (52 students) detected as affected', status: 'done' },
        { module: 'Resource Reallocation', action: 'Evaluated vacant rooms; assigned A-102 (matches capacity & laser projector)', status: 'done' },
        { module: 'Grievance & Work Order', action: `Auto-generated high-priority ticket ${newGrievance.referenceNo} for HVAC team`, status: 'done' },
        { module: 'Notification Broadcast', action: 'Dispatched push alerts to 52 enrolled students and Prof. Aris Thorne', status: 'done' }
      ]
    });
  }

  if (scenarioId === 'transit_delay') {
    const bus = campusDb.buses.find(b => b.id === 'bus_103');
    if (bus) {
      bus.status = 'delayed';
      bus.delayMinutes = 26;
      bus.speedKmh = 11;
    }

    campusDb.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: 'Severe Transit Alert: Route 3 (+26m)',
      message: 'Bus #03 stalled in highway bottleneck. 39 students advised to take Route 1 connection at Orchard Lake.',
      type: 'transit',
      timestamp: 'Just now',
      read: false
    });

    return res.json({
      success: true,
      workflowTitle: 'Live Transit Congestion & Academic Contingency Cascade',
      stepsExecuted: [
        { module: 'Fleet Telemetry', action: 'GPS beacon on Bus #03 reports crawl speed of 11 km/h for >15 minutes', status: 'done' },
        { module: 'Passenger Analytics', action: '39 registered riders aboard; 22 have 9:00 AM lectures in Engineering Hall', status: 'done' },
        { module: 'Academic Coordination', action: 'Notified Course Coordinators for CS-401 and ME-302 regarding excused late arrivals', status: 'done' },
        { module: 'Fleet Re-route', action: 'Dispatched internal EV Shuttle #04 to intercept Orchard Lake transfer hub', status: 'done' }
      ]
    });
  }

  res.status(400).json({ error: 'Unknown scenario ID' });
});

app.post('/api/reservations', (req: Request, res: Response) => {
  const { labId, equipmentId, date, startTime, endTime, purpose, userId, userName, userRole } = req.body;
  if (!labId || !date || !startTime || !endTime || !purpose) {
    return res.status(400).json({ error: 'Missing required reservation fields' });
  }

  const lab = campusDb.laboratories.find(l => l.id === labId);
  const equip = equipmentId ? campusDb.equipment.find(e => e.id === equipmentId) : undefined;

  const overlap = campusDb.reservations.find(r => 
    r.labId === labId &&
    (equipmentId ? r.equipmentId === equipmentId : true) &&
    r.date === date &&
    r.status === 'confirmed' &&
    ((startTime >= r.startTime && startTime < r.endTime) || (endTime > r.startTime && endTime <= r.endTime))
  );

  if (overlap) {
    return res.status(409).json({ error: `Conflicting reservation already exists for this slot (${overlap.startTime} - ${overlap.endTime}) by ${overlap.userName}.` });
  }

  const isRestricted = equip?.restricted || lab?.restrictedAccess;
  const newReservation = {
    id: `res_${Date.now()}`,
    labId,
    labName: lab?.name || 'General Lab',
    equipmentId,
    equipmentName: equip?.name,
    userId: userId || 'usr_stu_1',
    userName: userName || 'Aarav Sharma',
    userRole: userRole || 'student',
    purpose,
    date,
    startTime,
    endTime,
    status: isRestricted ? 'pending_approval' : 'confirmed',
    createdAt: new Date().toISOString()
  };

  campusDb.reservations.unshift(newReservation as any);
  res.status(201).json({ reservation: newReservation, message: isRestricted ? 'Reservation submitted for Lab Administrator approval.' : 'Reservation confirmed!' });
});

app.patch('/api/reservations/:id', (req: Request, res: Response) => {
  const { status, rejectionReason } = req.body;
  const reservation = campusDb.reservations.find(r => r.id === req.params.id);
  if (!reservation) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  reservation.status = status;
  if (rejectionReason) (reservation as any).rejectionReason = rejectionReason;
  res.json({ success: true, reservation });
});

app.post('/api/grievances', (req: Request, res: Response) => {
  const { title, description, category, location, priority, studentId, studentName, studentEmail, buildingId, roomId } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, description and category are required' });
  }

  const referenceNo = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const newGrievance = {
    id: `grv_${Date.now()}`,
    referenceNo,
    studentId: studentId || 'STU-2024-8192',
    studentName: studentName || 'Aarav Sharma',
    studentEmail: studentEmail || 'aarav.s@campus.edu',
    title,
    description,
    category,
    location: location || 'Campus Grounds',
    buildingId,
    roomId,
    priority: priority || 'medium',
    status: 'submitted',
    assignedDepartment: category === 'transport' ? 'Transport & Fleet Logistics' : category === 'connectivity' ? 'Network Infrastructure' : 'Facilities Maintenance',
    createdAt: new Date().toISOString()
  };

  campusDb.grievances.unshift(newGrievance as any);
  res.status(201).json({ grievance: newGrievance, referenceNo });
});

app.patch('/api/grievances/:id', (req: Request, res: Response) => {
  const { status, staffNotes, assignedDepartment, priority } = req.body;
  const grievance = campusDb.grievances.find(g => g.id === req.params.id);
  if (!grievance) {
    return res.status(404).json({ error: 'Grievance not found' });
  }

  if (status) grievance.status = status;
  if (staffNotes) (grievance as any).staffNotes = staffNotes;
  if (assignedDepartment) grievance.assignedDepartment = assignedDepartment;
  if (priority) (grievance as any).priority = priority;
  if (status === 'resolved') (grievance as any).resolvedAt = new Date().toISOString();

  res.json({ success: true, grievance });
});

app.post('/api/queue/take-token', (req: Request, res: Response) => {
  const { serviceType, studentName, studentId } = req.body;
  const serviceNames: Record<string, string> = {
    registrar: 'Academic Transcripts & Verification Counter',
    accounts: 'Fee & Scholarship Administration Desk',
    library: 'Reference Desk & Inter-Library Loan',
    hostel_desk: 'Campus Housing & Maintenance Counter',
    id_cards: 'Smart ID & Access Badge Issuance'
  };

  const prefix = serviceType ? serviceType.substring(0, 3).toUpperCase() : 'SRV';
  const tokenNumber = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
  const newToken = {
    id: `q_${Date.now()}`,
    serviceType: serviceType || 'registrar',
    serviceName: serviceNames[serviceType] || 'General Campus Counter',
    tokenNumber,
    studentName: studentName || 'Aarav Sharma',
    studentId: studentId || 'STU-2024-8192',
    status: 'waiting',
    estWaitMinutes: Math.floor(6 + Math.random() * 12),
    issuedAt: new Date().toISOString()
  };

  campusDb.queueTokens.push(newToken as any);
  res.status(201).json({ token: newToken });
});

app.patch('/api/queue/:id', (req: Request, res: Response) => {
  const { status, counterNumber } = req.body;
  const token = campusDb.queueTokens.find(q => q.id === req.params.id);
  if (!token) {
    return res.status(404).json({ error: 'Token not found' });
  }

  token.status = status;
  if (counterNumber) (token as any).counterNumber = counterNumber;
  if (status === 'called') token.estWaitMinutes = 0;
  res.json({ success: true, token });
});

app.post('/api/alerts/:id/acknowledge', (req: Request, res: Response) => {
  const alert = campusDb.emergencyAlerts.find(a => a.id === req.params.id);
  if (alert) {
    alert.acknowledgedCount += 1;
    return res.json({ success: true, acknowledgedCount: alert.acknowledgedCount });
  }
  res.status(404).json({ error: 'Alert not found' });
});

app.post('/api/alerts', (req: Request, res: Response) => {
  const { title, severity, message, location, recommendedActions } = req.body;
  const newAlert = {
    id: `emg_${Date.now()}`,
    title,
    severity: severity || 'warning',
    message,
    location: location || 'Campus-wide',
    recommendedActions: recommendedActions || ['Follow campus safety instructions.'],
    active: true,
    timestamp: new Date().toISOString(),
    acknowledgedCount: 1
  };
  campusDb.emergencyAlerts.unshift(newAlert as any);
  res.status(201).json({ alert: newAlert });
});

app.post('/api/lost-found', (req: Request, res: Response) => {
  const { type, title, description, category, locationFound, reportedBy, contactEmail } = req.body;
  const newItem = {
    id: `lf_${Date.now()}`,
    type: type || 'lost',
    title,
    description,
    category: category || 'electronics',
    locationFound: locationFound || 'Campus Grounds',
    dateReported: new Date().toISOString(),
    reportedBy: reportedBy || 'Campus User',
    contactEmail: contactEmail || 'user@campus.edu',
    status: 'open'
  };
  campusDb.lostFound.unshift(newItem as any);
  res.status(201).json({ item: newItem });
});

app.post('/api/iot/telemetry', (req: Request, res: Response) => {
  const { sensorId, roomId, occupancyCount, powerKw, tempC, co2Ppm } = req.body;
  const room = campusDb.rooms.find(r => r.sensorId === sensorId || r.id === roomId);
  if (room) {
    if (occupancyCount !== undefined) {
      room.currentOccupancy = Number(occupancyCount);
      room.occupancyStatus = room.currentOccupancy > 0 ? 'occupied' : 'available';
    }
    if (powerKw !== undefined) room.powerKw = Number(powerKw);
    if (tempC !== undefined) room.tempC = Number(tempC);
    if (co2Ppm !== undefined) room.co2Ppm = Number(co2Ppm);
    room.isSimulatedSensor = false;
    return res.json({ success: true, message: `Sensor telemetry updated for ${room.name}` });
  }
  res.status(404).json({ error: 'Room / sensor not registered' });
});

// Setup Vite Dev Server or Production Static File Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath);

  if (isProd && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // In dev mode or fallback: mount Vite middlewares
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart Campus AI] Server running at http://0.0.0.0:${PORT} (mode: ${isProd && hasDist ? 'production' : 'vite-dev'})`);
  });
}

startServer();
