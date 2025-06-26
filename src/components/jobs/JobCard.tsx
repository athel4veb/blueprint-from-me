
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, DollarSign, Users, Building } from 'lucide-react';
import { Job } from '@/domain/entities/Job';
import { memo } from 'react';

interface JobCardProps {
  job: Job & { events?: any };
  userType?: string;
  onViewDetails: (jobId: string) => void;
  onApply?: (jobId: string) => void;
}

export const JobCard = memo(({ job, userType, onViewDetails, onApply }: JobCardProps) => {
  const positionsLeft = job.positionsAvailable - job.positionsFilled;
  
  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg line-clamp-1">{job.title}</CardTitle>
            <CardDescription className="line-clamp-1">
              {job.events?.companies?.name}
            </CardDescription>
          </div>
          <Badge 
            variant={positionsLeft > 0 ? "default" : "secondary"}
            className="shrink-0"
          >
            {positionsLeft} left
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate">{job.events?.title}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate">{job.events?.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 shrink-0" />
              <span>{job.shiftStart} - {job.shiftEnd}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 shrink-0" />
              <span>${job.hourlyRate}/hour</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 shrink-0" />
              <span>{job.positionsAvailable} positions</span>
            </div>
            <div className="flex items-center">
              <Building className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate">{job.events?.companies?.name}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>
          
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => onViewDetails(job.id)}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              View Details
            </Button>
            {userType === 'promoter' && positionsLeft > 0 && onApply && (
              <Button 
                onClick={() => onApply(job.id)}
                className="flex-1"
                size="sm"
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

JobCard.displayName = 'JobCard';
