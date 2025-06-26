
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { container } from '@/infrastructure/di/Container';
import { Camera, Save, X } from 'lucide-react';

// Enhanced validation schema with security considerations
const profileFormSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Full name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]{10,20}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  avatarUrl: z.string()
    .url('Please enter a valid URL')
    .max(500, 'URL must be less than 500 characters')
    .optional()
    .or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileEditFormProps {
  profile: any;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ProfileEditForm = ({ profile, onCancel, onSuccess }: ProfileEditFormProps) => {
  const { toast } = useToast();
  const { refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url || '');

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: profile.full_name || '',
      phone: profile.phone || '',
      avatarUrl: profile.avatar_url || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Validate avatar URL if provided
      if (data.avatarUrl) {
        try {
          const url = new URL(data.avatarUrl);
          // Only allow HTTPS URLs for security
          if (url.protocol !== 'https:') {
            throw new Error('Avatar URL must use HTTPS');
          }
          // Basic validation for image extensions
          const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
          const hasValidExtension = allowedExtensions.some(ext => 
            url.pathname.toLowerCase().endsWith(ext)
          );
          if (!hasValidExtension) {
            throw new Error('Avatar URL must point to a valid image file (jpg, jpeg, png, gif, webp)');
          }
        } catch (error) {
          toast({
            title: 'Invalid Avatar URL',
            description: error instanceof Error ? error.message : 'Please enter a valid HTTPS image URL',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
      }

      await container.userRepository.updateUser({
        id: profile.id,
        fullName: data.fullName.trim(),
        phone: data.phone?.trim() || null,
        avatarUrl: data.avatarUrl?.trim() || null,
      });

      await refreshProfile();
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUrlChange = (url: string) => {
    setAvatarPreview(url);
    form.setValue('avatarUrl', url);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </div>
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview} alt={profile.full_name} />
                <AvatarFallback className="text-lg">
                  {profile.full_name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 w-full max-w-md">
                <Label htmlFor="avatarUrl">Profile Picture URL (HTTPS only)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="avatarUrl"
                    placeholder="https://example.com/image.jpg"
                    value={form.watch('avatarUrl')}
                    onChange={(e) => handleAvatarUrlChange(e.target.value)}
                    maxLength={500}
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Must be a valid HTTPS URL pointing to an image file
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name" 
                        maxLength={100}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your phone number" 
                        maxLength={20}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Read-only Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="mt-1 text-sm text-gray-900">{profile.id}</p>
                <p className="text-xs text-gray-400">Email cannot be changed</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Account Type</Label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{profile.user_type}</p>
                <p className="text-xs text-gray-400">Contact support to change account type</p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
