export interface StockItem {
  sku: string;
  available: number;
}

const stockItems: StockItem[] = [
  { sku: 'blue-shirt', available: 10 },
  { sku: 'red-cap', available: 0 },
  { sku: 'green-socks', available: 3 },
];

export function findStock(sku: string): StockItem | undefined {
  return stockItems.find((item) => item.sku === sku);
}
