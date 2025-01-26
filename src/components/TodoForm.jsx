import React, { useState } from "react"

export default function TodoForm({ onAdd }) {
  const [text, setText] = useState("")
  const [reminderDate, setReminderDate] = useState("")
  const [isDateInputVisible, setIsDateInputVisible] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim() && !isDateInputVisible) {
      setIsDateInputVisible(true)
    } else if (text.trim() && reminderDate) {
      onAdd(text.trim(), reminderDate)
      setText("")
      setReminderDate("")
      setIsDateInputVisible(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e)
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      {!isDateInputVisible ? (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="todo-input"
        />
      ) : (
        <input
          type="datetime-local"
          value={reminderDate}
          onChange={(e) => setReminderDate(e.target.value)}
          onKeyPress={handleKeyPress}
          className="reminder-input"
        />
      )}
      <button type="submit" className="add-btn">
        {isDateInputVisible ? "Set Reminder" : "Add Task"}
      </button>
    </form>
  )
}

