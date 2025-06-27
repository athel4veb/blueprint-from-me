
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { testCredentials } from "@/utils/auth/testCredentials";

interface TestDataSectionProps {
  onFillCredentials: (credentials: { email: string; password: string }) => void;
}

export const TestDataSection = ({ onFillCredentials }: TestDataSectionProps) => {
  const { toast } = useToast();

  const fillTestCredentials = (credentials: { email: string; password: string }) => {
    onFillCredentials(credentials);
    toast({
      title: "Credentials filled",
      description: `Using ${credentials.email}`,
    });
  };

  return (
    <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
      <p className="text-sm text-blue-800 mb-3 font-medium">🧪 Test Accounts:</p>
      <p className="text-xs text-blue-700 mb-3">
        Click any account below to auto-fill login credentials
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {testCredentials.map((cred, index) => (
          <Button 
            key={index}
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => fillTestCredentials({ email: cred.email, password: cred.password })}
            className="text-xs justify-between p-3 h-auto text-blue-700 border-blue-300 hover:bg-blue-100"
          >
            <div className="text-left">
              <div className="font-medium">{cred.type}</div>
              <div className="text-xs text-blue-600">{cred.description}</div>
              <div className="text-xs text-blue-500">{cred.email}</div>
            </div>
          </Button>
        ))}
      </div>
      <p className="text-xs text-blue-600 mt-2">
        💡 All test accounts use password: <code className="bg-blue-100 px-1 rounded">password123</code>
      </p>
    </div>
  );
};
