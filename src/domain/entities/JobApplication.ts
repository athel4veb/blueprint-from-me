
export interface JobApplication {
  id: string;
  jobId: string;
  promoterId: string;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
