import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { LoginCredentials } from '@/lib/types';
import type { ChangeEvent, FormEvent } from 'react';

export interface LoginValidationErrors {
  email?: string;
  password?: string;
}

interface LoginFormProps {
  credentials: LoginCredentials;
  validationErrors: LoginValidationErrors;
  loading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (field: keyof LoginCredentials, value: string) => void;
}

export function LoginForm(props: LoginFormProps) {
  const { credentials, validationErrors, loading, onSubmit, onChange } = props;

  const handleChange =
    (field: keyof LoginCredentials) => (event: ChangeEvent<HTMLInputElement>) => {
      onChange(field, event.target.value);
    };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider"
        >
          メールアドレス
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          value={credentials.email}
          onChange={handleChange('email')}
          required
          disabled={loading}
          className={`h-11 text-sm border-gray-200 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-gray-100 focus:border-gold dark:focus:border-gold/50 focus:ring-1 focus:ring-gold dark:focus:ring-gold/50 transition-all ${validationErrors.email ? 'border-red-400 dark:border-red-600' : ''}`}
        />
        {validationErrors.email && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">{validationErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider"
          >
            パスワード
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            パスワードをお忘れですか？
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={credentials.password}
          onChange={handleChange('password')}
          required
          disabled={loading}
          className={`h-11 text-sm border-gray-200 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-gray-100 focus:border-gold dark:focus:border-gold/50 focus:ring-1 focus:ring-gold dark:focus:ring-gold/50 transition-all ${validationErrors.password ? 'border-red-400 dark:border-red-600' : ''}`}
        />
        {validationErrors.password && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">
            {validationErrors.password}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-11 aria-gold-surface font-medium text-sm rounded-lg transition-all duration-300 mt-8"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ログイン中
          </>
        ) : (
          'ログイン'
        )}
      </Button>
    </form>
  );
}
