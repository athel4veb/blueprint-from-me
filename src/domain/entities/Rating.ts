
export interface Rating {
  id: string;
  rating: number;
  comment?: string;
  jobId: string;
  raterId: string;
  ratedId: string;
  createdAt: string;
}

export interface RatingWithDetails extends Rating {
  job?: {
    title: string;
    event: {
      title: string;
    };
  };
  rater?: {
    fullName: string;
  };
  rated?: {
    fullName: string;
  };
}
