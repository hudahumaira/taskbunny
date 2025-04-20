import React, { useReducer, useCallback, useState } from 'react';
import api from './api';
import styled from 'styled-components';
import headerImg from './header.jpg';

// styled-component for the form container
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #ffecef;
  padding: 16px;
  border-radius: 8px;

  img {
    width: 200px;
    border-radius: 6px;
    margin: 0 auto 12px;
  }

  label {
    font-size: 1rem;
    font-weight: bold;
    color: #4a4a4a;
    margin-top: 8px;
  }

  input, select {
    padding: 0.8rem;
    font-size: 1.1rem;
    border: 1px solid #f3c5c5;
    border-radius: 6px;
    background-color: #fffaf9;
    color: #4a2c2a;
  }

  button {
    margin-top: 12px;
    padding: 0.8rem 1.2rem;
    font-size: 1.1rem;
    background-color: #f08080;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #e96565;
  }
`;

//initial state 
const initialState = {
  title: '',
  importance: 0,
  estimated_time: 0,
  due: 'choose your input',
};

//reducer to manage form state updates
function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

//main TaskForm component receives onTaskAdded callback to refresh the list
export default function TaskForm({ onTaskAdded }) {
  const [task, dispatch] = useReducer(reducer, initialState);
  const [error, setError]   = useState(null);

  //handler for any input change
  const handleChange = useCallback((e) => {
    let { name, value } = e.target;
    if (['importance', 'estimated_time'].includes(name)) {
      value = parseInt(value, 10);
    }
    dispatch({ type: 'SET_FIELD', field: name, value });
  }, []);

  //submit handler - POST to /add_task & then reset
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/add_task', task);
      onTaskAdded(res.data.id);
      dispatch({ type: 'RESET' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <img src={headerImg} alt="header" />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label htmlFor="title">Task Title</label>
      <input
        id="title"
        name="title"
        value={task.title}
        onChange={handleChange}
        required
      />

      <label htmlFor="importance">Importance: 1 (low) to 5 (high)</label>
      <input
        id="importance"
        name="importance"
        type="number"
        min="1"
        max="5"
        value={task.importance}
        onChange={handleChange}
        required
      />

      <label htmlFor="estimated_time">Est. Time (minutes)</label>
      <input
        id="estimated_time"
        name="estimated_time"
        type="number"
        min="1"
        value={task.estimated_time}
        onChange={handleChange}
        required
      />

      <label htmlFor="due">When is it Due?</label>
      <select
        id="due"
        name="due"
        value={task.due}
        onChange={handleChange}
        required
      >
        <option value="today">today</option>
        <option value="tomorrow">tomorrow</option>
        <option value="this week">this week</option>
        <option value="this month">this month</option>
        <option value="later">later</option>
      </select>

      <button type="submit">Add Task</button>
    </Form>
  );
}
