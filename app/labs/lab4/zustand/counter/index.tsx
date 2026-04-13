"use client";

import { useCounterStore } from "./store";

export default function ZustandCounter() {
  const { count, increase, decrease, setCount, reset } =
    useCounterStore((state) => state);
  return (
    <div className="m-2">
      <h1 className="text-3xl font-semibold leading-10 text-black">
        Zustand Counter
      </h1>
      Count: {count}
      <br />
      <button onClick={() => increase(1)}>Increase</button>
      <button onClick={() => decrease(1)} className="ms-2">
        Decrease
      </button>
      <button onClick={() => setCount(10)} className="ms-2">
        Set to 10
      </button>
      <button onClick={() => reset()} className="ms-2">
        Reset
      </button>
    </div>
  );
}
