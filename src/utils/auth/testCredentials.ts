
export interface TestCredential {
  type: string;
  email: string;
  password: string;
  description: string;
}

export const testCredentials: TestCredential[] = [
  { type: 'Manager', email: 'sarah.manager@example.com', password: 'password1', description: 'Sarah Manager' },
  { type: 'Supervisor', email: 'mike.supervisor@example.com', password: 'password2', description: 'Mike Supervisor' },
  { type: 'User', email: 'bob@example.com', password: 'password2', description: 'Bob User' },
  { type: 'Coordinator', email: 'lisa.coordinator@example.com', password: 'password3', description: 'Lisa Coordinator' },
  { type: 'Promoter', email: 'john.promotertwo@example.com', password: 'password4', description: 'John Promoter Two' },
  { type: 'Promoter', email: 'emma.promoterthree@example.com', password: 'password5', description: 'Emma Promoter Three' },
  { type: 'User', email: 'carol@example.com', password: 'password3', description: 'Carol User' },
  { type: 'Owner', email: 'david.owner@example.com', password: 'password6', description: 'David Owner' },
  { type: 'User', email: 'alice@example.com', password: 'password1', description: 'Alice User' }
];
