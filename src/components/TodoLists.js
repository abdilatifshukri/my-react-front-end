import React, { useState, useEffect } from "react";
import './todo.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [status, setStatus] = useState("CREATED");

  useEffect(() => {
    fetch("http://127.0.0.1:9292//todos")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTodos(data);
        }
      });
  }, []);
  
  const createTodo = (event) => {
    event.preventDefault();
    const data = {
      title: todo,
      status: status,
    };
    fetch("http://127.0.0.1:9292//todos/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos([...todos, data]);
        setTodo("");
      });
  };

  const updateTodo = (id, status) => {
    const data = { status: status };
    fetch(`http://127.0.0.1:9292//update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then(() => {
          setTodos(
            todos.map((todo) => {
              if (todo.id === id) {
                todo.status = status;
              }
              return todo;
            })
          );
        })
        .catch((error) => {
          console.error("Error updating todo:", error);
        });
      
  };

  const deleteTodo = (id) => {
    fetch(`http://127.0.0.1:9292//todos/destroy/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      });
  };

  return (
    <div>
      <h1>Todos</h1>
      <form onSubmit={createTodo}>
        <input
          type="text"
          value={todo}
          onChange={(event) => setTodo(event.target.value)}
        />
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="CREATED">Created</option>
          <option value="ONGOING">Ongoing</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <button type="submit">Add</button>
      </form>
        <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <span>{todo.status}</span>
            <button onClick={() => updateTodo(todo.id, "ONGOING")}>
              Start
            </button>
            <button onClick={() => updateTodo(todo.id, "CANCELLED")}>
              Cancel
            </button>
            <button onClick={() => updateTodo(todo.id, "COMPLETED")}>
              Complete
            </button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
         </ul>
    </div>
  );
}

export default App;
