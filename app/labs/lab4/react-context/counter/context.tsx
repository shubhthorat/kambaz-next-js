"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface CounterContextState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const CounterContext = createContext<
  CounterContextState | undefined
>(undefined);

export const CounterProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const value: CounterContextState = {
    count,
    increment,
    decrement,
  };
  return (
    <CounterContext.Provider value={value}>
      {children}
    </CounterContext.Provider>
  );
};

export const useCounter = () => {
  const context = useContext(CounterContext);
  return context;
};
