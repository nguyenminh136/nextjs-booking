self.onmessage = (event) => {
  const { type, payload } = event.data;

  if (type === "heavyComputation") {
    const result = heavyComputation(payload.iterations);
    self.postMessage({ type: "result", result });
  }
};

// Một hàm CPU-heavy ví dụ
function heavyComputation(iterations) {
  let sum = 0;
  for (let i = 0; i < iterations; i++) {
    sum += Math.sqrt(i);
  }
  return sum;
}
