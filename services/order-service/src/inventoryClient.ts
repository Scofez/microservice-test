const INVENTORY_URL = process.env.INVENTORY_URL ?? 'http://localhost:3002';
const TIMEOUT_MS = 2000;

// Our own copy of the inventory contract. Importing it from inventory-service would couple the two builds.
export interface StockItem {
  sku: string;
  available: number;
}

export interface DependencyFailure {
  service: 'inventory-service';
  url: string;
  cause: string;
}

export type StockLookup =
  | { kind: 'found'; stockItem: StockItem }
  | { kind: 'unknown-sku' }
  | { kind: 'unavailable'; reason: string; failure: DependencyFailure };

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

// fetch hides the network reason one level down: "fetch failed" wraps { code: "ECONNREFUSED" }.
function causeOf(error: unknown): string {
  if (error instanceof DOMException && error.name === 'TimeoutError') {
    return 'TIMEOUT';
  }
  if (error instanceof Error && error.cause instanceof Error && 'code' in error.cause) {
    return String(error.cause.code);
  }
  return 'NETWORK_ERROR';
}

export async function fetchStock(sku: string): Promise<StockLookup> {
  const url = `${INVENTORY_URL}/stock/${encodeURIComponent(sku)}`;
  const unavailable = (reason: string, cause: string): StockLookup => ({
    kind: 'unavailable',
    reason: `inventory-service ${reason}`,
    failure: { service: 'inventory-service', url, cause },
  });

  let response: Response;
  try {
    // Without a timeout, a slow inventory-service makes every order request slow too.
    response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (error) {
    const cause = causeOf(error);
    const reason = cause === 'TIMEOUT' ? `sent no answer within ${TIMEOUT_MS} ms` : 'is unreachable';
    return unavailable(reason, cause);
  }

  if (response.status === 404) {
    return { kind: 'unknown-sku' };
  }

  if (!response.ok) {
    return unavailable(`answered HTTP ${response.status}`, `HTTP_${response.status}`);
  }

  const body: unknown = await response.json().catch(() => console.warn(`inventory-service sent a non-JSON body for ${sku}`));

  if (!isStockItem(body)) {
    return unavailable('sent an unexpected body', 'INVALID_BODY');
  }

  return { kind: 'found', stockItem: body };
}
