
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building, Globe, MapPin, Calendar, Users, Star, Edit } from 'lucide-react';
import { useState } from 'react';
import { CompanyEditForm } from '@/components/company/CompanyEditForm';

const CompanyProfile = () => {
  const { user, profile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Mock company data - in real app, this would come from the company repository
  const companyData = {
    id: 'comp-123',
    name: 'Elite Events Company',
    description: 'Premier event management company specializing in corporate events and brand activations.',
    logoUrl: '',
    website: 'https://eliteevents.com',
    location: 'New York, NY',
    foundedYear: 2015,
    employeeCount: '50-100',
    rating: 4.8,
    totalEvents: 150,
    activeJobs: 12
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !profile || profile.user_type !== 'company') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible to company accounts.</p>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <CompanyEditForm 
            company={companyData}
            onCancel={() => setIsEditing(false)}
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Profile</h1>
          <p className="text-gray-600">Manage your company information and showcase your brand</p>
        </div>

        {/* Company Overview Card */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={companyData.logoUrl} alt={companyData.name} />
                  <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                    <Building className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-3xl mb-2">{companyData.name}</CardTitle>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{companyData.rating}</span>
                    </div>
                    <Badge variant="outline">{companyData.employeeCount} employees</Badge>
                  </div>
                  <p className="text-gray-600 max-w-2xl">{companyData.description}</p>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{companyData.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <a href={companyData.website} className="font-medium text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    {companyData.website}
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Founded</p>
                  <p className="font-medium">{companyData.foundedYear}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{companyData.totalEvents}</div>
              <p className="text-sm text-gray-500">Events completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{companyData.activeJobs}</div>
              <p className="text-sm text-gray-500">Currently hiring</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-3xl font-bold text-yellow-600">{companyData.rating}</div>
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-sm text-gray-500">Average rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest platform activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">New job posted</p>
                  <p className="text-sm text-gray-500">Brand Activation Assistant - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">New review received</p>
                  <p className="text-sm text-gray-500">5-star rating from Sarah Johnson</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Company Settings</CardTitle>
              <CardDescription>Manage your company preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Notification Preferences
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Billing & Payments
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Team Management
              </Button>
              <Button variant="outline" className="w-full justify-start">
                API Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
