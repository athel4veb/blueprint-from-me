
import { checkExistingData } from './database/checkExistingData';
import { validateTestDataSufficiency, createSuccessResponse } from './database/validateTestData';

export const seedTestUsers = async () => {
  try {
    const existingData = await checkExistingData();
    
    if (validateTestDataSufficiency(existingData)) {
      console.log('✅ Sufficient test data already exists!');
      return createSuccessResponse(existingData);
    }

    console.log('❌ Insufficient test data found. Please manually seed the database first.');
    throw new Error('Please manually add seed data to the database first. The seeding function now works with existing data rather than creating new users.');

  } catch (error) {
    console.error('Error in seedTestUsers:', error);
    throw error;
  }
};
