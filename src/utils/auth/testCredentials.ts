
export interface TestCredential {
  type: string;
  email: string;
  password: string;
  description: string;
}

export const testCredentials: TestCredential[] = [
  { type: 'System Admin', email: 'admin@eventplatform.com', password: 'admin123', description: 'System Administrator' },
  { type: 'Company Owner', email: 'john@eventcorp.com', password: 'password123', description: 'EventCorp Solutions Owner' },
  { type: 'Company Owner', email: 'robert@promomax.com', password: 'password123', description: 'PromoMax Events Owner' },
  { type: 'Company Manager', email: 'sarah@eventcorp.com', password: 'password123', description: 'EventCorp Manager' },
  { type: 'Event Coordinator', email: 'alex@eventcorp.com', password: 'password123', description: 'Event Coordinator' },
  { type: 'Supervisor', email: 'mike@supervisor.com', password: 'password123', description: 'Mike Thompson' },
  { type: 'Supervisor', email: 'lisa@supervisor.com', password: 'password123', description: 'Lisa Rodriguez' },
  { type: 'Promoter', email: 'jane@promoter.com', password: 'password123', description: 'Jane Smith' },
  { type: 'Promoter', email: 'maria@promoter.com', password: 'password123', description: 'Maria Rodriguez' },
  { type: 'Promoter', email: 'david@promoter.com', password: 'password123', description: 'David Chen' }
];
