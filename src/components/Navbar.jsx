import React, { useState } from "react"

export default function Navbar({ activeFilter, onFilterChange, toggleDarkMode, isDarkMode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleFilterClick = (filter) => {
    onFilterChange(filter)
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">NoWay-ToDo</div>

      <button className={`mobile-menu-btn ${isMenuOpen ? "open" : ""}`} onClick={handleMenuClick}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <button className={activeFilter === "all" ? "active" : ""} onClick={() => handleFilterClick("all")}>
          All
        </button>
        <button className={activeFilter === "active" ? "active" : ""} onClick={() => handleFilterClick("active")}>
          Active
        </button>
        <button className={activeFilter === "completed" ? "active" : ""} onClick={() => handleFilterClick("completed")}>
          Completed
        </button>
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  )
}

