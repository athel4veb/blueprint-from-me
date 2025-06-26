
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  subject?: string;
  content: string;
  isRead: boolean;
  jobId?: string;
  createdAt: string;
  updatedAt: string;
}
