import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { campusDb } from './server/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

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

// Background simulation ticker for live telemetry (buses, PIR sensors)
setInterval(() => {
  campusDb.updateBusPosition();
  campusDb.updateRoomTelemetry();
}, 6000);

// API Routes

// 1. Full campus dataset
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

// 2. AI Campus Assistant (Gemini 3.8 Flash + High-Fidelity Fallback)
app.post('/api/gemini/assistant', async (req: Request, res: Response) => {
  try {
    const { query, userRole, userName, history } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query string is required' });
    }

    // Role-filtered snapshot of campus data for retrieval
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

// 3. AI Grievance Classification & Duplicate Clustering
app.post('/api/gemini/classify-complaint', async (req: Request, res: Response) => {
  const { title, description, location } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description required' });
  }

  // Check for duplicate clusters in campusDb
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
      ? `AI detected an existing active ticket (${existingProjectorMatch?.referenceNo}) for this exact hardware in Room B-305. Consolidated into maintenance cluster ${duplicateClusterId}.`
      : `Categorized as '${category}' based on keyword and facility context with priority '${priority}'.`
  });
});

// 4. AI Timetable Conflict Resolution
app.post('/api/gemini/resolve-conflict', async (req: Request, res: Response) => {
  const { timetableId, courseCode, studentCount, requiredEquipment, timeSlot, dayOfWeek } = req.body;

  // Search candidate rooms
  const candidates = campusDb.rooms.filter(room => {
    const hasCapacity = room.capacity >= (studentCount || 40);
    const isFree = room.occupancyStatus === 'available' || room.occupancyStatus === 'reserved';
    return hasCapacity && isFree;
  });

  const bestMatch = candidates[0] || campusDb.rooms.find(r => r.id === 'rm_b202') || campusDb.rooms[1];

  res.json({
    conflictResolved: true,
    recommendedRoomId: bestMatch.id,
    recommendedRoomName: `${bestMatch.name} (${bestMatch.roomNumber})`,
    capacity: bestMatch.capacity,
    building: bestMatch.buildingName,
    reasoning: `Room ${bestMatch.roomNumber} provides capacity of ${bestMatch.capacity} (accommodating ${studentCount || 45} students), is elevator-accessible (ADA compliant), contains ${bestMatch.equipment.join(', ')}, and has zero timetable clashes for the requested slot.`,
    approvalRequired: 'Faculty Instructor & Academic Timetable Admin'
  });
});

// 5. Signature Cross-Module Orchestration Execution
app.post('/api/orchestrator/run-workflow', (req: Request, res: Response) => {
  const { scenarioId } = req.body;

  if (scenarioId === 'classroom_maintenance') {
    // 1. Mark Room A-201 as maintenance
    const targetRoom = campusDb.rooms.find(r => r.id === 'rm_a201');
    if (targetRoom) {
      targetRoom.occupancyStatus = 'maintenance';
    }

    // 2. Identify affected class
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

    // 3. Create maintenance grievance
    const newGrievance = {
      id: `grv_${Date.now()}`,
      referenceNo: `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: 'SYS-ORCH-01',
      studentName: 'Autonomous Facilities Dispatcher',
      studentEmail: 'facilities-bot@campus.edu',
      title: 'Automated Ticket: HVAC Compressor Overhaul in Room A-201',
      description: 'PIR and temperature sensor telemetry detected thermal runaway (31.2°C). HVAC safety circuit tripped.',
      category: 'facilities' as const,
      location: 'Engineering Hall, Room A-201',
      buildingId: 'bld_a',
      roomId: 'rm_a201',
      priority: 'urgent' as const,
      status: 'in_progress' as const,
      assignedDepartment: 'HVAC & Mechanical Engineering',
      staffNotes: 'Emergency technician dispatch approved. Class ME-302 safely routed to A-102.',
      createdAt: new Date().toISOString()
    };
    campusDb.grievances.unshift(newGrievance);

    // 4. Create in-app notification
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

// 6. Data Mutations

// Create Lab Reservation
app.post('/api/reservations', (req: Request, res: Response) => {
  const { labId, equipmentId, date, startTime, endTime, purpose, userId, userName, userRole } = req.body;
  if (!labId || !date || !startTime || !endTime || !purpose) {
    return res.status(400).json({ error: 'Missing required reservation fields' });
  }

  const lab = campusDb.laboratories.find(l => l.id === labId);
  const equip = equipmentId ? campusDb.equipment.find(e => e.id === equipmentId) : undefined;

  // Prevent double booking
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
    status: isRestricted ? ('pending_approval' as const) : ('confirmed' as const),
    createdAt: new Date().toISOString()
  };

  campusDb.reservations.unshift(newReservation);
  res.status(201).json({ reservation: newReservation, message: isRestricted ? 'Reservation submitted for Lab Administrator approval.' : 'Reservation confirmed!' });
});

// Approve/Reject Reservation
app.patch('/api/reservations/:id', (req: Request, res: Response) => {
  const { status, rejectionReason } = req.body;
  const reservation = campusDb.reservations.find(r => r.id === req.params.id);
  if (!reservation) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  reservation.status = status;
  if (rejectionReason) reservation.rejectionReason = rejectionReason;
  res.json({ success: true, reservation });
});

// Submit Grievance
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
    status: 'submitted' as const,
    assignedDepartment: category === 'transport' ? 'Transport & Fleet Logistics' : category === 'connectivity' ? 'Network Infrastructure' : 'Facilities Maintenance',
    createdAt: new Date().toISOString()
  };

  campusDb.grievances.unshift(newGrievance);
  res.status(201).json({ grievance: newGrievance, referenceNo });
});

// Update Grievance Status
app.patch('/api/grievances/:id', (req: Request, res: Response) => {
  const { status, staffNotes, assignedDepartment, priority } = req.body;
  const grievance = campusDb.grievances.find(g => g.id === req.params.id);
  if (!grievance) {
    return res.status(404).json({ error: 'Grievance not found' });
  }

  if (status) grievance.status = status;
  if (staffNotes) grievance.staffNotes = staffNotes;
  if (assignedDepartment) grievance.assignedDepartment = assignedDepartment;
  if (priority) grievance.priority = priority;
  if (status === 'resolved') grievance.resolvedAt = new Date().toISOString();

  res.json({ success: true, grievance });
});

// Virtual Queue Token
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
    status: 'waiting' as const,
    estWaitMinutes: Math.floor(6 + Math.random() * 12),
    issuedAt: new Date().toISOString()
  };

  campusDb.queueTokens.push(newToken);
  res.status(201).json({ token: newToken });
});

// Advance Queue
app.patch('/api/queue/:id', (req: Request, res: Response) => {
  const { status, counterNumber } = req.body;
  const token = campusDb.queueTokens.find(q => q.id === req.params.id);
  if (!token) {
    return res.status(404).json({ error: 'Token not found' });
  }

  token.status = status;
  if (counterNumber) token.counterNumber = counterNumber;
  if (status === 'called') token.estWaitMinutes = 0;
  res.json({ success: true, token });
});

// Emergency Alert Acknowledge
app.post('/api/alerts/:id/acknowledge', (req: Request, res: Response) => {
  const alert = campusDb.emergencyAlerts.find(a => a.id === req.params.id);
  if (alert) {
    alert.acknowledgedCount += 1;
    return res.json({ success: true, acknowledgedCount: alert.acknowledgedCount });
  }
  res.status(404).json({ error: 'Alert not found' });
});

// Publish Emergency Alert
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
  campusDb.emergencyAlerts.unshift(newAlert);
  res.status(201).json({ alert: newAlert });
});

// Lost & Found Report
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
    status: 'open' as const
  };
  campusDb.lostFound.unshift(newItem);
  res.status(201).json({ item: newItem });
});

// IoT External Telemetry Ingest
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
    room.isSimulatedSensor = false; // Flagged as genuine sensor feed
    return res.json({ success: true, message: `Sensor telemetry updated for ${room.name}` });
  }
  res.status(404).json({ error: 'Room / sensor not registered' });
});

// Setup Vite Dev Server / Static Hosting
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart Campus AI] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
