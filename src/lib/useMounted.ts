"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True after hydration. Used to avoid SSR/client mismatches for values that
 * only exist in the browser (e.g. the persisted inquiry list).
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
