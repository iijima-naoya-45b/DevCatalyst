import { LucideIcon } from 'lucide-react';

export interface StageCardData {
  id: number;
  title: string;
  icon: LucideIcon;
  description: string;
  visual: 'blur' | 'dialogue' | 'strategy' | 'product';
}

export interface StageCardProps {
  stage: StageCardData;
  index: number;
}
