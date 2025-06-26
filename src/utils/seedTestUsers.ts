
import { supabase } from '@/integrations/supabase/client';

export const seedTestUsers = async () => {
  const testUsers = [
    {
      email: 'admin@example.com',
      password: 'password123',
      userData: {
        full_name: 'System Administrator',
        user_type: 'company',
        phone: '+1234567890'
      },
      role: 'admin'
    },
    {
      email: 'john@eventcorp.com',
      password: 'password123',
      userData: {
        full_name: 'John EventCorp',
        user_type: 'company',
        phone: '+1234567891'
      },
      role: 'company_owner'
    },
    {
      email: 'sarah@eventcorp.com',
      password: 'password123',
      userData: {
        full_name: 'Sarah Manager',
        user_type: 'company',
        phone: '+1234567892'
      },
      role: 'company_manager'
    },
    {
      email: 'alex@eventcorp.com',
      password: 'password123',
      userData: {
        full_name: 'Alex Coordinator',
        user_type: 'company',
        phone: '+1234567893'
      },
      role: 'event_coordinator'
    },
    {
      email: 'mike@gmail.com',
      password: 'password123',
      userData: {
        full_name: 'Mike Supervisor',
        user_type: 'supervisor',
        phone: '+1234567894'
      },
      role: 'supervisor'
    },
    {
      email: 'lisa@gmail.com',
      password: 'password123',
      userData: {
        full_name: 'Lisa Thompson',
        user_type: 'supervisor',
        phone: '+1234567895'
      },
      role: 'supervisor'
    },
    {
      email: 'jane@gmail.com',
      password: 'password123',
      userData: {
        full_name: 'Jane Promoter',
        user_type: 'promoter',
        phone: '+1234567896'
      },
      role: 'promoter'
    },
    {
      email: 'maria@gmail.com',
      password: 'password123',
      userData: {
        full_name: 'Maria Rodriguez',
        user_type: 'promoter',
        phone: '+1234567897'
      },
      role: 'promoter'
    },
    {
      email: 'david@gmail.com',
      password: 'password123',
      userData: {
        full_name: 'David Chen',
        user_type: 'promoter',
        phone: '+1234567898'
      },
      role: 'promoter'
    },
    {
      email: 'robert@promomax.com',
      password: 'password123',
      userData: {
        full_name: 'Robert PromoMax',
        user_type: 'company',
        phone: '+1234567899'
      },
      role: 'company_owner'
    }
  ];

  console.log('Starting comprehensive test user seeding...');

  const createdUsers = [];

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
          console.log(`User ${testUser.email} already exists, getting existing user...`);
          // Try to get existing user data
          const { data: existingUser } = await supabase
            .from('profiles')
            .select('id')
            .eq('full_name', testUser.userData.full_name)
            .single();
          
          if (existingUser) {
            createdUsers.push({ 
              user: { id: existingUser.id }, 
              email: testUser.email, 
              role: testUser.role 
            });
          }
        } else {
          console.error(`Error creating user ${testUser.email}:`, error);
        }
      } else if (data.user) {
        console.log(`Successfully created user: ${testUser.email}`, data);
        createdUsers.push({ 
          user: data.user, 
          email: testUser.email, 
          role: testUser.role 
        });
      }
    } catch (error) {
      console.error(`Failed to create user ${testUser.email}:`, error);
    }
  }

  // Wait a moment for users to be fully created
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Now assign roles to the users
  console.log('Assigning roles to test users...');
  
  for (const userData of createdUsers) {
    try {
      console.log(`Assigning role ${userData.role} to user ${userData.email}`);
      
      // Insert role for the user
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userData.user.id,
          role: userData.role,
          is_active: true
        });

      if (roleError) {
        console.error(`Error assigning role to ${userData.email}:`, roleError);
      } else {
        console.log(`Successfully assigned role ${userData.role} to ${userData.email}`);
      }
    } catch (error) {
      console.error(`Failed to assign role to ${userData.email}:`, error);
    }
  }

  // Update company ownership
  try {
    console.log('Updating company ownership...');
    
    // Find the company owner users
    const johnUser = createdUsers.find(u => u.email === 'john@eventcorp.com');
    const robertUser = createdUsers.find(u => u.email === 'robert@promomax.com');
    
    if (johnUser) {
      await supabase
        .from('companies')
        .update({ owner_id: johnUser.user.id })
        .eq('name', 'EventCorp Solutions');
      console.log('Updated EventCorp Solutions ownership');
    }
    
    if (robertUser) {
      await supabase
        .from('companies')
        .update({ owner_id: robertUser.user.id })
        .eq('name', 'PromoMax Events');
      console.log('Updated PromoMax Events ownership');
    }
  } catch (error) {
    console.error('Error updating company ownership:', error);
  }

  // Create some sample job applications
  try {
    console.log('Creating sample job applications...');
    
    const promoterUsers = createdUsers.filter(u => u.role === 'promoter');
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id')
      .limit(3);
    
    if (jobs && promoterUsers.length > 0) {
      for (let i = 0; i < Math.min(jobs.length, promoterUsers.length); i++) {
        await supabase
          .from('job_applications')
          .insert({
            job_id: jobs[i].id,
            promoter_id: promoterUsers[i].user.id,
            status: i === 0 ? 'approved' : 'pending',
            notes: 'Test application created during seeding'
          });
      }
      console.log('Created sample job applications');
    }
  } catch (error) {
    console.error('Error creating job applications:', error);
  }

  // Create sample notifications
  try {
    console.log('Creating sample notifications...');
    
    for (const userData of createdUsers.slice(0, 5)) {
      await supabase
        .from('notifications')
        .insert({
          user_id: userData.user.id,
          title: 'Welcome to the Platform!',
          message: `Welcome ${userData.email.split('@')[0]}! Your account has been set up successfully.`,
          type: 'info',
          is_read: false
        });
    }
    console.log('Created sample notifications');
  } catch (error) {
    console.error('Error creating notifications:', error);
  }

  console.log('Test user seeding completed successfully!');
  return createdUsers;
};
