"use client";

import { useHeavyComputation } from "@/hooks/use-web-worker";
import { useState } from "react";

export default function HeavyComputation() {
  const { run, result, duration, progress } = useHeavyComputation();
  const [iterations, setIterations] = useState(2e7);

  return (
    <div className="flex flex-col items-center gap-4">
      <div>
        <label className="mr-2">Iterations:</label>
        <input
          type="number"
          value={iterations}
          onChange={e => setIterations(Number(e.target.value))}
          className="border p-1 rounded"
        />
      </div>
      <button
        onClick={() => run(iterations)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Run Heavy Computation
      </button>

      <div className="w-3/4 bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-green-500 h-4 transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="text-sm text-gray-600">{progress}%</p>

      {result !== null && (
        <div className="text-center">
          <p>✅ Result: {Math.round(result)}</p>
          <p>⏱ Duration: {duration} ms</p>
        </div>
      )}
    </div>
  );
}
