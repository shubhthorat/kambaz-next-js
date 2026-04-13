"use client";

import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { RootState } from "../../store";
import { Button, Form, ListGroup } from "react-bootstrap";

export default function TodoForm() {
  const { todo } = useSelector(
    (state: RootState) => state.todosReducer
  );
  const dispatch = useDispatch();
  return (
    <ListGroup.Item>
      <Button
        onClick={() => dispatch(addTodo(todo))}
        id="wd-add-todo-click"
        className="me-2"
      >
        Add
      </Button>
      <Button
        onClick={() =>
          todo.id && todo.id !== "-1" && dispatch(updateTodo(todo))
        }
        id="wd-update-todo-click"
        className="me-2"
      >
        Update
      </Button>
      <Form.Control
        value={todo.title}
        onChange={(e) =>
          dispatch(setTodo({ ...todo, title: e.target.value }))
        }
      />
    </ListGroup.Item>
  );
}
