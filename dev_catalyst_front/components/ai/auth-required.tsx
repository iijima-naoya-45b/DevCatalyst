import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export function AuthRequired() {
    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">認証が必要です</h3>
                    <p className="text-gray-600 mb-4">AI機能を使用するにはログインしてください。</p>
                    <Button onClick={() => window.location.href = '/login'}>
                        ログインページへ
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}