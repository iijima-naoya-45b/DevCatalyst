import { OAuthButton } from '@/components/auth/oauth-button';

export function LoginOAuthOptions() {
  return (
    <div className="space-y-3">
      <OAuthButton provider="google" />
      <OAuthButton provider="github" />
    </div>
  );
}
