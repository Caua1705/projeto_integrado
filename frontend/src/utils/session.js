export const TOKEN_KEY = "readflow.access_token";

export function createTokenStore(storage = null) {
  let memory = null;
  let available = Boolean(storage);
  const listeners = new Set();
  const emit = (event) => listeners.forEach((listener) => listener(event));
  return {
    get() {
      if (available) {
        try { return storage.getItem(TOKEN_KEY) || null; } catch { available = false; }
      }
      return memory;
    },
    set(token) {
      memory = token;
      if (available) {
        try { storage.setItem(TOKEN_KEY, token); } catch { available = false; }
      }
    },
    clear(reason = "logout") {
      memory = null;
      if (available) {
        try { storage.removeItem(TOKEN_KEY); } catch { available = false; }
      }
      emit({ reason });
    },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  };
}

let storage = null;
try { storage = globalThis.sessionStorage || null; } catch { /* Memory-only fallback. */ }
export const tokenStore = createTokenStore(storage);
