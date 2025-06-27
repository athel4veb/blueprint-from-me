
import { supabase } from '@/integrations/supabase/client';

export interface ExistingDataSummary {
  profiles: any[];
  companies: any[];
  events: any[];
  jobs: any[];
}

export const checkExistingData = async (): Promise<ExistingDataSummary> => {
  console.log('Checking existing test data...');
  
  // Check if we already have test data
  const { data: existingProfiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, user_type')
    .limit(5);

  if (profileError) {
    console.error('Error checking existing profiles:', profileError);
    throw profileError;
  }

  if (!existingProfiles || existingProfiles.length === 0) {
    throw new Error('No profiles found in database. Please add seed data first.');
  }

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

  return {
    profiles: existingProfiles,
    companies: companies || [],
    events: events || [],
    jobs: jobs || []
  };
};
