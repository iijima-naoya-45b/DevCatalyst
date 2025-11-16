export interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export interface SimpleAriaLoaderProps {
  onComplete: () => void;
}

export interface LoadingMessageProps {
  message?: string;
}
