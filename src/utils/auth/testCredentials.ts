
export interface TestCredential {
  type: string;
  email: string;
  password: string;
  description: string;
}

export const testCredentials: TestCredential[] = [
  { type: 'System Admin', email: 'admin@eventplatform.com', password: 'admin123', description: 'Full system access' },
  { type: 'Company Owner', email: 'john@eventcorp.com', password: 'password123', description: 'EventCorp Solutions' },
  { type: 'Company Owner 2', email: 'robert@promomax.com', password: 'password123', description: 'PromoMax Events' },
  { type: 'Company Manager', email: 'sarah@eventcorp.com', password: 'password123', description: 'EventCorp Manager' },
  { type: 'Event Coordinator', email: 'alex@eventcorp.com', password: 'password123', description: 'Event Coordinator' },
  { type: 'Supervisor', email: 'mike@supervisor.com', password: 'password123', description: 'Mike Supervisor' },
  { type: 'Supervisor 2', email: 'lisa@supervisor.com', password: 'password123', description: 'Lisa Thompson' },
  { type: 'Promoter', email: 'jane@promoter.com', password: 'password123', description: 'Jane Promoter' },
  { type: 'Promoter 2', email: 'maria@promoter.com', password: 'password123', description: 'Maria Rodriguez' },
  { type: 'Promoter 3', email: 'david@promoter.com', password: 'password123', description: 'David Chen' }
];
