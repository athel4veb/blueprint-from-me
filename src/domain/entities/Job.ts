
export interface Job {
  id: string;
  title: string;
  description?: string;
  requirements?: string;
  positionsAvailable: number;
  positionsFilled: number;
  hourlyRate?: number;
  shiftStart?: string;
  shiftEnd?: string;
  status: string;
  eventId: string;
  createdAt: string;
  updatedAt: string;
}
