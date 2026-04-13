"use client";

import Link from "next/link";
import { CounterProvider } from "./counter/context";
import CounterContextComponent from "./counter";
import { TodosProvider } from "./todos/todosContext";
import ReactContextTodoList from "./todos/ReactContextTodoList";

export default function ReactContextExamples() {
  return (
    <div id="wd-react-context-examples">
      <Link href="/labs/lab4" className="d-block mb-3">← Back to Lab 4</Link>
      <h1>React Context Examples</h1>
      <CounterProvider>
        <CounterContextComponent />
      </CounterProvider>
      <hr />
      <TodosProvider>
        <ReactContextTodoList />
      </TodosProvider>
    </div>
  );
}
