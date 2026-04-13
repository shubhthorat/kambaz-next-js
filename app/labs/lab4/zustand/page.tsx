import Link from "next/link";
import ZustandCounter from "./counter";
import ZustandTodoList from "./todos/ZustandTodoList";

export default function ZustandExamples() {
  return (
    <div id="wd-zustand-examples">
      <Link href="/labs/lab4" className="d-block mb-3">← Back to Lab 4</Link>
      <h2>Zustand Examples</h2>
      <ZustandCounter />
      <hr />
      <ZustandTodoList />
    </div>
  );
}
