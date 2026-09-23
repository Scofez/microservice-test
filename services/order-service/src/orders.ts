export interface Order {
  id: string;
  sku: string;
  quantity: number;
  customerEmail: string;
}

const orders: Order[] = [
  { id: 'ord-1', sku: 'blue-shirt', quantity: 2, customerEmail: 'ada@example.com' },
  { id: 'ord-2', sku: 'red-cap', quantity: 1, customerEmail: 'grace@example.com' },
  { id: 'ord-3', sku: 'green-socks', quantity: 5, customerEmail: 'linus@example.com' },
];

export function findOrder(id: string): Order | undefined {
  return orders.find((order) => order.id === id);
}
