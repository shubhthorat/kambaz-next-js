import { create } from "zustand";

export interface Todo {
  id: string;
  title: string;
}

interface TodoState {
  todos: Todo[];
  todo: Todo;
  addTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (todo: Todo) => void;
  setTodo: (todo: Todo) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [
    { id: "1", title: "Learn React" },
    { id: "2", title: "Learn Node" },
  ],
  todo: { id: "-1", title: "Learn Mongo" },
  addTodo: (newTodo) =>
    set((state) => {
      const added = {
        ...newTodo,
        id: new Date().getTime().toString(),
      };
      return {
        todos: [...state.todos, added],
        todo: { id: "-1", title: "" },
      };
    }),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
  updateTodo: (updatedTodo) =>
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === updatedTodo.id ? updatedTodo : t
      ),
      todo: { id: "-1", title: "" },
    })),
  setTodo: (todo) => set({ todo }),
}));
