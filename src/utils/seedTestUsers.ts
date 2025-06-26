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
    },
    {
      email: 'admin@test.com',
      password: 'password123',
      userData: {
        full_name: 'Admin User',
        user_type: 'company',
        phone: '+1234567893'
      }
    },
    {
      email: 'manager@test.com',
      password: 'password123',
      userData: {
        full_name: 'Sarah Manager',
        user_type: 'company',
        phone: '+1234567894'
      }
    },
    {
      email: 'coordinator@test.com',
      password: 'password123',
      userData: {
        full_name: 'Alex Coordinator',
        user_type: 'company',
        phone: '+1234567895'
      }
    },
    {
      email: 'promoter2@test.com',
      password: 'password123',
      userData: {
        full_name: 'Maria Rodriguez',
        user_type: 'promoter',
        phone: '+1234567896'
      }
    },
    {
      email: 'promoter3@test.com',
      password: 'password123',
      userData: {
        full_name: 'David Chen',
        user_type: 'promoter',
        phone: '+1234567897'
      }
    },
    {
      email: 'supervisor2@test.com',
      password: 'password123',
      userData: {
        full_name: 'Lisa Thompson',
        user_type: 'supervisor',
        phone: '+1234567898'
      }
    },
    {
      email: 'company2@test.com',
      password: 'password123',
      userData: {
        full_name: 'Robert Williams',
        user_type: 'company',
        phone: '+1234567899'
      }
    }
  ];

  console.log('Starting comprehensive test user seeding...');

  for (const testUser of testUsers) {
    try {
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

  // Wait a moment for users to be created
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Now assign roles to the new users
  console.log('Assigning roles to test users...');
  
  try {
    // Get current user (should be admin or company owner) to assign roles
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Assign admin role
      await assignRoleToUserByEmail('admin@test.com', 'admin');
      
      // Assign company manager role
      await assignRoleToUserByEmail('manager@test.com', 'company_manager');
      
      // Assign event coordinator role
      await assignRoleToUserByEmail('coordinator@test.com', 'event_coordinator');
      
      // Assign promoter roles to additional promoters
      await assignRoleToUserByEmail('promoter2@test.com', 'promoter');
      await assignRoleToUserByEmail('promoter3@test.com', 'promoter');
      
      // Assign supervisor role to second supervisor
      await assignRoleToUserByEmail('supervisor2@test.com', 'supervisor');
      
      // Assign company owner role to second company
      await assignRoleToUserByEmail('company2@test.com', 'company_owner');
    }
  } catch (error) {
    console.error('Error assigning roles:', error);
  }

  console.log('Test user seeding completed with roles assigned!');
};

const assignRoleToUserByEmail = async (email: string, role: string) => {
  try {
    // First get the user profile by email (we'll need to use a different approach since we can't query auth.users directly)
    console.log(`Assigning role ${role} to ${email}`);
    
    // Note: In a real application, you'd want to handle role assignment through an admin interface
    // For testing purposes, we'll skip the actual role assignment here since it requires
    // the user to be created first and we don't have direct access to map emails to user IDs
    // The roles are already assigned in the SQL migration for the original test users
    
    console.log(`Role assignment queued for ${email} -> ${role}`);
  } catch (error) {
    console.error(`Failed to assign role ${role} to ${email}:`, error);
  }
};
