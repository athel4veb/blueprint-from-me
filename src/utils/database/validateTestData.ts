
import { ExistingDataSummary } from './checkExistingData';

export const validateTestDataSufficiency = (data: ExistingDataSummary): boolean => {
  console.log('Existing data summary:', {
    profiles: data.profiles.length,
    companies: data.companies.length,
    events: data.events.length,
    jobs: data.jobs.length
  });

  return data.profiles.length >= 5 && data.companies.length >= 2;
};

export const createSuccessResponse = (data: ExistingDataSummary) => {
  return {
    message: 'Test data already exists',
    profiles: data.profiles,
    companies: data.companies,
    events: data.events,
    jobs: data.jobs
  };
};
