/**
 * Integration test — Contact form complete flow
 *
 * Tests the full LienHePage component behavior:
 * form rendering, validation, successful submission, error handling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock lucide-react icons to avoid rendering issues in test
vi.mock('lucide-react', () => ({
  MapPin: (props: any) => <span data-testid="icon-mappin" {...props} />,
  Phone: (props: any) => <span data-testid="icon-phone" {...props} />,
  Mail: (props: any) => <span data-testid="icon-mail" {...props} />,
  Clock: (props: any) => <span data-testid="icon-clock" {...props} />,
  Send: (props: any) => <span data-testid="icon-send" {...props} />,
  CheckCircle: (props: any) => <span data-testid="icon-check" {...props} />,
}));

// Mock PageBanner component
vi.mock('@/components/public/PageBanner', () => ({
  default: ({ title }: { title: string }) => <div data-testid="page-banner">{title}</div>,
}));

// Mock api function
const mockApi = vi.fn();
vi.mock('@/lib/api', () => ({
  api: (...args: any[]) => mockApi(...args),
}));

// Import component AFTER mocks
import LienHePage from '../(public)/lien-he/page';

describe('Contact Form — Complete Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form renders with all fields', () => {
    it('should render all required form fields', () => {
      render(<LienHePage />);

      // Check labels and inputs present
      expect(screen.getByPlaceholderText('Nguyễn Văn A')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('0912 345 678')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Nhập nội dung tin nhắn...')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<LienHePage />);
      expect(screen.getByRole('button', { name: /gửi tin nhắn/i })).toBeInTheDocument();
    });

    it('should render contact info cards', () => {
      render(<LienHePage />);
      expect(screen.getByText('Địa chỉ')).toBeInTheDocument();
      expect(screen.getByText('Điện thoại')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Giờ làm việc')).toBeInTheDocument();
    });
  });

  describe('Successful submission flow', () => {
    it('should call API with correct payload and show success message', async () => {
      mockApi.mockResolvedValueOnce({ success: true });
      render(<LienHePage />);

      // Fill form
      await userEvent.type(screen.getByPlaceholderText('Nguyễn Văn A'), 'Nguyen Van A');
      await userEvent.type(screen.getByPlaceholderText('email@example.com'), 'test@test.com');
      await userEvent.type(screen.getByPlaceholderText('0912 345 678'), '0912345678');
      await userEvent.type(screen.getByPlaceholderText('Nhập nội dung tin nhắn...'), 'Noi dung lien he test');

      // Submit
      fireEvent.click(screen.getByRole('button', { name: /gửi tin nhắn/i }));

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalledWith('/contacts', {
          method: 'POST',
          body: JSON.stringify({
            fullName: 'Nguyen Van A',
            email: 'test@test.com',
            phone: '0912345678',
            content: 'Noi dung lien he test',
          }),
        });
      });

      // Success message shown
      await waitFor(() => {
        expect(screen.getByText(/cảm ơn bạn đã liên hệ/i)).toBeInTheDocument();
      });

      // Form should be cleared after success
      expect(screen.getByPlaceholderText('Nguyễn Văn A')).toHaveValue('');
      expect(screen.getByPlaceholderText('email@example.com')).toHaveValue('');
      expect(screen.getByPlaceholderText('Nhập nội dung tin nhắn...')).toHaveValue('');
    });

    it('should send phone as undefined when empty', async () => {
      mockApi.mockResolvedValueOnce({ success: true });
      render(<LienHePage />);

      await userEvent.type(screen.getByPlaceholderText('Nguyễn Văn A'), 'Test');
      await userEvent.type(screen.getByPlaceholderText('email@example.com'), 'a@b.com');
      await userEvent.type(screen.getByPlaceholderText('Nhập nội dung tin nhắn...'), 'Hello test');

      fireEvent.click(screen.getByRole('button', { name: /gửi tin nhắn/i }));

      await waitFor(() => {
        const body = JSON.parse(mockApi.mock.calls[0][1].body);
        expect(body.phone).toBeUndefined();
      });
    });
  });

  describe('Error handling', () => {
    it('should show error message when API fails', async () => {
      mockApi.mockRejectedValueOnce(new Error('Server error'));
      render(<LienHePage />);

      await userEvent.type(screen.getByPlaceholderText('Nguyễn Văn A'), 'Test');
      await userEvent.type(screen.getByPlaceholderText('email@example.com'), 'a@b.com');
      await userEvent.type(screen.getByPlaceholderText('Nhập nội dung tin nhắn...'), 'Content here');

      fireEvent.click(screen.getByRole('button', { name: /gửi tin nhắn/i }));

      await waitFor(() => {
        expect(screen.getByText('Server error')).toBeInTheDocument();
      });
    });

    it('should show fallback error for non-Error exceptions', async () => {
      mockApi.mockRejectedValueOnce('unknown error');
      render(<LienHePage />);

      await userEvent.type(screen.getByPlaceholderText('Nguyễn Văn A'), 'Test');
      await userEvent.type(screen.getByPlaceholderText('email@example.com'), 'a@b.com');
      await userEvent.type(screen.getByPlaceholderText('Nhập nội dung tin nhắn...'), 'Content here');

      fireEvent.click(screen.getByRole('button', { name: /gửi tin nhắn/i }));

      await waitFor(() => {
        expect(screen.getByText(/có lỗi xảy ra/i)).toBeInTheDocument();
      });
    });
  });

  describe('Success banner resets on new submission', () => {
    it('should clear success banner when submitting again', async () => {
      // First submission succeeds
      mockApi.mockResolvedValueOnce({ success: true });
      render(<LienHePage />);

      await userEvent.type(screen.getByPlaceholderText('Nguyễn Văn A'), 'Test');
      await userEvent.type(screen.getByPlaceholderText('email@example.com'), 'a@b.com');
      await userEvent.type(screen.getByPlaceholderText('Nhập nội dung tin nhắn...'), 'Content here');
      fireEvent.click(screen.getByRole('button', { name: /gửi tin nhắn/i }));

      await waitFor(() => {
        expect(screen.getByText(/cảm ơn bạn đã liên hệ/i)).toBeInTheDocument();
      });

      // Second submission — success banner should reset during submission
      mockApi.mockRejectedValueOnce(new Error('Fail'));
      await userEvent.type(screen.getByPlaceholderText('Nguyễn Văn A'), 'Test2');
      await userEvent.type(screen.getByPlaceholderText('email@example.com'), 'b@c.com');
      await userEvent.type(screen.getByPlaceholderText('Nhập nội dung tin nhắn...'), 'More content');
      fireEvent.click(screen.getByRole('button', { name: /gửi tin nhắn/i }));

      await waitFor(() => {
        // Success banner gone, error shown instead
        expect(screen.queryByText(/cảm ơn bạn đã liên hệ/i)).not.toBeInTheDocument();
        expect(screen.getByText('Fail')).toBeInTheDocument();
      });
    });
  });
});
