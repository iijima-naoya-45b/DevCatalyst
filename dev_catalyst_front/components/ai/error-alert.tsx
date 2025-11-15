import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
    message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
    return (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{message}</span>
            </div>
        </div>
    );
}