export interface PipelineLead {
  id: string;
  name: string;
  avatarUri: string;
  days: string;
  value: number;
  progress: number;
  status: string;
  colorType: 'primary' | 'lime';
  lat: number;
  lng: number;
  email?: string;
  phone?: string;
  company?: string;
  recentActivity?: string;
  notes?: string;
}

export const MOCK_LEADS: PipelineLead[] = [
  { 
    id: '1', name: 'Vandelay Industries', avatarUri: 'https://randomuser.me/api/portraits/men/32.jpg', days: '1 day', value: 15.5, progress: 36, status: 'Contacted', colorType: 'primary', lat: 40.7128, lng: -74.0060,
    email: 'contact@vandelay.com', phone: '+1 212-555-0199', company: 'Vandelay Industries', recentActivity: 'Emailed proposal details', notes: 'Interested in bulk latex exports.'
  },
  { 
    id: '2', name: 'Globax Corporation', avatarUri: 'https://randomuser.me/api/portraits/women/44.jpg', days: '3 day', value: 12.5, progress: 34, status: 'Contacted', colorType: 'lime', lat: 34.0522, lng: -118.2437,
    email: 'info@globax.corp', phone: '+1 310-555-8822', company: 'Globax Corporation', recentActivity: 'Scheduled follow-up call', notes: 'Need to review Q3 pricing models.'
  },
  { 
    id: '3', name: 'Wayne Enterprises', avatarUri: 'https://randomuser.me/api/portraits/men/45.jpg', days: '2 hr', value: 25.0, progress: 10, status: 'New', colorType: 'primary', lat: 41.8781, lng: -87.6298,
    email: 'bwayne@wayneenterprises.com', phone: '+1 312-555-0099', company: 'Wayne Enterprises', recentActivity: 'Lead assigned', notes: 'High value client, needs immediate attention.'
  },
  { 
    id: '4', name: 'Stark Industries', avatarUri: 'https://randomuser.me/api/portraits/men/46.jpg', days: '5 day', value: 45.0, progress: 60, status: 'Proposal Sent', colorType: 'lime', lat: 37.7749, lng: -122.4194,
    email: 'tony@stark.com', phone: '+1 415-555-9000', company: 'Stark Industries', recentActivity: 'Sent final proposal package', notes: 'Reviewing security compliance clause.'
  },
  { 
    id: '5', name: 'Acme Corp', avatarUri: 'https://randomuser.me/api/portraits/women/32.jpg', days: '1 week', value: 10.0, progress: 80, status: 'Negotiation', colorType: 'primary', lat: 51.5074, lng: -0.1278,
    email: 'purchasing@acme.co.uk', phone: '+44 20 7123 4567', company: 'Acme Corp', recentActivity: 'Counter-offer received', notes: 'Pushing for a 5% discount on bulk.'
  },
  { 
    id: '6', name: 'Cyberdyne', avatarUri: 'https://randomuser.me/api/portraits/women/33.jpg', days: '1 day', value: 100.0, progress: 100, status: 'Closed Won', colorType: 'lime', lat: 48.8566, lng: 2.3522,
    email: 'miles.d@cyberdyne.sys', phone: '+33 1 23 45 67 89', company: 'Cyberdyne Systems', recentActivity: 'Contract signed', notes: 'Initiate onboarding immediately.'
  },
  { 
    id: '7', name: 'Initech', avatarUri: 'https://randomuser.me/api/portraits/men/22.jpg', days: '2 weeks', value: 5.5, progress: 0, status: 'Closed Lost', colorType: 'primary', lat: 30.2672, lng: -97.7431,
    email: 'bill.lumbergh@initech.com', phone: '+1 512-555-2233', company: 'Initech', recentActivity: 'Project cancelled', notes: 'Went with a cheaper competitor.'
  },
];
