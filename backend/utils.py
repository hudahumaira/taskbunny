import math
from datetime import datetime, timezone

#computes a priority score (between 0.0 to 1.0)
def compute_priority(task):
    #importance (1-5 scaled to 0.0-1.0)
    imp_raw = task.get("importance", 3)
    imp = max(1, min(5, int(imp_raw)))
    imp_score = (imp - 1) / 4

    #due date weights
    due_weights = {
        "today": 1.0,
        "tomorrow": 0.8,
        "this week": 0.5,
        "this month": 0.3,
        "later": 0.1
    }
    due_key = task.get("due", "").lower()
    due_score = due_weights.get(due_key, 0.1)

    #shorter tasks get higher score
    t = max(1, int(task.get("estimated_time", 30)))
    quick_win = 1 / (1 + math.log1p(t))

    #age-based score
    created_at = task.get("created_at")
    age_days = 0
    if created_at:
        try:
            dt = datetime.fromisoformat(created_at)
            age_days = (datetime.now(timezone.utc) - dt).total_seconds() / 86400
        except ValueError:
            pass

    if age_days < 1:
        newness = 0.5
    elif age_days < 7:
        newness = 0.25
    else:
        newness = 0

    #combine all together with weights
    score = (
        0.4 * imp_score +
        0.3 * due_score +
        0.2 * quick_win +
        0.1 * newness
    )
    return round(score, 4)
