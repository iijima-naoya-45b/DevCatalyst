import { ApiClientError } from '../api-client';

// Error types for better error handling
export interface AppError {
  message: string;
  code?: string;
  status?: number;
  type: 'network' | 'auth' | 'validation' | 'server' | 'unknown';
}

// Error handler utility
export class ErrorHandler {
  static handleApiError(error: unknown): AppError {
    if (error instanceof ApiClientError) {
      return {
        message: error.message,
        code: error.code,
        status: error.status,
        type: this.getErrorType(error.status),
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        type: 'unknown',
      };
    }

    return {
      message: 'An unexpected error occurred',
      type: 'unknown',
    };
  }

  private static getErrorType(status: number): AppError['type'] {
    if (status === 0) return 'network';
    if (status === 401 || status === 403) return 'auth';
    if (status >= 400 && status < 500) return 'validation';
    if (status >= 500) return 'server';
    return 'unknown';
  }

  // User-friendly error messages with psychological consideration
  static getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
      case 'network':
        return 'ネットワーク接続に問題があります。インターネット接続を確認してください。';
      case 'auth':
        return 'ログインが必要です。再度ログインしてください。';
      case 'validation':
        return error.message || '入力内容に問題があります。確認してください。';
      case 'server':
        return 'サーバーで問題が発生しました。しばらく待ってから再試行してください。';
      default:
        return error.message || '予期しないエラーが発生しました。';
    }
  }

  // Psychology-aware error messaging
  static getEncouragingMessage(error: AppError): string {
    const baseMessage = this.getUserFriendlyMessage(error);

    switch (error.type) {
      case 'network':
        return `${baseMessage} 接続が復旧次第、すぐに作業を再開できます。`;
      case 'auth':
        return `${baseMessage} セキュリティのための措置です。ログイン後、作業を継続できます。`;
      case 'validation':
        return `${baseMessage} 少しの修正で解決できます。`;
      case 'server':
        return `${baseMessage} 技術チームが対応中です。データは安全に保存されています。`;
      default:
        return `${baseMessage} サポートチームがお手伝いします。`;
    }
  }
}
