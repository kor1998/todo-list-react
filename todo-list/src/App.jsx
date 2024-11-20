import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import logo from './assets/Logo.svg';
import deleteIcon from './assets/Delete-icon.svg';
import editIcon from './assets/Edit-icon.svg';


const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ t_event: '', dueDate: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch('http://localhost:3000/api/todos');
    const todos = await response.json();
    setTodos(todos);
    setIsLoading(false);
  };

  const addTodo = async () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    await fetch('http://localhost:3000/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...newTodo, color: randomColor })
    });
    setNewTodo({ t_event: '', dueDate: '' });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: 'DELETE'
    });
    fetchTodos();
  };

  const saveEditTodo = async (id, t_event, dueDate) => {
    await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ t_event, dueDate })
    });
    fetchTodos();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="heading-info">
          <img src={logo} alt="logo" />
        </div>
        <div className="todo-list-head">To-Do-List</div>
      </nav>

      <div className="todo-section">
        <div className="todo-input-section">
          <div className="todo-text-section">
            <div className="form-control">
              <input
                className="input input-alt input-text"
                placeholder="Event"
                type="text"
                name="t_event"
                value={newTodo.t_event}
                onChange={handleInputChange}
              />
              <span className="input-border input-border-alt"></span>
            </div>
          </div>
          <div className="todo-date-section">
            <div className="form-control">
              <input
                className="input-date input-alt"
                type="date"
                name="dueDate"
                value={newTodo.dueDate}
                onChange={handleInputChange}
              />
              <span className="input-border input-border-alt"></span>
            </div>
          </div>
          <div className="add-button-section">
            <button className={`add-button ${!newTodo.t_event.trim() || !newTodo.dueDate.trim() ? 'add-button-disabled' : ''}`} 
            onClick={addTodo} disabled={!newTodo.t_event.trim() || !newTodo.dueDate.trim()}>
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="todo-message-section">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              deleteTodo={deleteTodo}
              saveEditTodo={saveEditTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

const TodoItem = ({ todo, deleteTodo, saveEditTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState({ t_event: todo.t_event, dueDate: todo.dueDate });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTodo(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = () => {
    saveEditTodo(todo.id, editedTodo.t_event, editedTodo.dueDate);
    setIsEditing(false);
  };

  return (
    <div className="todo-list-message" style={{ backgroundColor: todo.color }} data-id={todo.id}>
      <div className="todo-info-grid">
        <div className="todo-date-grid">
          <div className="todo-date-info">
            <input
              disabled={!isEditing}
              type="date"
              value={editedTodo.dueDate}
              className="todo-date-input date-edit"
              name="dueDate"
              onChange={handleEditChange}
            />
          </div>
        </div>
        <div className="button-grid">
          {isEditing ? (
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              <img className="edit-image" src={editIcon} alt="Edit" />
            </button>
          )}
          <button className="delete-button" onClick={() => deleteTodo(todo.id)}>
            <img className="delete-image" src={deleteIcon} alt="Delete" />
          </button>
        </div>
      </div>
      <div className="todo-message">
        <textarea
          disabled={!isEditing}
          className="todo-inner-message"
          style={{ backgroundColor: todo.color }}
          value={editedTodo.t_event}
          name="t_event"
          onChange={handleEditChange}
        />
      </div>
    </div>
  );
};

export default App;


App.propTypes = {
  todos: PropTypes.array,
  newTodo: PropTypes.object,
  isLoading: PropTypes.bool,
  fetchTodos: PropTypes.func,
}

TodoItem.propTypes = {
  todo: PropTypes.object,
  deleteTodo: PropTypes.func,
  saveEditTodo: PropTypes.func,
}