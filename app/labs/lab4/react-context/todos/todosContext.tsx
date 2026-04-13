"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export interface Todo {
  id: string;
  title: string;
}

interface TodosContextState {
  todos: Todo[];
  todo: Todo;
  addTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (todo: Todo) => void;
  setTodo: (todo: Todo) => void;
}

const TodosContext = createContext<TodosContextState | undefined>(undefined);

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", title: "Learn React" },
    { id: "2", title: "Learn Node" },
  ]);
  const [todo, setTodoState] = useState<Todo>({
    id: "-1",
    title: "Learn Mongo",
  });

  const addTodo = (newTodo: Todo) => {
    const added = {
      ...newTodo,
      id: new Date().getTime().toString(),
    };
    setTodos([...todos, added]);
    setTodoState({ id: "-1", title: "" });
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos(
      todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
    );
    setTodoState({ id: "-1", title: "" });
  };

  const setTodo = (t: Todo) => {
    setTodoState(t);
  };

  const value: TodosContextState = {
    todos,
    todo,
    addTodo,
    deleteTodo,
    updateTodo,
    setTodo,
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodosContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodosProvider");
  }
  return context;
};
