
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface JobFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  locationFilter: string;
  onLocationChange: (value: string) => void;
  rateFilter: string;
  onRateChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

export const JobFilters = ({
  searchTerm,
  onSearchChange,
  locationFilter,
  onLocationChange,
  rateFilter,
  onRateChange,
  statusFilter,
  onStatusChange,
  onClearFilters
}: JobFiltersProps) => {
  const hasActiveFilters = searchTerm || locationFilter || rateFilter || statusFilter;

  return (
    <Card className="shadow-sm mb-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold">Filter Jobs</h3>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClearFilters}
              className="ml-auto"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Input
            placeholder="Location..."
            value={locationFilter}
            onChange={(e) => onLocationChange(e.target.value)}
          />
          
          <Input
            placeholder="Min hourly rate..."
            type="number"
            value={rateFilter}
            onChange={(e) => onRateChange(e.target.value)}
          />
          
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Job status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="filled">Filled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
