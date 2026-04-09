import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Menu: (props: any) => <span data-testid="icon-menu" {...props} />,
  X: (props: any) => <span data-testid="icon-x" {...props} />,
  Search: (props: any) => <span data-testid="icon-search" {...props} />,
  ChevronDown: (props: any) => <span data-testid="icon-chevron" {...props} />,
}));

import Header from '../public/Header';

describe('Header', () => {
  it('should render the school name', () => {
    render(<Header />);
    expect(screen.getByText('Trường Tiểu học Lê Quý Đôn')).toBeInTheDocument();
  });

  it('should render logo link to homepage', () => {
    render(<Header />);
    // Logo link should go to /
    const logoLink = screen.getAllByRole('link').find(link => link.getAttribute('href') === '/');
    expect(logoLink).toBeDefined();
  });

  it('should render main navigation items', () => {
    render(<Header />);
    expect(screen.getAllByText('Tổng quan').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Chương trình').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tin tức').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Liên hệ').length).toBeGreaterThan(0);
  });

  it('should render search buttons', () => {
    render(<Header />);
    const searchButtons = screen.getAllByLabelText(/tìm kiếm/i);
    expect(searchButtons.length).toBeGreaterThan(0);
  });

  it('should render mobile menu toggle button', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Toggle menu');
    expect(menuButton).toBeInTheDocument();
  });
});
