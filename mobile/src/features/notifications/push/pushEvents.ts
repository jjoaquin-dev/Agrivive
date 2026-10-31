export type PushSignal = {
  type?: string;
  referenceId?: string;
  path?: string;
};

type Listener = (signal: PushSignal) => void;

const listeners = new Set<Listener>();

/** Called when a push arrives while the app is open. */
export function emitPushReceived(data: unknown) {
  const raw = (data ?? {}) as Record<string, unknown>;
  const signal: PushSignal = {
    type: typeof raw.type === "string" ? raw.type : undefined,
    referenceId: typeof raw.referenceId === "string" ? raw.referenceId : undefined,
    path: typeof raw.path === "string" ? raw.path : undefined,
  };
  listeners.forEach((listener) => listener(signal));
}

export function onPushReceived(listener: Listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
