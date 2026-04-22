'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

// ─── TYPES ───────────────────────────────────────────────

interface AppLog {
  id: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  stack_trace: string | null;
  endpoint: string | null;
  status_code: number | null;
  ip: string | null;
  user_id: string | null;
  user_agent: string | null;
  context: Record<string, unknown> | null;
  created_at: string;
}

interface LogsResponse {
  success: boolean;
  data: AppLog[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface StatsResponse {
  success: boolean;
  data: { error: number; warn: number; info: number; debug: number; totalToday: number };
}

// ─── CONFIG ──────────────────────────────────────────────

const LEVEL_CONFIG: Record<string, { text: string; class: string }> = {
  error: { text: 'Error', class: 'bg-red-100 text-red-800' },
  warn: { text: 'Warning', class: 'bg-yellow-100 text-yellow-800' },
  info: { text: 'Info', class: 'bg-blue-100 text-blue-800' },
  debug: { text: 'Debug', class: 'bg-gray-100 text-gray-800' },
};

const LEVEL_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'error', label: 'Error' },
  { key: 'warn', label: 'Warning' },
  { key: 'info', label: 'Info' },
  { key: 'debug', label: 'Debug' },
];

const TAB_MAIN = [
  { key: 'access', label: 'Access Logs' },
  { key: 'actions', label: 'Admin Actions' },
];

// ─── PAGE ────────────────────────────────────────────────

export default function LogsAdminPage() {
  const [activeTab, setActiveTab] = useState('access');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Nhật ký hệ thống</h1>

      {/* Main tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        {TAB_MAIN.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'access' ? <AccessLogsTab /> : <AdminActionsTab />}
    </div>
  );
}

// ─── ACCESS LOGS TAB ─────────────────────────────────────

function AccessLogsTab() {
  const [logs, setLogs] = useState<AppLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ error: 0, warn: 0, info: 0, debug: 0, totalToday: 0 });

  // Filters
  const [levelFilter, setLevelFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail modal
  const [selectedLog, setSelectedLog] = useState<AppLog | null>(null);

  // Bulk delete
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Confirm dialog state cho xoa log
  const [confirmAction, setConfirmAction] = useState<{ type: 'bulk' | 'all'; message: string } | null>(null);
  const [logError, setLogError] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await api<StatsResponse>('/logs/stats');
      if (res.success) setStats(res.data);
    } catch (err) {
      console.error('Loi tai stats:', err);
    }
  }, []);

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (levelFilter) params.set('level', levelFilter);
      if (search) params.set('search', search);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const res = await api<LogsResponse>(`/logs?${params}`);
      if (res.success) {
        setLogs(res.data);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err) {
      console.error('Loi tai logs:', err);
    } finally {
      setLoading(false);
    }
  }, [page, levelFilter, search, startDate, endDate]);

  // Stats la global, chi fetch 1 lan khi mount
  useEffect(() => {
    fetchStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Logs phu thuoc vao filter, fetch khi filter thay doi
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  /** Xem chi tiet log */
  const handleView = async (id: string) => {
    try {
      const res = await api<{ success: boolean; data: AppLog }>(`/logs/${id}`);
      if (res.success) setSelectedLog(res.data);
    } catch (err) {
      console.error('Loi tai chi tiet log:', err);
    }
  };

  /** Mo confirm dialog xoa nhieu log */
  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setConfirmAction({ type: 'bulk', message: `Xóa ${selectedIds.size} log đã chọn?` });
  };

  /** Mo confirm dialog xoa tat ca log */
  const handleDeleteAll = () => {
    const msg = levelFilter
      ? `Xóa tất cả log level "${levelFilter}"?`
      : 'Xóa TẤT CẢ log? Hành động này không thể hoàn tác.';
    setConfirmAction({ type: 'all', message: msg });
  };

  /** Thuc hien xoa sau khi xac nhan */
  const handleConfirmDelete = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === 'bulk') {
        await api('/logs/bulk', {
          method: 'DELETE',
          body: JSON.stringify({ ids: Array.from(selectedIds) }),
        });
        setSelectedIds(new Set());
      } else {
        const params = levelFilter ? `?level=${levelFilter}` : '';
        await api(`/logs/all${params}`, { method: 'DELETE' });
      }
      setConfirmAction(null);
      fetchLogs();
      fetchStats();
    } catch (err: any) {
      setConfirmAction(null);
      setLogError(err.message || 'Lỗi khi xóa');
    }
  };

  /** Toggle chon 1 log */
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /** Toggle chon tat ca */
  const toggleSelectAll = () => {
    if (selectedIds.size === logs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(logs.map((l) => l.id)));
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const truncate = (text: string, max: number) =>
    text.length > max ? text.substring(0, max) + '...' : text;

  /** Badge mau cho status code */
  const statusBadge = (code: number | null) => {
    if (!code) return null;
    const cls =
      code >= 500
        ? 'bg-red-100 text-red-700'
        : code >= 400
          ? 'bg-yellow-100 text-yellow-700'
          : code >= 300
            ? 'bg-blue-100 text-blue-700'
            : 'bg-green-100 text-green-700';
    return (
      <span className={`inline-block px-1.5 py-0.5 rounded text-sm font-mono ${cls}`}>
        {code}
      </span>
    );
  };

  return (
    <>
      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <StatsCard label="Errors" value={stats.error} color="text-red-600 bg-red-50" />
        <StatsCard label="Warnings" value={stats.warn} color="text-yellow-600 bg-yellow-50" />
        <StatsCard label="Info" value={stats.info} color="text-blue-600 bg-blue-50" />
        <StatsCard label="Debug" value={stats.debug} color="text-gray-600 bg-gray-50" />
        <StatsCard label="Hom nay" value={stats.totalToday} color="text-slate-900 bg-slate-100" />
      </div>

      {/* Filter bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Level tabs */}
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {LEVEL_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setLevelFilter(tab.key);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  levelFilter === tab.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Date range */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            className="border border-slate-200 rounded-md px-2 py-1.5 text-sm"
          />
          <span className="text-slate-400 text-sm">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            className="border border-slate-200 rounded-md px-2 py-1.5 text-sm"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Input
            placeholder="Tim theo message, endpoint..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      {/* Bulk actions */}
      <div className="flex gap-2 items-center">
        {selectedIds.size > 0 && (
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Xoa {selectedIds.size} log da chon
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleDeleteAll}>
          {levelFilter ? `Xoa tat ca ${levelFilter}` : 'Xoa tat ca'}
        </Button>
      </div>

      {/* Detail modal */}
      {selectedLog && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Chi tiet log</h2>
            <button
              onClick={() => setSelectedLog(null)}
              className="text-slate-400 hover:text-slate-600 text-lg"
            >
              x
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-slate-600">Level:</span>{' '}
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium ${LEVEL_CONFIG[selectedLog.level]?.class}`}
              >
                {LEVEL_CONFIG[selectedLog.level]?.text}
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-600">Thoi gian:</span>{' '}
              <span className="text-slate-900">{formatDate(selectedLog.created_at)}</span>
            </div>
            <div>
              <span className="font-medium text-slate-600">Endpoint:</span>{' '}
              <span className="text-slate-900 font-mono text-sm">
                {selectedLog.endpoint || 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-600">Status:</span>{' '}
              {statusBadge(selectedLog.status_code) || (
                <span className="text-slate-500">N/A</span>
              )}
            </div>
            <div>
              <span className="font-medium text-slate-600">IP:</span>{' '}
              <span className="text-slate-900 font-mono text-sm">{selectedLog.ip || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-slate-600">User ID:</span>{' '}
              <span className="text-slate-900 font-mono text-sm">
                {selectedLog.user_id || 'N/A'}
              </span>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-slate-600">User Agent:</span>{' '}
              <span className="text-slate-500 text-sm">{selectedLog.user_agent || 'N/A'}</span>
            </div>
          </div>

          {/* Message */}
          <div>
            <span className="block font-medium text-slate-600 text-sm mb-1">Message:</span>
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-800">
              {selectedLog.message}
            </div>
          </div>

          {/* Stack trace */}
          {selectedLog.stack_trace && (
            <div>
              <span className="block font-medium text-slate-600 text-sm mb-1">Stack trace:</span>
              <pre className="bg-slate-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap">
                {selectedLog.stack_trace}
              </pre>
            </div>
          )}

          {/* Context JSON */}
          {selectedLog.context && (
            <div>
              <span className="block font-medium text-slate-600 text-sm mb-1">Context:</span>
              <pre className="bg-slate-50 rounded-lg p-4 text-sm overflow-x-auto">
                {JSON.stringify(selectedLog.context, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Bang danh sach */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="text-left px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={logs.length > 0 && selectedIds.size === logs.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300"
                  />
                </th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Level</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Message</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Endpoint</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">IP</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Thoi gian</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Chi tiet</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">
                    Dang tai...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">
                    Khong co log nao
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const lv = LEVEL_CONFIG[log.level] || LEVEL_CONFIG.info;
                  return (
                    <tr
                      key={log.id}
                      className={`border-b border-slate-100 hover:bg-slate-50 ${
                        log.level === 'error' ? 'bg-red-50/30' : ''
                      }`}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(log.id)}
                          onChange={() => toggleSelect(log.id)}
                          className="rounded border-slate-300"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium ${lv.class}`}
                        >
                          {lv.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-[250px]">
                        {truncate(log.message, 60)}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-sm">
                        {log.endpoint ? truncate(log.endpoint, 30) : '-'}
                      </td>
                      <td className="px-4 py-3">{statusBadge(log.status_code) || '-'}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-sm">
                        {log.ip || '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-sm">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleView(log.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Phan trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-slate-200">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Truoc
            </Button>
            <span className="text-sm text-slate-600">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Sau
            </Button>
          </div>
        )}
      </div>

      {/* Confirm dialog xoa log */}
      <ConfirmDialog
        open={!!confirmAction}
        title="Xóa log"
        message={confirmAction?.message || ''}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmAction(null)}
      />

      {/* Error dialog */}
      <ConfirmDialog
        open={!!logError}
        title="Lỗi"
        message={logError}
        confirmLabel="Đóng"
        cancelLabel="Đóng"
        variant="warning"
        onConfirm={() => setLogError('')}
        onCancel={() => setLogError('')}
      />
    </>
  );
}

// ─── ADMIN ACTIONS TAB ──────────────────────────────────

interface AdminActionLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'upload';
  entity_type: string;
  entity_id: string | null;
  description: string;
  changes: Record<string, unknown> | null;
  user_id: string;
  user_name: string | null;
  ip: string | null;
  created_at: string;
}

interface ActionsResponse {
  success: boolean;
  data: AdminActionLog[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface ActionStatsResponse {
  success: boolean;
  data: Record<string, number>;
}

const ACTION_CONFIG: Record<string, { text: string; class: string }> = {
  create: { text: 'Tao moi', class: 'bg-green-100 text-green-800' },
  update: { text: 'Cap nhat', class: 'bg-blue-100 text-blue-800' },
  delete: { text: 'Xoa', class: 'bg-red-100 text-red-800' },
  login: { text: 'Dang nhap', class: 'bg-purple-100 text-purple-800' },
  logout: { text: 'Dang xuat', class: 'bg-gray-100 text-gray-800' },
  upload: { text: 'Upload', class: 'bg-orange-100 text-orange-800' },
};

const ACTION_TABS = [
  { key: '', label: 'Tat ca' },
  { key: 'create', label: 'Tao moi' },
  { key: 'update', label: 'Cap nhat' },
  { key: 'delete', label: 'Xoa' },
  { key: 'login', label: 'Dang nhap' },
  { key: 'upload', label: 'Upload' },
];

function AdminActionsTab() {
  const [actions, setActions] = useState<AdminActionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, number>>({});

  const [actionFilter, setActionFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail view
  const [selectedAction, setSelectedAction] = useState<AdminActionLog | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api<ActionStatsResponse>('/logs/actions/stats');
      if (res.success) setStats(res.data);
    } catch (err) {
      console.error('Loi tai stats:', err);
    }
  }, []);

  const fetchActions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (actionFilter) params.set('action', actionFilter);
      if (search) params.set('search', search);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const res = await api<ActionsResponse>(`/logs/actions?${params}`);
      if (res.success) {
        setActions(res.data);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err) {
      console.error('Loi tai actions:', err);
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter, search, startDate, endDate]);

  // Stats la global, chi fetch 1 lan khi mount
  useEffect(() => {
    fetchStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Actions phu thuoc vao filter, fetch khi filter thay doi
  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <>
      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <StatsCard label="Hom nay" value={stats.totalToday || 0} color="text-slate-900 bg-slate-100" />
        <StatsCard label="Tao moi" value={stats.create || 0} color="text-green-600 bg-green-50" />
        <StatsCard label="Cap nhat" value={stats.update || 0} color="text-blue-600 bg-blue-50" />
        <StatsCard label="Xoa" value={stats.delete || 0} color="text-red-600 bg-red-50" />
        <StatsCard label="Dang nhap" value={stats.login || 0} color="text-purple-600 bg-purple-50" />
      </div>

      {/* Filter bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {ACTION_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActionFilter(tab.key); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  actionFilter === tab.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            className="border border-slate-200 rounded-md px-2 py-1.5 text-sm"
          />
          <span className="text-slate-400 text-sm">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            className="border border-slate-200 rounded-md px-2 py-1.5 text-sm"
          />
        </div>

        <Input
          placeholder="Tim theo mo ta, ten nguoi dung..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Detail modal */}
      {selectedAction && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Chi tiet hanh dong</h2>
            <button
              onClick={() => setSelectedAction(null)}
              className="text-slate-400 hover:text-slate-600 text-lg"
            >
              x
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-slate-600">Hanh dong:</span>{' '}
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium ${
                  (ACTION_CONFIG[selectedAction.action] || ACTION_CONFIG.create).class
                }`}
              >
                {(ACTION_CONFIG[selectedAction.action] || ACTION_CONFIG.create).text}
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-600">Thoi gian:</span>{' '}
              <span className="text-slate-900">{formatDate(selectedAction.created_at)}</span>
            </div>
            <div>
              <span className="font-medium text-slate-600">Doi tuong:</span>{' '}
              <span className="text-slate-900 font-mono text-sm">
                {selectedAction.entity_type}
                {selectedAction.entity_id && ` #${selectedAction.entity_id}`}
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-600">Nguoi thuc hien:</span>{' '}
              <span className="text-slate-900">
                {selectedAction.user_name || selectedAction.user_id}
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-600">IP:</span>{' '}
              <span className="text-slate-900 font-mono text-sm">{selectedAction.ip || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-slate-600">ID:</span>{' '}
              <span className="text-slate-500 font-mono text-sm">{selectedAction.id}</span>
            </div>
          </div>

          {/* Mo ta */}
          <div>
            <span className="block font-medium text-slate-600 text-sm mb-1">Mo ta:</span>
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-800">
              {selectedAction.description}
            </div>
          </div>

          {/* Changes JSON */}
          {selectedAction.changes && (
            <div>
              <span className="block font-medium text-slate-600 text-sm mb-1">Thay doi:</span>
              <pre className="bg-slate-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(selectedAction.changes, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Bang danh sach */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Hanh dong</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Mo ta</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Doi tuong</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Nguoi thuc hien</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">IP</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Thoi gian</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Chi tiet</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    Dang tai...
                  </td>
                </tr>
              ) : actions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    Chua co hanh dong nao
                  </td>
                </tr>
              ) : (
                actions.map((a) => {
                  const cfg = ACTION_CONFIG[a.action] || ACTION_CONFIG.create;
                  return (
                    <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium ${cfg.class}`}>
                          {cfg.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-[300px]">
                        {a.description}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-sm">
                        {a.entity_type}
                        {a.entity_id && <span className="text-slate-400"> #{a.entity_id.slice(0, 8)}</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-700 text-sm">
                        {a.user_name || a.user_id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-sm">
                        {a.ip || '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-sm">
                        {formatDate(a.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedAction(a)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-slate-200">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Truoc
            </Button>
            <span className="text-sm text-slate-600">
              Trang {page} / {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Sau
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── STATS CARD ──────────────────────────────────────────

function StatsCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-xl p-4 ${color}`}>
      <div className="text-2xl font-bold">{value.toLocaleString('vi-VN')}</div>
      <div className="text-sm font-medium opacity-80">{label}</div>
    </div>
  );
}
