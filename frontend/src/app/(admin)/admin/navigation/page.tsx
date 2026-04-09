'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface MenuNode {
  id: string;
  label: string;
  url: string;
  target: '_self' | '_blank';
  parentId: string | null;
  displayOrder: number;
  isVisible: boolean;
  children: MenuNode[];
}

const EMPTY_FORM = {
  label: '',
  url: '',
  target: '_self' as '_self' | '_blank',
  parentId: '' as string,
  displayOrder: 0,
  isVisible: true,
};

export default function NavigationPage() {
  const [menuTree, setMenuTree] = useState<MenuNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<{ success: boolean; data: MenuNode[] }>('/navigation/menu/all');
      const items = res?.data;
      setMenuTree(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Loi khi tai menu:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  /** Lay danh sach flat tu tree (de render dropdown chon parent) */
  const flattenForDropdown = (nodes: MenuNode[], depth = 0): Array<{ id: string; label: string; depth: number }> => {
    const result: Array<{ id: string; label: string; depth: number }> = [];
    for (const node of nodes) {
      result.push({ id: node.id, label: node.label, depth });
      if (node.children?.length) {
        result.push(...flattenForDropdown(node.children, depth + 1));
      }
    }
    return result;
  };

  /** Flatten tree thanh mang items de gui len API */
  const flattenTreeForSave = (nodes: MenuNode[]): any[] => {
    const result: any[] = [];
    for (const node of nodes) {
      result.push({
        id: node.id,
        label: node.label,
        url: node.url,
        target: node.target,
        parentId: node.parentId,
        displayOrder: node.displayOrder,
        isVisible: node.isVisible,
        children: node.children?.length ? flattenTreeForSave(node.children).map((c: any) => ({
          ...c,
          parentId: undefined, // children nested = implicit parent
        })) : undefined,
      });
    }
    return result;
  };

  /** Mo form them moi */
  const handleAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  /** Mo form chinh sua */
  const handleEdit = (node: MenuNode) => {
    setForm({
      label: node.label,
      url: node.url,
      target: node.target,
      parentId: node.parentId || '',
      displayOrder: node.displayOrder,
      isVisible: node.isVisible,
    });
    setEditingId(node.id);
    setShowForm(true);
  };

  /** Luu — rebuild tree roi gui len API */
  const handleSave = async () => {
    if (!form.label || !form.url) {
      alert('Vui lòng nhập nhãn và URL');
      return;
    }
    setSaving(true);
    try {
      // Tao ban sao cua tree hien tai
      const cloneTree = JSON.parse(JSON.stringify(menuTree)) as MenuNode[];

      if (editingId) {
        // Tim va cap nhat node trong tree
        updateNodeInTree(cloneTree, editingId, form);
      } else {
        // Them node moi
        const newNode: MenuNode = {
          id: Date.now().toString(), // Temp ID — server se generate ID that
          label: form.label,
          url: form.url,
          target: form.target,
          parentId: form.parentId || null,
          displayOrder: form.displayOrder,
          isVisible: form.isVisible,
          children: [],
        };

        if (form.parentId) {
          // Them vao children cua parent
          addToParent(cloneTree, form.parentId, newNode);
        } else {
          cloneTree.push(newNode);
        }
      }

      // Gui len API
      await api('/navigation/menu', {
        method: 'PUT',
        body: JSON.stringify({ items: cloneTree }),
      });

      setShowForm(false);
      fetchMenu();
    } catch (err: any) {
      alert(err.message || 'Khong the luu menu');
    } finally {
      setSaving(false);
    }
  };

  /** Xoa menu item — rebuild tree roi gui len API */
  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Xóa mục "${label}" và tất cả mục con?`)) return;
    setSaving(true);
    try {
      const cloneTree = JSON.parse(JSON.stringify(menuTree)) as MenuNode[];
      const filtered = removeFromTree(cloneTree, id);

      await api('/navigation/menu', {
        method: 'PUT',
        body: JSON.stringify({ items: filtered }),
      });

      fetchMenu();
    } catch (err: any) {
      alert(err.message || 'Khong the xoa menu');
    } finally {
      setSaving(false);
    }
  };

  /** Toggle an/hien */
  const handleToggleVisible = async (node: MenuNode) => {
    setSaving(true);
    try {
      const cloneTree = JSON.parse(JSON.stringify(menuTree)) as MenuNode[];
      toggleVisibleInTree(cloneTree, node.id);

      await api('/navigation/menu', {
        method: 'PUT',
        body: JSON.stringify({ items: cloneTree }),
      });

      fetchMenu();
    } catch (err: any) {
      alert(err.message || 'Khong the cap nhat');
    } finally {
      setSaving(false);
    }
  };

  const dropdownOptions = flattenForDropdown(menuTree);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Menu điều hướng</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition-colors"
        >
          + Thêm mục menu
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? 'Chỉnh sửa mục menu' : 'Thêm mục menu mới'}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nhãn *</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL *</label>
                <input
                  type="text"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="/gioi-thieu hoặc https://..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target</label>
                  <select
                    value={form.target}
                    onChange={(e) => setForm({ ...form, target: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="_self">Cùng tab (_self)</option>
                    <option value="_blank">Tab mới (_blank)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Thứ tự</label>
                  <input
                    type="number"
                    min={0}
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mục cha</label>
                <select
                  value={form.parentId}
                  onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">— Không (menu gốc) —</option>
                  {dropdownOptions
                    .filter((opt) => opt.id !== editingId) // Khong cho chon chinh no lam parent
                    .map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {'—'.repeat(opt.depth)} {opt.label}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isVisible}
                    onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-green-700 focus:ring-green-600"
                  />
                  <span className="text-sm text-slate-700">Hiển thị trên website</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">Hủy</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-green-700 text-white hover:bg-green-800 disabled:opacity-50">
                {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu tree display */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải...</div>
        ) : menuTree.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Chưa có mục menu nào</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {menuTree.map((node) => (
              <MenuRow
                key={node.id}
                node={node}
                depth={0}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleVisible={handleToggleVisible}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MENU ROW (de quy render tree) ────────────────────────

function MenuRow({
  node,
  depth,
  onEdit,
  onDelete,
  onToggleVisible,
}: {
  node: MenuNode;
  depth: number;
  onEdit: (node: MenuNode) => void;
  onDelete: (id: string, label: string) => void;
  onToggleVisible: (node: MenuNode) => void;
}) {
  return (
    <>
      <div className={`flex items-center px-4 py-3 hover:bg-slate-50 ${!node.isVisible ? 'opacity-50' : ''}`}>
        {/* Indent */}
        <div style={{ width: depth * 24 }} className="flex-shrink-0" />

        {/* Arrow icon cho children */}
        {depth > 0 && (
          <span className="text-slate-300 mr-2 text-xs">└</span>
        )}

        {/* Label + URL */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-slate-900 text-sm">{node.label}</div>
          <div className="text-xs text-slate-400 truncate">{node.url}</div>
        </div>

        {/* Target badge */}
        {node.target === '_blank' && (
          <span className="mx-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 whitespace-nowrap">_blank</span>
        )}

        {/* Visible toggle */}
        <button
          onClick={() => onToggleVisible(node)}
          className={`mx-2 w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${
            node.isVisible ? 'bg-green-500' : 'bg-slate-300'
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              node.isVisible ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          <button onClick={() => onEdit(node)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Sửa</button>
          <button onClick={() => onDelete(node.id, node.label)} className="text-sm text-red-600 hover:text-red-800 font-medium">Xóa</button>
        </div>
      </div>

      {/* Children */}
      {node.children?.map((child) => (
        <MenuRow
          key={child.id}
          node={child}
          depth={depth + 1}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleVisible={onToggleVisible}
        />
      ))}
    </>
  );
}

// ─── TREE HELPERS ──────────────────────────────────────────

/** Cap nhat node trong tree theo ID */
function updateNodeInTree(tree: MenuNode[], id: string, form: any): boolean {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) {
      tree[i].label = form.label;
      tree[i].url = form.url;
      tree[i].target = form.target;
      tree[i].displayOrder = form.displayOrder;
      tree[i].isVisible = form.isVisible;

      // Xu ly thay doi parent
      const currentParent = tree[i].parentId;
      if ((form.parentId || null) !== currentParent) {
        // Can chuyen node sang parent moi — logic phuc tap, cho don gian ta rebuild
        // bang cach xoa khoi vi tri cu va them vao parent moi
        const node = tree.splice(i, 1)[0];
        node.parentId = form.parentId || null;
        if (form.parentId) {
          addToParent(tree, form.parentId, node);
        } else {
          tree.push(node);
        }
      }
      return true;
    }
    if (tree[i].children?.length) {
      if (updateNodeInTree(tree[i].children, id, form)) return true;
    }
  }
  return false;
}

/** Them node vao children cua parent */
function addToParent(tree: MenuNode[], parentId: string, node: MenuNode): boolean {
  for (const item of tree) {
    if (item.id === parentId) {
      if (!item.children) item.children = [];
      item.children.push(node);
      return true;
    }
    if (item.children?.length) {
      if (addToParent(item.children, parentId, node)) return true;
    }
  }
  return false;
}

/** Xoa node khoi tree theo ID */
function removeFromTree(tree: MenuNode[], id: string): MenuNode[] {
  return tree.filter((node) => {
    if (node.id === id) return false;
    if (node.children?.length) {
      node.children = removeFromTree(node.children, id);
    }
    return true;
  });
}

/** Toggle visible trong tree */
function toggleVisibleInTree(tree: MenuNode[], id: string): boolean {
  for (const node of tree) {
    if (node.id === id) {
      node.isVisible = !node.isVisible;
      return true;
    }
    if (node.children?.length) {
      if (toggleVisibleInTree(node.children, id)) return true;
    }
  }
  return false;
}
