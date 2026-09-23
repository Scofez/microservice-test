const INVENTORY_URL = process.env.INVENTORY_URL ?? 'http://localhost:3002';
const TIMEOUT_MS = 2000;

// Our own copy of the inventory contract. Importing it from inventory-service would couple the two builds.
export interface StockItem {
  sku: string;
  available: number;
}

export type StockLookup =
  | { kind: 'found'; stockItem: StockItem }
  | { kind: 'unknown-sku' }
  | { kind: 'unavailable'; reason: string };

function isStockItem(value: unknown): value is StockItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'sku' in value &&
    typeof value.sku === 'string' &&
    'available' in value &&
    typeof value.available === 'number'
  );
}

export async function fetchStock(sku: string): Promise<StockLookup> {
  const url = `${INVENTORY_URL}/stock/${encodeURIComponent(sku)}`;

  let response: Response;
  try {
    // Without a timeout, a slow inventory-service makes every order request slow too.
    response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === 'TimeoutError';
    const reason = isTimeout ? `sent no answer within ${TIMEOUT_MS} ms` : 'is unreachable';
    return { kind: 'unavailable', reason: `inventory-service ${reason}` };
  }

  if (response.status === 404) {
    return { kind: 'unknown-sku' };
  }

  if (!response.ok) {
    return { kind: 'unavailable', reason: `inventory-service answered HTTP ${response.status}` };
  }

  const body: unknown = await response.json().catch(() => console.warn(`inventory-service sent a non-JSON body for ${sku}`));

  if (!isStockItem(body)) {
    return { kind: 'unavailable', reason: 'inventory-service sent an unexpected body' };
  }

  return { kind: 'found', stockItem: body };
}
