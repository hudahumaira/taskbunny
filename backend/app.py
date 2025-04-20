import uuid
import json
import threading
from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from utils import compute_priority
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  
TASK_FILE = 'tasks.json'
_LOCK = threading.Lock()

#function that loads tasks
def load_tasks():
    try:
        with _LOCK, open(TASK_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

#function that write tasks list
def save_tasks(tasks):
    with _LOCK, open(TASK_FILE, 'w') as f:
        json.dump(tasks, f, indent=4)

#endpoint to add a new task (validates input, assigns ID & timestamp)
@app.route('/add_task', methods=['POST'])
def add_task():
    data = request.get_json(force=True)
    required = ["title", "importance", "estimated_time", "due"]
    if not all(k in data for k in required):
        abort(400, description="Missing one of: " + ", ".join(required))

    try:
        data["importance"] = int(data["importance"])
        data["estimated_time"] = int(data["estimated_time"])
    except (ValueError, TypeError):
        abort(400, description="importance and estimated_time must be integers")

    data["id"] = str(uuid.uuid4())
    data["created_at"] = datetime.now(timezone.utc).isoformat()

    tasks = load_tasks()
    tasks.append(data)
    save_tasks(tasks)
    return jsonify(message="task added successfully", id=data["id"]), 201

#endpoint that returns all tasks with its computed priority score
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = load_tasks()
    for t in tasks:
        try:
            t["priority_score"] = compute_priority(t)
        except Exception as e:
            t["priority_score"] = 0.0
    tasks.sort(key=lambda t: t["priority_score"], reverse=True)
    return jsonify(tasks), 200

#endpoint that deletes task by ID after completion
@app.route('/complete_task', methods=['POST'])
def complete_task():
    data = request.get_json(force=True)
    task_id = data.get("id")
    if not task_id:
        abort(400, description="Must provide id")

    tasks = load_tasks()
    new_tasks = [t for t in tasks if t["id"] != task_id]
    if len(new_tasks) == len(tasks):
        abort(404, description="Task not found")

    save_tasks(new_tasks)
    return jsonify(message="task completed"), 200

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
