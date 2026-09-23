export interface Notification {
  id: string;
  orderId: string;
  recipient: string;
  message: string;
  sentAt: string;
}

const notifications: Notification[] = [];

export function listNotifications(): Notification[] {
  return [...notifications];
}
