export interface APIResponse<T = any> {
  isSuccess: boolean;
  statusCode?: number;
  message: string;
  data?: T | T[];
}
