"use client";

import Link from "next/link";
import HelloRedux from "./hello";
import CounterRedux from "./CounterRedux";
import AddRedux from "./AddRedux";
import TodoList from "./todos/TodoList";

export default function ReduxExamples() {
  return (
    <div id="wd-redux-examples">
      <Link href="/labs/lab4" className="d-block mb-3">← Back to Lab 4</Link>
      <h2>Redux Examples</h2>
      <HelloRedux />
      <CounterRedux />
      <AddRedux />
      <TodoList />
    </div>
  );
}
