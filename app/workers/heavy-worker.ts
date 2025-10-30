self.onmessage = (event: MessageEvent) => {
  const { type, payload } = event.data;
  if (type !== "heavyComputation") return;

  const { iterations } = payload;
  const stepSize = Math.max(1, Math.floor(iterations / 100)); // mỗi 1% gửi 1 lần
  const start = performance.now();

  let sum = 0;
  for (let i = 0; i < iterations; i++) {
    sum += Math.sqrt(i);
    if (i % stepSize === 0) {
      const progress = Math.round((i / iterations) * 100);
      (self as DedicatedWorkerGlobalScope).postMessage({
        type: "progress",
        progress
      });
    }
  }

  const end = performance.now();
  (self as DedicatedWorkerGlobalScope).postMessage({
    type: "result",
    result: sum,
    duration: (end - start).toFixed(2)
  });
};

export {};
