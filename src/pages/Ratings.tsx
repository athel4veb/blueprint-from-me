
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Star, User, Calendar } from 'lucide-react';

interface Rating {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  job_id: string;
  rater_id: string;
  rated_id: string;
  jobs: {
    title: string;
    events: {
      title: string;
    };
  };
  rater?: {
    full_name: string;
  };
  rated?: {
    full_name: string;
  };
}

interface RatableJob {
  id: string;
  title: string;
  events: {
    title: string;
  };
  job_applications?: {
    promoter_id: string;
    status: string;
  }[];
}

const Ratings = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [ratingsGiven, setRatingsGiven] = useState<Rating[]>([]);
  const [ratingsReceived, setRatingsReceived] = useState<Rating[]>([]);
  const [ratableJobs, setRatableJobs] = useState<RatableJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [selectedRatee, setSelectedRatee] = useState<string>('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchRatings();
      fetchRatableJobs();
    }
  }, [profile]);

  const fetchRatings = async () => {
    try {
      // Ratings given by current user
      const { data: given, error: givenError } = await supabase
        .from('ratings')
        .select(`
          *,
          jobs (title, events (title)),
          rated:profiles!ratings_rated_id_fkey (full_name)
        `)
        .eq('rater_id', profile?.id)
        .order('created_at', { ascending: false });

      if (givenError) throw givenError;

      // Ratings received by current user
      const { data: received, error: receivedError } = await supabase
        .from('ratings')
        .select(`
          *,
          jobs (title, events (title)),
          rater:profiles!ratings_rater_id_fkey (full_name)
        `)
        .eq('rated_id', profile?.id)
        .order('created_at', { ascending: false });

      if (receivedError) throw receivedError;

      setRatingsGiven(given || []);
      setRatingsReceived(received || []);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatableJobs = async () => {
    try {
      if (profile?.user_type === 'company') {
        // Companies can rate promoters from completed jobs
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            id,
            title,
            events (title),
            job_applications (promoter_id, status)
          `)
          .eq('events.companies.owner_id', profile.id)
          .eq('job_applications.status', 'approved');

        if (error) throw error;
        setRatableJobs(data || []);
      } else if (profile?.user_type === 'promoter') {
        // Promoters can rate companies from jobs they worked
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            id,
            title,
            events (title)
          `)
          .eq('job_applications.promoter_id', profile.id)
          .eq('job_applications.status', 'approved');

        if (error) throw error;
        setRatableJobs(data || []);
      }
    } catch (error) {
      console.error('Error fetching ratable jobs:', error);
    }
  };

  const submitRating = async () => {
    if (!selectedJob || !rating || !selectedRatee) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('ratings')
        .insert({
          job_id: selectedJob,
          rater_id: profile?.id,
          rated_id: selectedRatee,
          rating: rating,
          comment: comment
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Rating submitted successfully",
      });

      setSelectedJob('');
      setSelectedRatee('');
      setRating(0);
      setComment('');
      fetchRatings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number, interactive = false, onStarClick?: (star: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onStarClick?.(star)}
          />
        ))}
      </div>
    );
  };

  const calculateAverageRating = (): string => {
    if (ratingsReceived.length === 0) return "0";
    const sum = ratingsReceived.reduce((acc, rating) => acc + rating.rating, 0);
    return (sum / ratingsReceived.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading ratings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ratings & Reviews</h1>
          <p className="text-gray-600">Manage your ratings and reviews</p>
        </div>

        {/* Rating Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {calculateAverageRating()}
              </div>
              <div className="flex mt-2">
                {renderStars(Math.round(parseFloat(calculateAverageRating())))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reviews Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {ratingsReceived.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reviews Given</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {ratingsGiven.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit New Rating */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Submit a Rating</CardTitle>
            <CardDescription>Rate your experience with a job</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Job</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                >
                  <option value="">Select a job...</option>
                  {ratableJobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} - {job.events.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                {renderStars(rating, true, setRating)}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
                <Textarea
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <Button onClick={submitRating}>
                Submit Rating
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Received */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Reviews Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ratingsReceived.map((rating) => (
                  <div key={rating.id} className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{rating.rater?.full_name}</span>
                      </div>
                      {renderStars(rating.rating)}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(rating.created_at).toLocaleDateString()}
                    </div>
                    <p className="text-sm text-gray-700">{rating.jobs.title} - {rating.jobs.events.title}</p>
                    {rating.comment && (
                      <p className="text-sm mt-2 text-gray-600 italic">"{rating.comment}"</p>
                    )}
                  </div>
                ))}
                {ratingsReceived.length === 0 && (
                  <div className="text-center py-4 text-gray-500">No reviews received yet</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reviews Given */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews Given</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ratingsGiven.map((rating) => (
                  <div key={rating.id} className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{rating.rated?.full_name}</span>
                      </div>
                      {renderStars(rating.rating)}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(rating.created_at).toLocaleDateString()}
                    </div>
                    <p className="text-sm text-gray-700">{rating.jobs.title} - {rating.jobs.events.title}</p>
                    {rating.comment && (
                      <p className="text-sm mt-2 text-gray-600 italic">"{rating.comment}"</p>
                    )}
                  </div>
                ))}
                {ratingsGiven.length === 0 && (
                  <div className="text-center py-4 text-gray-500">No reviews given yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Ratings;
