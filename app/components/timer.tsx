"use client";
import { useEffect, useState } from "react";

export default function UIMonitor() {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setTime(Date.now()), 100);
    return () => clearInterval(id);
  }, []);

  return <div>⏱ {new Date(time).toLocaleTimeString()}</div>;
}