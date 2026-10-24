# Take-Home Assessment: Learner Progress MVP

An MVP to validate whether a dedicated "my progress" view improves learner re-engagement. 

**Stack:** TypeScript backend **(Node + Express)** + **React**

## Prerequisites

- **Node.js 20+** and **npm** (`node -v`)
- **Git**
- **Ports 3001** (API) and **5173** (React) free


## How to Run

1. **Backend:**

In a terminal:
   ```bash
   cd backend && npm install && npm test && npm run dev
   ```
   Navigate to http://localhost:3001/health to ensure that API is up and running.

2. **Frontend:**

In a separate terminal:
   ```bash
   cd frontend-react && npm install && npm run dev
   ```
   Navigate to http://localhost:5173 to view the app

## Workflow
**On the app:**

- Use the Demo learner selector to view:

   - Learner 1: Several in-progress courses, including a quick win and an inactive course.

   - Learner 2: One in-progress course.

   - Learner 3: No in-progress courses. This demos the empty state.

   - Learner 4: User doesn't exist. This demos the error state.

- Use the console to view triggered analytics events:
   - A structured **course_progress_viewed** event is written to the browser console after each successful API response; it includes learner ID, course count, quick_win count, and event timestamp.
   - A structured **quick_win_course_card_clicked** event is written to the browser console after each successful quick-win card click event; it includes learner ID, course count, and event timestamp.
