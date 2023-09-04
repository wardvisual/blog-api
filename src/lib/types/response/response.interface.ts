export interface APIResponse<T = any> {
  isSuccess: boolean;
  message: string;
  data?: T | T[];
}
