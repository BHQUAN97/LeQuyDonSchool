'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Tài khoản</h1>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'info'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Thông tin
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'password'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Đổi mật khẩu
        </button>
      </div>

      {activeTab === 'info' ? <ProfileInfo user={user} /> : <ChangePassword />}
    </div>
  );
}

/** Hien thi thong tin tai khoan */
function ProfileInfo({ user }: { user: any }) {
  if (!user) return null;

  const fields = [
    { label: 'Họ tên', value: user.full_name },
    { label: 'Email', value: user.email },
    { label: 'Vai trò', value: user.role === 'super_admin' ? 'Super Admin' : 'Editor' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
      {fields.map((f) => (
        <div key={f.label}>
          <label className="block text-sm font-medium text-slate-500 mb-1">{f.label}</label>
          <p className="text-slate-900">{f.value || '—'}</p>
        </div>
      ))}
    </div>
  );
}

/** Kiem tra yeu cau mat khau real-time */
function usePasswordChecks(password: string) {
  return {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };
}

/** Form doi mat khau */
function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const checks = usePasswordChecks(form.newPassword);
  const allChecksPassed = checks.minLength && checks.hasUpper && checks.hasLower && checks.hasNumber; // eslint-disable-line @typescript-eslint/no-unused-vars

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    if (form.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Mật khẩu mới tối thiểu 8 ký tự' });
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.newPassword)) {
      setMessage({ type: 'error', text: 'Mật khẩu phải có chữ hoa, chữ thường và số' });
      return;
    }

    setSaving(true);
    try {
      await api('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.' });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Đổi mật khẩu thất bại' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu hiện tại</label>
          <Input
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
          <Input
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            required
            minLength={8}
          />
          {/* Realtime password checklist */}
          {form.newPassword.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm">
              <li className={checks.minLength ? 'text-green-600' : 'text-slate-400'}>
                {checks.minLength ? '✓' : '○'} Tối thiểu 8 ký tự
              </li>
              <li className={checks.hasUpper ? 'text-green-600' : 'text-slate-400'}>
                {checks.hasUpper ? '✓' : '○'} Có chữ hoa (A-Z)
              </li>
              <li className={checks.hasLower ? 'text-green-600' : 'text-slate-400'}>
                {checks.hasLower ? '✓' : '○'} Có chữ thường (a-z)
              </li>
              <li className={checks.hasNumber ? 'text-green-600' : 'text-slate-400'}>
                {checks.hasNumber ? '✓' : '○'} Có số (0-9)
              </li>
            </ul>
          )}
          {form.newPassword.length === 0 && (
            <p className="text-sm text-slate-400 mt-1">Tối thiểu 8 ký tự, có chữ hoa, chữ thường và số</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
          <Input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
          />
          {form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">Mật khẩu xác nhận không khớp</p>
          )}
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <Button type="submit" disabled={saving}>
          {saving ? 'Đang lưu...' : 'Đổi mật khẩu'}
        </Button>
      </form>
    </div>
  );
}
