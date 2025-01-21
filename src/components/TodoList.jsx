export default function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
          <label className="todo-label">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
            />
            <span className="checkmark"></span>
            <span className="todo-text">{todo.text}</span>
          </label>
          <button 
            className="delete-btn"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}