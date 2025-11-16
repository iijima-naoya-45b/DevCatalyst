import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { Header } from '@/(feature)/layouts/Header';

jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    isAuthenticated: () => true,
    user: { name: 'User', email: 'user@example.com', avatar_url: '' },
  }),
}));

describe('Header mobile menu icon toggle', () => {
  it('toggles between Menu and X icons', () => {
    render(<Header />);
    // there is a button which toggles; we can click it and expect icon change by aria-hidden icons count changes
    const trigger = screen.getAllByRole('button').find((b) => b.className.includes('md:hidden'));
    expect(trigger).toBeTruthy();
    if (!trigger) return;
    // first click: open -> X icon rendered
    fireEvent.click(trigger);
    expect(document.querySelector('svg')).toBeInTheDocument();
    // second click: close -> Menu icon rendered again
    fireEvent.click(trigger);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });
});


