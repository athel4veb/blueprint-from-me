
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle, Clock, Award, BookOpen, Video, FileText } from 'lucide-react';
import { useState } from 'react';

const Training = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const trainingModules = [
    {
      id: 'event-basics',
      title: 'Event Staff Fundamentals',
      description: 'Learn the basics of professional event staffing',
      duration: '45 min',
      progress: 100,
      status: 'completed',
      certificate: true,
      lessons: [
        { title: 'Professional Appearance & Dress Code', type: 'video', duration: '8 min' },
        { title: 'Customer Service Excellence', type: 'video', duration: '12 min' },
        { title: 'Event Safety Protocols', type: 'video', duration: '10 min' },
        { title: 'Communication Skills', type: 'document', duration: '15 min' }
      ]
    },
    {
      id: 'brand-activation',
      title: 'Brand Activation Specialist',
      description: 'Master the art of brand representation and activation',
      duration: '1.5 hrs',
      progress: 60,
      status: 'in-progress',
      certificate: true,
      lessons: [
        { title: 'Understanding Brand Values', type: 'video', duration: '20 min' },
        { title: 'Engaging with Customers', type: 'video', duration: '25 min' },
        { title: 'Product Knowledge Training', type: 'document', duration: '30 min' },
        { title: 'Social Media Guidelines', type: 'video', duration: '15 min' }
      ]
    },
    {
      id: 'supervision',
      title: 'Event Supervision & Management',
      description: 'Leadership skills for event supervisors',
      duration: '2 hrs',
      progress: 0,
      status: 'not-started',
      certificate: true,
      lessons: [
        { title: 'Team Leadership Principles', type: 'video', duration: '30 min' },
        { title: 'Conflict Resolution', type: 'video', duration: '25 min' },
        { title: 'Event Logistics Management', type: 'document', duration: '35 min' },
        { title: 'Performance Evaluation', type: 'video', duration: '20 min' }
      ]
    },
    {
      id: 'sales-promo',
      title: 'Sales & Promotional Techniques',
      description: 'Advanced sales techniques for promotional events',
      duration: '1 hr',
      progress: 25,
      status: 'in-progress',
      certificate: false,
      lessons: [
        { title: 'Sales Psychology Basics', type: 'video', duration: '15 min' },
        { title: 'Handling Objections', type: 'video', duration: '20 min' },
        { title: 'Closing Techniques', type: 'video', duration: '15 min' },
        { title: 'Follow-up Strategies', type: 'document', duration: '10 min' }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Play className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Training & Certification</h1>
          <p className="text-gray-600">Enhance your skills and earn certifications to unlock better opportunities</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Award className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-gray-500">Certificates Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-gray-500">Modules Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Play className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-gray-500">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">5.5</p>
                  <p className="text-sm text-gray-500">Hours Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Training Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trainingModules.map((module) => (
            <Card key={module.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(module.status)}
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                  </div>
                  {module.certificate && (
                    <Award className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="w-full" />
                  </div>

                  {/* Module Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(module.status)}>
                        {module.status.replace('-', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-500">{module.duration}</span>
                    </div>
                    <Button 
                      variant={module.status === 'completed' ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                    >
                      {module.status === 'completed' ? 'Review' : 
                       module.status === 'in-progress' ? 'Continue' : 'Start'}
                    </Button>
                  </div>

                  {/* Lessons (expandable) */}
                  {selectedModule === module.id && (
                    <div className="mt-4 space-y-2 border-t pt-4">
                      <h4 className="font-medium text-sm text-gray-700">Lessons:</h4>
                      {module.lessons.map((lesson, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            {getLessonIcon(lesson.type)}
                            <span className="text-sm">{lesson.title}</span>
                          </div>
                          <span className="text-xs text-gray-500">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certifications Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Certifications</CardTitle>
            <CardDescription>Showcase your completed certifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <Award className="h-8 w-8 text-yellow-500" />
                <div>
                  <h4 className="font-medium">Event Staff Fundamentals</h4>
                  <p className="text-sm text-gray-500">Completed on March 15, 2024</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg opacity-50">
                <Award className="h-8 w-8 text-gray-400" />
                <div>
                  <h4 className="font-medium">Brand Activation Specialist</h4>
                  <p className="text-sm text-gray-500">In progress (60% complete)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Training;
