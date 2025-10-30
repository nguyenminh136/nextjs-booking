"use client";
import { useEffect, useRef, useState } from "react";

// 👇 kiểu đặc biệt: import.meta.url + new URL(...)
// Cách này tương thích Turbopack & bundler hiện đại (không cần file public)
const workerUrl = new URL("@/workers/heavy-worker.ts", import.meta.url);

export function useHeavyComputation() {
  const [result, setResult] = useState<number | null>(null);
  const [duration, setDuration] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(workerUrl, { type: "module" });
    workerRef.current.onmessage = e => {
      const { type, result, duration, progress } = e.data;
      if (type === "progress") setProgress(progress);
      if (type === "result") {
        setResult(result);
        setDuration(duration);
        setProgress(100);
      }
    };
    return () => workerRef.current?.terminate();
  }, []);

  const run = (iterations: number) => {
    setResult(null);
    setDuration("");
    setProgress(0);
    workerRef.current?.postMessage({
      type: "heavyComputation",
      payload: { iterations }
    });
  };

  return { run, result, duration, progress };
}
