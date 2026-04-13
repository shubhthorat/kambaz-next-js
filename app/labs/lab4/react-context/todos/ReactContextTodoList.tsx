"use client";

import { useTodos } from "./todosContext";
import { Button, Form, ListGroup } from "react-bootstrap";

export default function ReactContextTodoList() {
  const { todos, todo, addTodo, deleteTodo, updateTodo, setTodo } =
    useTodos();

  return (
    <div id="wd-react-context-todo-list">
      <h2>Todo List</h2>
      <ListGroup>
        <ListGroup.Item>
          <Button
            onClick={() => addTodo(todo)}
            id="wd-add-todo-click"
            className="me-2"
          >
            Add
          </Button>
          <Button
            onClick={() =>
              todo.id && todo.id !== "-1" && updateTodo(todo)
            }
            id="wd-update-todo-click"
            className="me-2"
          >
            Update
          </Button>
          <Form.Control
            value={todo.title}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
          />
        </ListGroup.Item>
        {todos.map((t) => (
          <ListGroup.Item key={t.id}>
            <Button
              onClick={() => deleteTodo(t.id)}
              id="wd-delete-todo-click"
              className="me-2"
            >
              Delete
            </Button>
            <Button
              onClick={() => setTodo(t)}
              id="wd-set-todo-click"
              className="me-2"
            >
              Edit
            </Button>
            {t.title}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
