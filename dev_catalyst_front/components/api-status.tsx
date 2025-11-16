'use client';

import { useEffect, useState } from 'react';
import { API_CONFIG } from '../lib/config';

interface ServiceStatus {
  name: string;
  url: string;
  status: 'checking' | 'online' | 'offline';
  responseTime?: number;
}

export function ApiStatusIndicator() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Rails API', url: API_CONFIG.RAILS_API_URL, status: 'checking' },
    { name: 'AI Service', url: API_CONFIG.AI_SERVICE_URL, status: 'checking' },
  ]);

  useEffect(() => {
    const checkServiceStatus = async (service: ServiceStatus): Promise<ServiceStatus> => {
      const startTime = Date.now();

      try {
        const response = await fetch(`${service.url}/health`, {
          method: 'GET',
          mode: 'cors',
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        const responseTime = Date.now() - startTime;

        return {
          ...service,
          status: response.ok ? 'online' : 'offline',
          responseTime,
        };
      } catch (error) {
        return {
          ...service,
          status: 'offline',
          responseTime: Date.now() - startTime,
        };
      }
    };

    const checkAllServices = async () => {
      const updatedServices = await Promise.all(
        services.map((service) => checkServiceStatus(service))
      );
      setServices(updatedServices);
    };

    checkAllServices();

    // Check every 30 seconds
    const interval = setInterval(checkAllServices, 30000);

    return () => clearInterval(interval);
  }, [services]);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50">
      <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">API Status</div>
      <div className="space-y-1">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">{service.name}</span>
            <div className="flex items-center space-x-2">
              {service.responseTime && (
                <span className="text-gray-500">{service.responseTime}ms</span>
              )}
              <div
                className={`w-2 h-2 rounded-full ${
                  service.status === 'checking'
                    ? 'bg-yellow-400 animate-pulse'
                    : service.status === 'online'
                      ? 'bg-green-400'
                      : 'bg-red-400'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
