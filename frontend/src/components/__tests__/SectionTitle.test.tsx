import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SectionTitle from '../public/SectionTitle';

describe('SectionTitle', () => {
  it('should render the title', () => {
    render(<SectionTitle title="Tin tức mới nhất" />);
    expect(screen.getByText('Tin tức mới nhất')).toBeInTheDocument();
  });

  it('should render subtitle when provided', () => {
    render(<SectionTitle title="Sự kiện" subtitle="Hoạt động nổi bật" />);
    expect(screen.getByText('Hoạt động nổi bật')).toBeInTheDocument();
    expect(screen.getByText('Sự kiện')).toBeInTheDocument();
  });

  it('should not render subtitle element when not provided', () => {
    const { container } = render(<SectionTitle title="Tin tức" />);
    // Only h2 should exist, no subtitle p tag
    const pTags = container.querySelectorAll('p');
    expect(pTags.length).toBe(0);
  });

  it('should use h2 for the title', () => {
    render(<SectionTitle title="Test Title" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Test Title');
  });

  it('should apply text-center when center=true', () => {
    const { container } = render(<SectionTitle title="Centered" center />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('text-center');
  });

  it('should not apply text-center by default', () => {
    const { container } = render(<SectionTitle title="Left Aligned" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).not.toContain('text-center');
  });
});
