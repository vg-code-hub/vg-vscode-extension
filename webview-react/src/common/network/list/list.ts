export interface ListResponse<T> {
  data: T[];
  total?: number;
  success?: boolean;
}

export function createListResponse<T, U extends ListResponse<any>>(
  r?: U,
  mapper?: (v: U, i?: number, a?: T[]) => T,
) {
  if (!r) return { data: [], success: true };

  return {
    data: mapper ? (r.data || []).map(mapper as any) : r.data || [],
    total: r.total,
    success: true,
  };
}

export function createListResponseWithCls<T, U extends ListResponse<T>>(
  r: U,
  cls: new (...args: any[]) => T,
) {
  if (!r) return { data: [], success: true };

  const mapper = (d: any) => {
    return Object.assign(new cls() as any, d);
  };
  return {
    data: (r.data || []).map(mapper as any),
    total: r.total,
    success: true,
  };
}
