import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ArticleCard from '../public/ArticleCard';

// Mock next/link — render as plain <a>
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('ArticleCard', () => {
  const defaultProps = {
    title: 'Khai giang nam hoc moi',
    description: 'Truong tieu hoc Le Quy Don to chuc le khai giang',
    category: 'Tin tuc',
    date: '01/09/2024',
    slug: 'khai-giang-nam-hoc-moi',
  };

  it('should render title', () => {
    render(<ArticleCard {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });

  it('should render category and date', () => {
    render(<ArticleCard {...defaultProps} />);
    expect(screen.getByText(`${defaultProps.category} • ${defaultProps.date}`)).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<ArticleCard {...defaultProps} />);
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
  });

  it('should link to /tin-tuc/{slug} by default', () => {
    render(<ArticleCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/tin-tuc/${defaultProps.slug}`);
  });

  it('should use custom href when provided', () => {
    render(<ArticleCard {...defaultProps} href="/su-kien/abc" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/su-kien/abc');
  });
});
