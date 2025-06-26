
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';

interface CalendarHeaderProps {
  userType?: string;
  onCreateEvent: () => void;
}

export const CalendarHeader = ({ userType, onCreateEvent }: CalendarHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Events Calendar</h1>
          <p className="text-gray-600">View and manage upcoming events</p>
        </div>
        {userType === 'company' && (
          <Button onClick={onCreateEvent}>
            <CalendarPlus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>
    </div>
  );
};
