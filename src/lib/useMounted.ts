"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during server rendering and the first client render (hydration),
 * true afterwards. Uses useSyncExternalStore instead of an effect that calls
 * setState, which is what the react-hooks/set-state-in-effect rule flags.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true, // client snapshot
    () => false, // server / hydration snapshot
  );
}