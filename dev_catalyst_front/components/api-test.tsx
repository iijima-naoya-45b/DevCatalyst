'use client';

import { useState } from 'react';
import { Button } from '../(feature)/common/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../(feature)/common/ui/card';
import { RailsApiService, AiService } from '../lib/services';
import { useApi } from '../lib/hooks/use-api';

export function ApiTestComponent() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  
  // Test Rails API connection
  const railsHealthCheck = useApi(async () => {
    // Simple health check - try to get projects (will fail with auth error, but connection works)
    return RailsApiService.getProjects();
  });

  // Test AI Service connection
  const aiHealthCheck = useApi(async () => {
    return AiService.healthCheck();
  });

  const testRailsConnection = async () => {
    const result = await railsHealthCheck.execute();
    setTestResults(prev => ({
      ...prev,
      rails: {
        success: result !== null,
        error: railsHealthCheck.error,
        timestamp: new Date().toISOString(),
      },
    }));
  };

  const testAiConnection = async () => {
    const result = await aiHealthCheck.execute();
    setTestResults(prev => ({
      ...prev,
      ai: {
        success: result !== null,
        data: result,
        error: aiHealthCheck.error,
        timestamp: new Date().toISOString(),
      },
    }));
  };

  const testChatMessage = async () => {
    try {
      const result = await AiService.sendMessage({
        message: 'Hello, this is a test message',
        context: {
          project_id: 1,
          user_id: 1,
        },
      });
      
      setTestResults(prev => ({
        ...prev,
        chat: {
          success: true,
          data: result.data,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        chat: {
          success: false,
          error: error,
          timestamp: new Date().toISOString(),
        },
      }));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>API Integration Test</CardTitle>
          <CardDescription>
            Test connections to Rails API and FastAPI AI Service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={testRailsConnection}
              disabled={railsHealthCheck.loading}
              variant="outline"
            >
              {railsHealthCheck.loading ? 'Testing...' : 'Test Rails API'}
            </Button>
            
            <Button 
              onClick={testAiConnection}
              disabled={aiHealthCheck.loading}
              variant="outline"
            >
              {aiHealthCheck.loading ? 'Testing...' : 'Test AI Service'}
            </Button>
            
            <Button 
              onClick={testChatMessage}
              variant="outline"
            >
              Test AI Chat
            </Button>
          </div>

          {/* Test Results */}
          <div className="space-y-4 mt-6">
            {Object.entries(testResults).map(([service, result]) => (
              <Card key={service} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {service.toUpperCase()} Service Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      result.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.success ? '✓ Success' : '✗ Failed'}
                    </div>
                    
                    {result.timestamp && (
                      <p className="text-xs text-gray-500">
                        Tested at: {new Date(result.timestamp).toLocaleString()}
                      </p>
                    )}
                    
                    {result.error && (
                      <div className="bg-red-50 p-2 rounded text-sm">
                        <strong>Error:</strong> {result.error.message}
                        {result.error.status && (
                          <span className="ml-2 text-gray-600">
                            (Status: {result.error.status})
                          </span>
                        )}
                      </div>
                    )}
                    
                    {result.data && (
                      <div className="bg-green-50 p-2 rounded text-sm">
                        <strong>Response:</strong>
                        <pre className="mt-1 text-xs overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}