
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { seedTestUsers } from "@/utils/seedTestUsers";
import { testCredentials, TestCredential } from "@/utils/auth/testCredentials";

interface TestDataSectionProps {
  onFillCredentials: (credentials: { email: string; password: string }) => void;
}

export const TestDataSection = ({ onFillCredentials }: TestDataSectionProps) => {
  const [checking, setChecking] = useState(false);
  const { toast } = useToast();

  const fillTestCredentials = (credentials: { email: string; password: string }) => {
    onFillCredentials(credentials);
  };

  // Handle checking existing test data
  const handleCheckTestData = async () => {
    setChecking(true);
    try {
      console.log('Checking existing test data...');
      const result = await seedTestUsers();
      toast({
        title: "Test Data Check Complete!",
        description: `Found ${result.profiles?.length || 0} profiles, ${result.companies?.length || 0} companies, ${result.events?.length || 0} events, and ${result.jobs?.length || 0} jobs in the database.`,
      });
    } catch (error: any) {
      console.error('Data check error:', error);
      toast({
        title: "Data Check Info",
        description: error.message || "Please ensure test data is manually added to the database first.",
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      {/* Test data check section */}
      <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
        <p className="text-sm text-blue-800 mb-2 font-medium">🔍 Check Test Data:</p>
        <p className="text-xs text-blue-700 mb-3">
          Verify existing test data in the database
        </p>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleCheckTestData}
          disabled={checking}
          className="w-full text-blue-700 border-blue-300 hover:bg-blue-100"
        >
          {checking ? "🔄 Checking Database..." : "📊 Check Existing Test Data"}
        </Button>
      </div>
      
      {/* Test credentials section */}
      <div className="p-4 bg-green-50 rounded-md border border-green-200">
        <p className="text-sm text-green-800 mb-3 font-medium">🧪 Test Accounts (if data exists):</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {testCredentials.map((cred, index) => (
            <Button 
              key={index}
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => fillTestCredentials({ email: cred.email, password: cred.password })}
              className="text-xs justify-between p-2 h-auto text-green-700 border-green-300 hover:bg-green-100"
            >
              <div className="text-left">
                <div className="font-medium">{cred.type}</div>
                <div className="text-xs text-green-600">{cred.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};
