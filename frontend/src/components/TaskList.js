import React, { useEffect, useState, useCallback } from 'react';
import api from './api';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import TaskForm from './TaskForm';

//wrapper for the list section
const ListWrapper = styled.div`
  margin-top: 24px;
  color: #4a4a4a;
`;

//card styling for each task
const Card = styled.div`
  background: #fff0f2;
  border: 1px solid #ffccd5;
  border-radius: 8px;
  padding: 16px;
  color: #4a4a4a;
`;

//button styling for marking done
const Button = styled.button`
  margin-top: 8px;
  padding: 0.8rem 1.2rem;
  font-size: 1.05rem;
  background-color: #f08080;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e96565;
  }
`;

//single task card component
function TaskCard({ task, onComplete }) {
  return (
    <Card>
      <h3>{task.title}</h3>
      <p><strong>due:</strong> {task.due}</p>
      <p><strong>priority:</strong> {task.priority_score.toFixed(2)}</p>
      <p><strong>importance:</strong> {task.importance}</p>
      <p><strong>time:</strong> {task.estimated_time}m</p>
      <Button onClick={() => onComplete(task.id)}>
        Mark Done 🐰
      </Button>
    </Card>
  );
}

//propTypes to validate TaskCard props
TaskCard.propTypes = {
  task: PropTypes.shape({
    id:            PropTypes.string.isRequired,
    title:         PropTypes.string.isRequired,
    due:           PropTypes.string.isRequired,
    priority_score:PropTypes.number.isRequired,
    importance:    PropTypes.number.isRequired,
    estimated_time:PropTypes.number.isRequired
  }).isRequired,
  onComplete: PropTypes.func.isRequired
};

//avoid re-renders if props unchanged
const MemoizedTaskCard = React.memo(TaskCard);

export default function TaskList() {
  const [tasks,    setTasks]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  //fetch tasks from backend, compute priorities
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
      setError(null);
    } catch {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  //called by TaskForm after adding a task
  const handleTaskAdded = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  //mark a task complete, thenr reload page to remove that task
  const completeTask = useCallback(async (id) => {
    try {
      await api.post('/complete_task', { id });
      fetchTasks();
    } catch {
      alert('Failed to complete task. Please try again.');
    }
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <TaskForm onTaskAdded={handleTaskAdded} />

      <ListWrapper>
        <h2>Your Ranked Tasks</h2>
        {tasks.length === 0
          ? <p>No tasks yet! Add one above.</p>
          : (
            <ol style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
              {tasks.map(task => (
                <li key={task.id} style={{ marginBottom: '1rem' }}>
                  <MemoizedTaskCard task={task} onComplete={completeTask} />
                </li>
              ))}
            </ol>
          )
        }
      </ListWrapper>
    </>
  );
}
