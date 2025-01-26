import React, { useState, useEffect, useCallback, useRef } from "react"
import Navbar from "./components/Navbar"
import TodoForm from "./components/TodoForm"
import TodoList from "./components/TodoList"
import "./App.css"

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos")
    return savedTodos ? JSON.parse(savedTodos) : []
  })
  const [filter, setFilter] = useState("all")
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })
  const audioContextRef = useRef(null)

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode)
  }, [isDarkMode])

  const addTodo = (text, reminderDate) => {
    setTodos([...todos, { id: Date.now(), text, completed: false, reminderDate, reminderPlayed: false }])
  }

  const toggleTodo = (id) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  })

  const playBeepSound = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }

    const audioContext = audioContextRef.current
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.2)

    // Use a service worker to play sound in the background
    if ("serviceWorker" in navigator && "Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification("Todo Reminder", {
              body: "A task reminder has been completed!",
              silent: true,
            })
          })
        }
      })
    }
  }, [])

  const checkReminders = useCallback(() => {
    const now = new Date()
    let updatedTodos = false
    const newTodos = todos.map((todo) => {
      if (todo.reminderDate && new Date(todo.reminderDate) <= now && !todo.completed) {
        playBeepSound()
        updatedTodos = true
        return { ...todo, completed: true, reminderPlayed: true }
      }
      return todo
    })

    if (updatedTodos) {
      setTodos(newTodos)
    }
  }, [todos, playBeepSound])

  useEffect(() => {
    const intervalId = setInterval(checkReminders, 1000) // Check every second

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkReminders()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [checkReminders])

  return (
    <div className="app">
      <Navbar
        activeFilter={filter}
        onFilterChange={setFilter}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isDarkMode={isDarkMode}
      />

      <main className="main-content">
        <TodoForm onAdd={addTodo} />
        <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
        {todos.some((todo) => todo.completed) && (
          <button className="clear-completed" onClick={clearCompleted}>
            Clear Completed
          </button>
        )}
      </main>
    </div>
  )
}

export default App

