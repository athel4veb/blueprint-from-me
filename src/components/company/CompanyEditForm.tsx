
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Building, Save, X, Camera } from 'lucide-react';

const companyFormSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  description: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  location: z.string().min(2, 'Location is required'),
  foundedYear: z.number().min(1900).max(new Date().getFullYear()),
  employeeCount: z.string(),
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

interface CompanyEditFormProps {
  company: any;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CompanyEditForm = ({ company, onCancel, onSuccess }: CompanyEditFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(company.logoUrl || '');

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company.name || '',
      description: company.description || '',
      logoUrl: company.logoUrl || '',
      website: company.website || '',
      location: company.location || '',
      foundedYear: company.foundedYear || new Date().getFullYear(),
      employeeCount: company.employeeCount || '1-10',
    },
  });

  const onSubmit = async (data: CompanyFormData) => {
    setIsLoading(true);
    try {
      // In a real app, this would call the company repository
      console.log('Updating company:', data);
      
      toast({
        title: 'Company Profile Updated',
        description: 'Your company profile has been successfully updated.',
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error updating company profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update company profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUrlChange = (url: string) => {
    setLogoPreview(url);
    form.setValue('logoUrl', url);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Edit Company Profile</CardTitle>
            <CardDescription>Update your company information and branding</CardDescription>
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
            {/* Logo Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={logoPreview} alt={company.name} />
                <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                  <Building className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 w-full max-w-md">
                <Label htmlFor="logoUrl">Company Logo URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="logoUrl"
                    placeholder="Enter logo image URL"
                    value={form.watch('logoUrl')}
                    onChange={(e) => handleLogoUrlChange(e.target.value)}
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State/Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourcompany.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="foundedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founded Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2020"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your company, services, and what makes you unique..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
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
