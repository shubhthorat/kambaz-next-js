"use client";

import { useState } from "react";
import { Form } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithArrays() {
  const API = `${HTTP_SERVER}/lab5/todos`;
  const [todo, setTodo] = useState({
    id: "1",
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    completed: false,
  });

  return (
    <div id="wd-working-with-arrays">
      <h3>Working with Arrays</h3>
      <h4>Retrieving Arrays</h4>
      <a id="wd-retrieve-todos" className="btn btn-primary" href={API}>
        Get Todos
      </a>
      <hr />
      <h4>Retrieving an Item from an Array by ID</h4>
      <a
        id="wd-retrieve-todo-by-id"
        className="btn btn-primary float-end"
        href={`${API}/${todo.id}`}
      >
        Get Todo by ID
      </a>
      <Form.Control
        id="wd-todo-id"
        className="w-50"
        value={todo.id}
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <hr />
      <h4>Filtering Array Items</h4>
      <a
        id="wd-retrieve-completed-todos"
        className="btn btn-primary"
        href={`${API}?completed=true`}
      >
        Get Completed Todos
      </a>
      <hr />
      <h4>Creating new Items in an Array</h4>
      <a id="wd-create-todo" className="btn btn-primary" href={`${API}/create`}>
        Create Todo
      </a>
      <hr />
      <h4>Removing from an Array</h4>
      <a
        id="wd-remove-todo"
        className="btn btn-primary float-end"
        href={`${API}/${todo.id}/delete`}
      >
        Remove Todo with ID = {todo.id}
      </a>
      <Form.Control
        className="w-50"
        value={todo.id}
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <hr />
      <h4>Updating an Item in an Array</h4>
      <a
        href={`${API}/${todo.id}/title/${encodeURIComponent(todo.title)}`}
        className="btn btn-primary float-end"
        id="wd-update-todo-title"
      >
        Update Todo Title
      </a>
      <Form.Control
        defaultValue={todo.id}
        className="w-25 float-start me-2"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <Form.Control
        defaultValue={todo.title}
        className="w-50 float-start"
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
      />
      <br />
      <br />
      <hr />
      <h4>Update completed (path)</h4>
      <a
        id="wd-update-todo-completed"
        className="btn btn-warning me-2"
        href={`${API}/${todo.id}/completed/${todo.completed}`}
      >
        Set completed = {String(todo.completed)}
      </a>
      <Form.Check
        type="checkbox"
        label="Completed"
        checked={todo.completed}
        onChange={(e) =>
          setTodo({ ...todo, completed: e.target.checked })
        }
      />
      <hr />
      <h4>Update description (path)</h4>
      <a
        id="wd-update-todo-description"
        className="btn btn-warning float-end"
        href={`${API}/${todo.id}/description/${encodeURIComponent(todo.description)}`}
      >
        Update description
      </a>
      <Form.Control
        className="w-75"
        value={todo.description}
        onChange={(e) =>
          setTodo({ ...todo, description: e.target.value })
        }
      />
      <hr />
    </div>
  );
}
