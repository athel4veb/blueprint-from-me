
import { supabase } from '@/integrations/supabase/client';

export const seedTestUsers = async () => {
  const testUsers = [
    {
      email: 'company@test.com',
      password: 'password123',
      userData: {
        full_name: 'John Company',
        user_type: 'company',
        phone: '+1234567890'
      }
    },
    {
      email: 'promoter@test.com',
      password: 'password123',
      userData: {
        full_name: 'Jane Promoter',
        user_type: 'promoter',
        phone: '+1234567891'
      }
    },
    {
      email: 'supervisor@test.com',
      password: 'password123',
      userData: {
        full_name: 'Mike Supervisor',
        user_type: 'supervisor',
        phone: '+1234567892'
      }
    }
  ];

  console.log('Starting test user seeding...');

  for (const testUser of testUsers) {
    try {
      // Try to sign up the user
      console.log(`Attempting to create user: ${testUser.email}`);
      
      const { data, error } = await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
        options: {
          data: testUser.userData,
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`User ${testUser.email} already exists, skipping...`);
        } else {
          console.error(`Error creating user ${testUser.email}:`, error);
        }
      } else {
        console.log(`Successfully created user: ${testUser.email}`, data);
      }
    } catch (error) {
      console.error(`Failed to create user ${testUser.email}:`, error);
    }
  }

  console.log('Test user seeding completed');
};
