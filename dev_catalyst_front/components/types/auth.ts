import type { OAuthProvider } from '@/lib/auth';

export interface OAuthButtonProps {
    provider: OAuthProvider;
    className?: string;
}

