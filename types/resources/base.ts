export interface BaseType {
  id: number | typeof undefined;
  active?: boolean;
  sequence?: number;

  // Timestamp
  created_at?: string | Date;
  updated_at?: string | Date;
}
