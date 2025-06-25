
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Star, User, Calendar } from 'lucide-react';
import { useRatings } from '@/presentation/hooks/useRatings';

const Ratings = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [selectedRatee, setSelectedRatee] = useState<string>('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const {
    ratingsGiven,
    ratingsReceived,
    ratableJobs,
    loading,
    error,
    submitRating,
    getAverageRating
  } = useRatings(profile?.id || '', profile?.user_type || '');

  const handleSubmitRating = async () => {
    if (!selectedJob || !rating || !selectedRatee) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await submitRating({
        jobId: selectedJob,
        raterId: profile?.id || '',
        ratedId: selectedRatee,
        rating: rating,
        comment: comment
      });

      toast({
        title: "Success",
        description: "Rating submitted successfully",
      });

      setSelectedJob('');
      setSelectedRatee('');
      setRating(0);
      setComment('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading ratings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Ratings</h1>
          <p className="text-gray-600">{error}</p>
        </div>
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
                {getAverageRating()}
              </div>
              <div className="mt-2">
                {renderStars(Math.round(getAverageRating()))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Ratings Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {ratingsReceived.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Ratings Given
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {ratingsGiven.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit New Rating */}
        {ratableJobs.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Submit New Rating</CardTitle>
              <CardDescription>Rate your experience with others</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                  >
                    <option value="">Select a job</option>
                    {ratableJobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} - {job.events?.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  {renderStars(rating, true, setRating)}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
                <Textarea
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <Button onClick={handleSubmitRating}>
                Submit Rating
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Ratings History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ratings Received */}
          <Card>
            <CardHeader>
              <CardTitle>Ratings Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {ratingsReceived.map((rating) => (
                  <div key={rating.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{rating.rater?.fullName}</p>
                        <p className="text-sm text-gray-600">
                          {rating.job?.title} - {rating.job?.event?.title}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {renderStars(rating.rating)} {rating.rating}/5
                      </Badge>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-gray-700">{rating.comment}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {ratingsReceived.length === 0 && (
                  <p className="text-center text-gray-500">No ratings received yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ratings Given */}
          <Card>
            <CardHeader>
              <CardTitle>Ratings Given</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {ratingsGiven.map((rating) => (
                  <div key={rating.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{rating.rated?.fullName}</p>
                        <p className="text-sm text-gray-600">
                          {rating.job?.title} - {rating.job?.event?.title}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {renderStars(rating.rating)} {rating.rating}/5
                      </Badge>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-gray-700">{rating.comment}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {ratingsGiven.length === 0 && (
                  <p className="text-center text-gray-500">No ratings given yet</p>
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
