import { readToken, readUser, authErrorMessage } from "./auth.js";

export function createAuthSession({ store, loginRequest, userRequest }) {
  let snapshot = Object.freeze({ status: "checking", user: null, error: "", reason: "" });
  let generation = 0;
  let controller = null;
  let unsubscribeStore = null;
  const listeners = new Set();
  const publish = (state) => {
    snapshot = Object.freeze(state);
    listeners.forEach((listener) => listener());
  };
  const anonymous = (reason = "") => publish({ status: "anonymous", user: null, error: "", reason });
  const begin = () => {
    controller?.abort();
    controller = new AbortController();
    const request = controller;
    const id = ++generation;
    publish({ status: "checking", user: null, error: "", reason: "" });
    return { signal: request.signal, abort: () => request.abort(), current: () => id === generation };
  };
  const restore = async () => {
    const operation = begin();
    const token = store.get();
    if (!token) { anonymous(); return; }
    try {
      const user = readUser(await userRequest(operation.signal));
      if (!operation.current() || operation.signal.aborted) return;
      if (store.get() !== token) { anonymous(); return; }
      publish({ status: "authenticated", user, error: "", reason: "" });
    } catch (error) {
      if (!operation.current() || operation.signal.aborted) return;
      if ([401, 403].includes(error?.response?.status) || error.message === "INVALID_USER_RESPONSE") {
        store.clear("expired");
        anonymous("expired");
      } else {
        // Network failure does not grant access or silently discard a retryable session.
        publish({ status: "error", user: null, error: authErrorMessage(error), reason: "" });
      }
    }
  };
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    start() {
      if (!unsubscribeStore) unsubscribeStore = store.subscribe(({ reason }) => {
        generation++;
        controller?.abort();
        anonymous(reason);
      });
      return restore();
    },
    stop() {
      generation++;
      controller?.abort();
      unsubscribeStore?.();
      unsubscribeStore = null;
    },
    retry: restore,
    logout() { generation++; controller?.abort(); store.clear("logout"); anonymous("logout"); },
    async login(credentials, signal) {
      store.clear("replaced");
      const operation = begin();
      const cancel = () => operation.abort();
      signal?.addEventListener("abort", cancel, { once: true });
      if (signal?.aborted) operation.abort();
      try {
        const data = await loginRequest(credentials, operation.signal);
        if (!operation.current() || operation.signal.aborted) return null;
        const token = readToken(data);
        store.set(token);
        const user = readUser(await userRequest(operation.signal));
        if (!operation.current() || operation.signal.aborted) return null;
        if (store.get() !== token) { store.clear("changed"); anonymous(); return null; }
        publish({ status: "authenticated", user, error: "", reason: "" });
        return user;
      } catch (error) {
        if (operation.current()) { store.clear("login-failed"); anonymous(); }
        throw error;
      } finally {
        signal?.removeEventListener("abort", cancel);
        if (operation.current() && operation.signal.aborted) { store.clear("cancelled"); anonymous(); }
      }
    },
  };
}
