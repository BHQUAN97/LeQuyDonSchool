import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('lucide-react', () => ({
  MapPin: (props: any) => <span data-testid="icon-mappin" {...props} />,
  Phone: (props: any) => <span data-testid="icon-phone" {...props} />,
  Mail: (props: any) => <span data-testid="icon-mail" {...props} />,
  Globe: (props: any) => <span data-testid="icon-globe" {...props} />,
  ChevronRight: (props: any) => <span data-testid="icon-chevron-right" {...props} />,
  CheckCircle: (props: any) => <span data-testid="icon-check" {...props} />,
}));

const mockApi = vi.fn();

vi.mock('@/lib/api', () => ({
  api: (...args: any[]) => mockApi(...args),
}));

vi.mock('@/lib/csrf', () => ({
  getCsrfToken: vi.fn().mockResolvedValue('csrf-token'),
}));

import LienHePage from '../(public)/lien-he/page';

async function fillValidForm() {
  await userEvent.type(screen.getByPlaceholderText('Nhập họ và tên'), 'Nguyen Van A');
  await userEvent.type(screen.getByPlaceholderText('Nhập email'), 'test@test.com');
  await userEvent.type(screen.getByPlaceholderText('Nhập địa chỉ'), 'Ha Noi');
  await userEvent.type(screen.getByPlaceholderText('Nhập số điện thoại'), '0912345678');
  await userEvent.type(screen.getByPlaceholderText('Nhập nội dung liên hệ...'), 'Noi dung lien he test');
}

describe('Contact Form complete flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all required form fields', () => {
    render(<LienHePage />);

    expect(screen.getByPlaceholderText('Nhập họ và tên')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập địa chỉ')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập số điện thoại')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập nội dung liên hệ...')).toBeInTheDocument();
  });

  it('renders submit button and contact info', () => {
    render(<LienHePage />);

    expect(screen.getByRole('button', { name: /gửi liên hệ/i })).toBeInTheDocument();
    expect(screen.getByText(/Địa chỉ:/)).toBeInTheDocument();
    expect(screen.getByText(/Số ĐT:/)).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText(/Facebook:/)).toBeInTheDocument();
  });

  it('calls API with payload, CSRF header, and shows success', async () => {
    mockApi.mockResolvedValueOnce({ success: true });
    render(<LienHePage />);

    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /gửi liên hệ/i }));

    await waitFor(() => {
      expect(mockApi).toHaveBeenCalledWith('/contacts', {
        method: 'POST',
        headers: { 'x-csrf-token': 'csrf-token' },
        body: JSON.stringify({
          fullName: 'Nguyen Van A',
          email: 'test@test.com',
          phone: '0912345678',
          address: 'Ha Noi',
          content: 'Noi dung lien he test',
        }),
      });
    });

    expect(await screen.findByText(/cảm ơn bạn đã liên hệ/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập họ và tên')).toHaveValue('');
  });

  it('requires phone before submitting', async () => {
    render(<LienHePage />);

    await userEvent.type(screen.getByPlaceholderText('Nhập họ và tên'), 'Nguyen Van A');
    await userEvent.type(screen.getByPlaceholderText('Nhập email'), 'test@test.com');
    await userEvent.type(screen.getByPlaceholderText('Nhập địa chỉ'), 'Ha Noi');
    await userEvent.type(screen.getByPlaceholderText('Nhập nội dung liên hệ...'), 'Noi dung lien he test');
    fireEvent.click(screen.getByRole('button', { name: /gửi liên hệ/i }));

    expect(mockApi).not.toHaveBeenCalled();
  });

  it('shows API error messages', async () => {
    mockApi.mockRejectedValueOnce(new Error('Server error'));
    render(<LienHePage />);

    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /gửi liên hệ/i }));

    expect(await screen.findByText('Server error')).toBeInTheDocument();
  });

  it('shows fallback error for non-Error exceptions', async () => {
    mockApi.mockRejectedValueOnce('unknown error');
    render(<LienHePage />);

    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /gửi liên hệ/i }));

    expect(await screen.findByText(/có lỗi xảy ra/i)).toBeInTheDocument();
  });

  it('clears success banner when submitting again', async () => {
    mockApi.mockResolvedValueOnce({ success: true });
    render(<LienHePage />);

    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /gửi liên hệ/i }));
    expect(await screen.findByText(/cảm ơn bạn đã liên hệ/i)).toBeInTheDocument();

    mockApi.mockRejectedValueOnce(new Error('Fail'));
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /gửi liên hệ/i }));

    await waitFor(() => {
      expect(screen.queryByText(/cảm ơn bạn đã liên hệ/i)).not.toBeInTheDocument();
      expect(screen.getByText('Fail')).toBeInTheDocument();
    });
  });
});
