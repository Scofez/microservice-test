import type { StockItem } from './inventoryClient.ts';
import type { Order } from './orders.ts';

export interface Availability {
  orderId: string;
  sku: string;
  requested: number;
  available: number;
  isAvailable: boolean;
}

export function checkAvailability(order: Order, stockItem: StockItem): Availability {
  return {
    orderId: order.id,
    sku: order.sku,
    requested: order.quantity,
    available: stockItem.available,
    isAvailable: stockItem.available >= order.quantity,
  };
}
