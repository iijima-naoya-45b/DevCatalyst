import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardHeader } from '@/components/layouts/DashboardHeader';

// mock auth context
jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    isAuthenticated: () => true,
    user: { name: 'User', email: 'user@example.com', avatar_url: '' },
  }),
}));

// mock next/navigation usePathname
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/dashboard',
}));

describe('DashboardHeader', () => {
  it('renders active Dashboard tab and avatar-only user chip', () => {
    render(<DashboardHeader />);
    const dash = screen.getByText('ダッシュボード');
    expect(dash).toBeInTheDocument();
    // active style should have text color class applied
    expect(dash.closest('button')?.className).toMatch(/text-slate-900|dark:text-amber-100/);
    // avatar image exists (fallback text may render if no src)
    const userInitial = screen.getAllByText('U')[0];
    expect(userInitial).toBeInTheDocument();
  });
});


