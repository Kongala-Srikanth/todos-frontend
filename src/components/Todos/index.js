import { useState } from 'react'
import {v4 as uuid} from 'uuid'
import './index.css'

const statusSelect = {
  pending: 'Pending',
  done: 'Done',
  inProgress: 'In Progress',
  completed: 'Completed'
}

const Todos = () => {
    const [task, setTask] = useState('')
    const [status, setStatus] = useState(statusSelect.pending)
    const [error, setError] = useState('')

    const onAddBtn = () => {

      if (task === ''){
        setError('Please Enter Task Name')
        return
      }

      const todoTask = {
        id: uuid(),task, status
      }
      setError('')
      setStatus(statusSelect.pending)
      setTask('')
      console.log(todoTask)
    }
    

    return (
      <div className="todos-container">
      <header className="todos-header">
        <h1>Todo List</h1>
      </header>
  
     
      <div className="add-task-container">
        <input type="text" value={task} className="task-input" onChange={e => setTask(e.target.value)} placeholder="Task Name" />
        <select value={status} className="status-select" onChange={e => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button className="add-task-btn" onClick={onAddBtn}>Add Task</button>
      </div>
  
      {error && <p className="error">{error}</p>}
      <ul className="todos-list">
        
        <li className="todo-item">
          <div className="todo-content">
            <p className="todo-title">Complete Assignment</p>
            <span className="todo-status pending">Pending</span>
          </div>
          <div className="todo-actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
          </div>
        </li>
  
        
      </ul>
    </div>
    )
}

export default Todos