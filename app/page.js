"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [activeTimerIndex, setActiveTimerIndex] = useState(null); // which task is timing
  const [secondsLeft, setSecondsLeft] = useState(0); // countdown
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reminders, setReminders] = useState([]); // reminders for tasks
  const [newReminders, setNewReminders] = useState(""); // toggle reminders visibility


  // Add a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newSubject || !newTopic || !newDuration) return;

    const newTask = {
      subject: newSubject,
      topic: newTopic,
      duration: parseInt(newDuration),
      status: "pending",
    };

    setTasks([...tasks, newTask]);
    setNewSubject("");
    setNewTopic("");
    setNewDuration("");
  };

  const deleteTask = (indexToDelete) => {
    const updated = tasks.filter((task, i) => i !== indexToDelete);
    setTasks(updated);
  };
  // it counts how many are completed, skipped, ongoing and pending
  // and returns an object with the counts
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    skipped: tasks.filter((t) => t.status === "skipped").length,
    ongoing: tasks.filter((t) => t.status === "ongoing").length,
    pending: tasks.filter((t) => t.status === "pending").length,
  };
  useEffect(() => {
    let timer;
    if (activeTimerIndex !== null && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && activeTimerIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[activeTimerIndex].status = "completed";
      setTasks(updatedTasks);
      setActiveTimerIndex(null);
    }
    return () => clearInterval(timer);
  }, [activeTimerIndex, secondsLeft]);

  // 🧠 Mark task as skipped/completed
  // Update status of task
  const updateTaskStatus = (index, status) => {
    const updated = [...tasks];
    updated[index].status = status;
    setTasks(updated);
    if (index === activeTimerIndex) {
      setActiveTimerIndex(null);
      setSecondsLeft(0);
    }
  };
  const handleAddReminder =() => {
    const trimmed=newReminders.trim();
    if(trimmed)
    {
      setReminders((prev) => [...prev, trimmed]);
      setNewReminders("");
    }
  };
  const handleDeleteReminder=(indexToDelete) => {
    setReminders((prev) => prev.filter((_, i) => i !== indexToDelete));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "ongoing":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "skipped":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
  <main className="min-h-screen bg-pink-50 font-sans flex flex-col md:flex-row">
    {/* 📅 Sidebar Calendar */}
  <aside className="w-full md:w-1/4 bg-white p-4 shadow-md border-r">
  <h2 className="text-xl font-semibold mb-4 text-purple-800">📅 Calendar</h2>
  <Calendar
    onChange={setSelectedDate}
    value={selectedDate}
    className="react-calendar w-full rounded-lg p-2 border border-gray-300 text-sm"
    tileClassName={({ date, view }) =>
      date.toDateString() === selectedDate.toDateString()
        ? "bg-pink-200 text-white rounded-md"
        : "hover:bg-pink-100 rounded-md transition"
    }
  />
  </aside>

    {/* 📚 Main Planner Section */}
    <section className="flex-1 p-6">
      

      <h1 className="text-3xl font-bold mb-4 text-purple-900">📚 My Study Planner</h1>

      <div className="mb-6 space-y-1 text-gray-700">
        <p>Total tasks: {stats.total}</p>
        <p>✅ Completed: {stats.completed}</p>
        <p>❌ Skipped: {stats.skipped}</p>
        <p>▶️ Ongoing: {stats.ongoing}</p>
        <p>⏳ Pending: {stats.pending}</p>
      </div>

      {/* ➕ Add Task Form */}
      <form onSubmit={handleAddTask} className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Subject"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-300 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Topic"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-300 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Duration (min)"
          value={newDuration}
          onChange={(e) => setNewDuration(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-300 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-pink-400 text-white rounded-md hover:bg-pink-500"
        >
          Add Task
        </button>
      </form>
      
      {/* 📝 Task List */}
      <div className="space-y-6">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-300 space-y-2"
          >
            <p><strong>Subject:</strong> {task.subject}</p>
            <p><strong>Topic:</strong> {task.topic}</p>
            <p><strong>Duration:</strong> {task.duration} minutes</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </p>

            {activeTimerIndex === index && (
              <div className="mt-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-semibold w-fit">
                ⏳ Time Left: {Math.floor(secondsLeft / 60)}:
                {String(secondsLeft % 60).padStart(2, "0")}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              <button
                onClick={() => updateTaskStatus(index, "ongoing")}
                disabled={["completed", "skipped"].includes(task.status)}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 disabled:opacity-50"
              >
                ▶ Start
              </button>

              {task.status === "ongoing" && activeTimerIndex !== index && (
                <button
                  onClick={() => {
                    setActiveTimerIndex(index);
                    setSecondsLeft(task.duration * 60);
                  }}
                  className="px-3 py-1 bg-orange-200 text-orange-800 rounded hover:bg-orange-300"
                >
                  ⏱️ Start Timer
                </button>
              )}

              <button
                onClick={() => updateTaskStatus(index, "completed")}
                disabled={["completed", "skipped"].includes(task.status)}
                className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
              >
                ✅ Complete
              </button>

              <button
                onClick={() => updateTaskStatus(index, "skipped")}
                disabled={["completed", "skipped"].includes(task.status)}
                className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
              >
                ❌ Skip
              </button>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this task?")) {
                    deleteTask(index);
                  }
                }}
                className="px-3 py-1 bg-rose-600 text-white rounded hover:bg-rose-700"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="text-gray-500 text-center py-12">No study tasks yet. Add one to get started! 📚</p>
        )}
      </div>
      

    </section>
    {/* 🛎️ Reminders Section */}
    <aside className="w-full md:w-1/4 bg-white p-4 shadow-md border-l">
    <h2 className="text-xl font-semibold mb-4 text-purple-800">🔔 Reminders</h2>

    {/* ➕ Add Reminder Input */}
    <div className="flex items-center gap-2 mb-4">
    <input
      type="text"
      placeholder="Add a reminder..."
      value={newReminders}
      onChange={(e) => setNewReminders(e.target.value)}
      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-300 focus:outline-none"
    />
    <button
      onClick={handleAddReminder}
      className="px-3 py-2 bg-pink-400 text-white rounded-md hover:bg-pink-500"
    >
      ➕
    </button>
  </div>

  {/* 📝 List of Reminders */}
  <ul className="space-y-2">
    {reminders.length === 0 ? (
      <p className="text-gray-400 text-sm">No reminders yet 💡</p>
    ) : (
      reminders.map((reminder, index) => (
        <li
          key={index}
          className="flex justify-between items-center bg-pink-100 px-4 py-2 rounded-md shadow-sm"
        >
          <span className="text-gray-800">{reminder}</span>
          <button
            onClick={() => handleDeleteReminder(index)}
            className="text-rose-600 hover:text-rose-800"
            title="Delete reminder"
          >
            🗑️
          </button>
        </li>
      ))
    )}
  </ul>
</aside>

</main>
  
);
}