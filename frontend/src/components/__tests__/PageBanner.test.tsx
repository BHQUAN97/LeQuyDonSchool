import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ChevronRight: (props: any) => <span data-testid="icon-chevron-right" {...props} />,
}));

import PageBanner from '../public/PageBanner';

describe('PageBanner', () => {
  const defaultProps = {
    title: 'Tầm nhìn & Sứ mệnh',
    breadcrumbItems: [
      { label: 'Tổng quan', href: '/tong-quan' },
      { label: 'Tầm nhìn & Sứ mệnh' },
    ],
  };

  it('should render the title as h1', () => {
    render(<PageBanner {...defaultProps} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Tầm nhìn & Sứ mệnh');
  });

  it('should render breadcrumb navigation', () => {
    render(<PageBanner {...defaultProps} />);
    expect(screen.getByText('Trang chủ')).toBeInTheDocument();
    expect(screen.getByText('Tổng quan')).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(
      <PageBanner
        {...defaultProps}
        description="Mô tả về tầm nhìn và sứ mệnh của trường"
      />
    );
    expect(screen.getByText('Mô tả về tầm nhìn và sứ mệnh của trường')).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    const { container } = render(<PageBanner {...defaultProps} />);
    // Only h1, no description p tag with opacity-90
    const descP = container.querySelector('p.opacity-90');
    expect(descP).toBeNull();
  });

  it('should use default green gradient background', () => {
    const { container } = render(<PageBanner {...defaultProps} />);
    const section = container.querySelector('section');
    expect(section?.className).toContain('bg-gradient-to-r');
    expect(section?.className).toContain('from-green-700');
  });

  it('should use custom bgClass when provided', () => {
    const { container } = render(
      <PageBanner {...defaultProps} bgClass="bg-gradient-to-r from-blue-700 to-blue-600" />
    );
    const section = container.querySelector('section');
    expect(section?.className).toContain('from-blue-700');
  });
});
