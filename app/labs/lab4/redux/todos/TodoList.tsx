"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../store";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { ListGroup } from "react-bootstrap";

export default function TodoList() {
  const { todos } = useSelector(
    (state: RootState) => state.todosReducer
  );
  return (
    <div id="wd-todo-list-redux">
      <h2>Todo List</h2>
      <ListGroup>
        <TodoForm />
        {todos.map((todo: { id: string; title: string }) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
