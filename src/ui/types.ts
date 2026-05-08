export type Theme = "light" | "dark";

export type StatusType = "" | "success" | "error" | "info";

export interface Status {
  type: StatusType;
  message: string;
}

export interface PluginStatusMessage {
  type: "status";
  statusType?: "success" | "error" | "info";
  message?: string;
}
