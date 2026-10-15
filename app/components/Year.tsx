"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export default function Year() {
  const year = useSyncExternalStore(
    subscribe,
    () => String(new Date().getFullYear()),
    () => "2026",
  );
  return <>{year}</>;
}
