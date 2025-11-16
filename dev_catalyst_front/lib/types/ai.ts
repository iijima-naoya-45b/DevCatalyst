export type ChatRole = 'user' | 'assistant' | 'system';
export type AIProvider = 'openai' | 'anthropic';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface Message extends ChatMessage {
  id: string;
  timestamp: Date;
}

export interface ChatRequest {
  messages: ChatMessage[];
  provider?: AIProvider;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  session_id?: string | number;
}

export interface ChatResponse {
  message: string;
  provider: string;
  model: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    input_tokens?: number;
    output_tokens?: number;
  };
}

export interface AIModel {
  id: string;
  name: string;
  plan_required: string;
}

export interface AvailableModels {
  models: {
    openai: AIModel[];
    anthropic: AIModel[];
  };
  user_plan: string;
}
