type AuthEvent = "FORCE_LOGOUT";

type AuthEventListener = (event: AuthEvent) => void;

const listeners = new Set<AuthEventListener>();

export const emitAuthEvent = (event: AuthEvent) => {
  listeners.forEach((listener) => listener(event));
};

export const subscribeAuthEvent = (listener: AuthEventListener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
