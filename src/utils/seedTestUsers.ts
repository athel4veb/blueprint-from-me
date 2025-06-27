
import { supabase } from '@/integrations/supabase/client';

export const seedTestUsers = async () => {
  console.log('Checking existing test data...');
  
  try {
    // Check if we already have test data
    const { data: existingProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, user_type')
      .limit(5);

    if (profileError) {
      console.error('Error checking existing profiles:', profileError);
      throw profileError;
    }

    if (existingProfiles && existingProfiles.length > 0) {
      console.log('Found existing profiles:', existingProfiles);
      
      // Check for companies
      const { data: companies } = await supabase
        .from('companies')
        .select('id, name, owner_id')
        .limit(3);

      // Check for events
      const { data: events } = await supabase
        .from('events')
        .select('id, title, company_id')
        .limit(3);

      // Check for jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, title, event_id')
        .limit(5);

      console.log('Existing data summary:', {
        profiles: existingProfiles.length,
        companies: companies?.length || 0,
        events: events?.length || 0,
        jobs: jobs?.length || 0
      });

      if (existingProfiles.length >= 5 && companies && companies.length >= 2) {
        console.log('✅ Sufficient test data already exists!');
        return {
          message: 'Test data already exists',
          profiles: existingProfiles,
          companies: companies,
          events: events,
          jobs: jobs
        };
      }
    }

    console.log('❌ Insufficient test data found. Please manually seed the database first.');
    throw new Error('Please manually add seed data to the database first. The seeding function now works with existing data rather than creating new users.');

  } catch (error) {
    console.error('Error in seedTestUsers:', error);
    throw error;
  }
};
