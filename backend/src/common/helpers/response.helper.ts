/** Wrap thanh cong */
export function ok<T>(data: T, message = 'OK') {
  return { success: true, data, message };
}

/** Wrap loi */
export function fail(message: string) {
  return { success: false, data: null, message };
}

/** Wrap danh sach co phan trang */
export function paginated<T>(data: T[], meta: { page: number; limit: number; total: number }) {
  return {
    success: true,
    data,
    message: 'OK',
    pagination: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.limit),
    },
  };
}
