import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Phone: (props: any) => <span data-testid="icon-phone" {...props} />,
  Mail: (props: any) => <span data-testid="icon-mail" {...props} />,
  MapPin: (props: any) => <span data-testid="icon-mappin" {...props} />,
}));

import Footer from '../public/Footer';

describe('Footer', () => {
  it('should render school name', () => {
    render(<Footer />);
    expect(screen.getByText('Trường Tiểu học Lê Quý Đôn')).toBeInTheDocument();
  });

  it('should render contact section with phone and email', () => {
    render(<Footer />);
    expect(screen.getByText('Liên hệ')).toBeInTheDocument();
    expect(screen.getByText('024 .6287.2079')).toBeInTheDocument();
    expect(screen.getByText('c1_admin@lequydonhanoi.edu.vn')).toBeInTheDocument();
  });

  it('should render address', () => {
    render(<Footer />);
    expect(screen.getByText(/Số 50 Lưu Hữu Phước/)).toBeInTheDocument();
  });

  it('should render Tong quan section links', () => {
    render(<Footer />);
    expect(screen.getByText('Tổng quan')).toBeInTheDocument();
    expect(screen.getByText(/Tầm nhìn & Sứ mệnh/)).toBeInTheDocument();
    expect(screen.getByText(/Cột mốc phát triển/)).toBeInTheDocument();
  });

  it('should render Chuong trinh giao duc section', () => {
    render(<Footer />);
    expect(screen.getByText('Chương trình giáo dục')).toBeInTheDocument();
    expect(screen.getByText(/Giáo dục Quốc gia nâng cao/)).toBeInTheDocument();
  });

  it('should render social media links', () => {
    render(<Footer />);
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('YouTube')).toBeInTheDocument();
    expect(screen.getByLabelText('Zalo')).toBeInTheDocument();
  });

  it('should render copyright text with current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument();
  });
});
