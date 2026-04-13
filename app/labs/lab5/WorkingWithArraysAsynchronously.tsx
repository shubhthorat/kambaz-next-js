"use client";

import { useEffect, useState } from "react";
import { ListGroup, Form } from "react-bootstrap";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { FaPencil } from "react-icons/fa6";
import * as client from "./client";

type Todo = {
  id: number;
  title: string;
  completed?: boolean;
  description?: string;
  editing?: boolean;
};

export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTodos = async () => {
    const data = await client.fetchTodos();
    setTodos(data);
  };

  const removeTodo = async (todo: Todo) => {
    const updated = await client.removeTodo(todo);
    setTodos(updated);
  };

  const createNewTodo = async () => {
    const data = await client.createNewTodo();
    setTodos(data);
  };

  const postNewTodo = async () => {
    const newTodo = await client.postNewTodo({
      title: "New Posted Todo",
      completed: false,
    });
    setTodos((prev) => [...prev, newTodo]);
  };

  const deleteTodo = async (todo: Todo) => {
    try {
      setErrorMessage(null);
      await client.deleteTodo(todo);
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrorMessage(
        err.response?.data?.message ?? "Delete failed"
      );
    }
  };

  const editTodo = (todo: Todo) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...todo, editing: true } : t))
    );
  };

  const updateTodo = async (todo: Todo) => {
    try {
      setErrorMessage(null);
      await client.updateTodo(todo);
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrorMessage(
        err.response?.data?.message ?? "Update failed"
      );
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>
      {errorMessage && (
        <div
          id="wd-todo-error-message"
          className="alert alert-danger mb-2 mt-2"
        >
          {errorMessage}
        </div>
      )}
      <h4>
        Todos
        <FaPlusCircle
          onClick={createNewTodo}
          className="text-success float-end fs-3"
          id="wd-create-todo"
          role="button"
          aria-label="Create todo"
        />
        <FaPlusCircle
          onClick={postNewTodo}
          className="text-primary float-end fs-3 me-3"
          id="wd-post-todo"
          role="button"
          aria-label="Post new todo"
        />
      </h4>
      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item key={todo.id}>
            <FaTrash
              onClick={() => removeTodo(todo)}
              className="text-danger float-end mt-1"
              id="wd-remove-todo"
              role="button"
              aria-label="Remove todo"
            />
            <TiDelete
              onClick={() => deleteTodo(todo)}
              className="text-danger float-end me-2 fs-3"
              id="wd-delete-todo"
              role="button"
              aria-label="Delete todo"
            />
            <FaPencil
              onClick={() => editTodo(todo)}
              className="text-primary float-end me-2 mt-1"
              role="button"
              aria-label="Edit todo"
            />
            <input
              type="checkbox"
              className="form-check-input me-2 float-start"
              defaultChecked={todo.completed}
              onChange={(e) =>
                updateTodo({ ...todo, completed: e.target.checked })
              }
            />
            {!todo.editing ? (
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.title}
              </span>
            ) : (
              <Form.Control
                className="w-50 float-start"
                value={todo.title}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    const v = (e.target as HTMLInputElement).value;
                    await updateTodo({
                      ...todo,
                      title: v,
                      editing: false,
                    });
                  }
                }}
                onChange={(e) => {
                  const title = e.target.value;
                  setTodos((prev) =>
                    prev.map((t) =>
                      t.id === todo.id ? { ...t, title } : t
                    )
                  );
                }}
              />
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
