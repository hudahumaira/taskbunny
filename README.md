# TaskBunny: task manager

A simple full-stack task manager built with Flask (backend) and React (frontend). It allows a user to add, view, and complete tasks. Each task has a title, importance level, estimated time, and due date. Tasks are ranked by a computed priority score based on these attributes and age of the task.

## Learning Goals
### Flask (Backend)
- RESTful API design: Creating endpoints like `/add_task`, `/tasks`, `/complete_task`
- Ensuring input data is validates and returning HTTP status codes
- CORS configuration: Enabling cross-origin for a frontend application
- Reading and writing `tasks.json` with control using threading locks
- Using `abort` and error responses for missing fields, invalid data, or not found files

### React (Frontend)
- Building components like `TaskForm`, `TaskList` and `TaskCard` and composing them
- Managing local form state with the help of `useReducer` and controlling the live task list using `useState`
- Using `useEffect` and `useCallback` to fetch data from backend and refreshing changes
- Configuring a shared `axios` instance for API calls, handling responses & errors along with updating UI
- Using `React.memo` and `useCallback` to reduce unnecessary re-renders
- Inline erro messages and alerts for user feedback

  ## Running
  ### Backend
  1. Go to the `backend` folder:
     ```bash
     cd backend
  2. Install dependencies (if needed):
     ```bash
     pip install flask flask-cors
  3. Run the server
     ```bash
     python app.py

  ### Frontend
  1. Go to the `frontend` folder:
     ```bash
     cd frontend
  2. Install dependencies (if needed):
     ```bash
     npm install
  3. Start the development server:
     ```bash
     npm start
  4. Open `http://localhost:3000` in browser
     
