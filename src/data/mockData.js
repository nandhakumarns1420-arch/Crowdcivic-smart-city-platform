export const complaintsData = [
  {
    id: 'C-DGL-01',
    title: 'Large Pothole on Siluvathur Road',
    category: 'Roads',
    status: 'Pending',
    priority: 'High',
    date: '2026-05-15',
    location: 'Siluvathur Road, near ITI',
    ward: 'Ward 12',
    lat: 10.3673,
    lng: 77.9803,
    description: 'There is a massive pothole causing traffic slowdowns and potential damage to vehicles near the ITI college.',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800',
    department: 'Public Works',
    updates: [
      { date: '2026-05-15 09:00', text: 'Complaint filed.' },
      { date: '2026-05-15 10:30', text: 'Assigned to Public Works inspector.' }
    ]
  },
  {
    id: 'C-DGL-02',
    title: 'Streetlight out near Begampur',
    category: 'Lighting',
    status: 'In Progress',
    priority: 'Medium',
    date: '2026-05-14',
    location: 'Begampur Big Mosque Street',
    ward: 'Ward 24',
    lat: 10.3551,
    lng: 77.9712,
    description: 'The streetlight at the intersection has been out for 3 days making it unsafe at night.',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800',
    department: 'Electrical',
    updates: [
      { date: '2026-05-14 19:20', text: 'Complaint filed.' },
      { date: '2026-05-15 08:00', text: 'Technician dispatched to assess.' }
    ]
  },
  {
    id: 'C-DGL-03',
    title: 'Garbage Dump Overflow in RM Colony',
    category: 'Sanitation',
    status: 'Resolved',
    priority: 'High',
    date: '2026-05-12',
    location: 'RM Colony 4th Cross',
    ward: 'Ward 8',
    lat: 10.3725,
    lng: 77.9620,
    description: 'Garbage has not been collected for a week and is spilling onto the road.',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800',
    department: 'Waste Management',
    updates: [
      { date: '2026-05-12 08:00', text: 'Complaint filed.' },
      { date: '2026-05-13 14:00', text: 'Cleanup crew cleared the area.' },
      { date: '2026-05-13 16:00', text: 'Issue resolved.' }
    ]
  },
  {
    id: 'C-DGL-04',
    title: 'Water Pipe Leak at Mengles Road',
    category: 'Water supply',
    status: 'Pending',
    priority: 'Critical',
    date: '2026-05-16',
    location: 'Mengles Road',
    ward: 'Ward 15',
    lat: 10.3622,
    lng: 77.9755,
    description: 'Clean water is gushing out from a broken pipe near the sidewalk.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    department: 'Water Board',
    updates: [
      { date: '2026-05-16 07:30', text: 'Complaint filed.' }
    ]
  }
];

export const dindigulWards = [
  "Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", 
  "Ward 6", "Ward 7", "Ward 8", "Ward 9", "Ward 10",
  "Ward 11", "Ward 12", "Ward 13", "Ward 14", "Ward 15",
  "Ward 16", "Ward 17", "Ward 18", "Ward 19", "Ward 20",
  "Ward 21", "Ward 22", "Ward 23", "Ward 24", "Ward 25"
];

export const dindigulAreas = [
  "RM Colony", "Siluvathur Road", "Begampur", "Mengles Road", 
  "Thadicombu Road", "Palani Road", "Natham Road", "GTN Salai",
  "Balakrishnapuram", "Nehruji Nagar", "MVM Nagar", "Round Road"
];

export const statistics = {
  total: 1245,
  resolved: 856,
  inProgress: 243,
  pending: 146
};

export const chartData = [
  { name: 'Jan', resolved: 65, new: 80 },
  { name: 'Feb', resolved: 70, new: 75 },
  { name: 'Mar', resolved: 90, new: 85 },
  { name: 'Apr', resolved: 85, new: 100 },
  { name: 'May', resolved: 110, new: 90 },
];

export const categoryData = [
  { name: 'Roads', value: 400, color: '#2563EB' },
  { name: 'Sanitation', value: 300, color: '#06B6D4' },
  { name: 'Water', value: 300, color: '#22C55E' },
  { name: 'Electricity', value: 200, color: '#F59E0B' },
];
