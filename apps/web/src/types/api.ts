export interface ApiError {
  title?: string;
  detail?: string;
  status?: number;
  error?: string;
}

export interface GatewayStatusResponse {
  service: string;
  status: string;
  version: string;
  docs: string;
}
