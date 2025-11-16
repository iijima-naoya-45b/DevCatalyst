import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/(feature)/common/ui/select';
import { Badge } from '@/components/ui/badge';
import type { AIProvider, AvailableModels } from '@/lib/types/ai';

interface ModelSelectorProps {
  provider: AIProvider;
  model: string;
  availableModels: AvailableModels | null;
  onProviderChange: (provider: AIProvider) => void;
  onModelChange: (model: string) => void;
}

export function ModelSelector({
  provider,
  model,
  availableModels,
  onProviderChange,
  onModelChange,
}: ModelSelectorProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <label className="text-sm font-medium mb-1 block">Provider</label>
        <Select value={provider} onValueChange={onProviderChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <label className="text-sm font-medium mb-1 block">Model</label>
        <Select value={model} onValueChange={onModelChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {availableModels?.models[provider]?.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                <div className="flex items-center gap-2">
                  {m.name}
                  <Badge variant="outline" className="text-xs">
                    {m.plan_required}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
