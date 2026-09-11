Full Stack Assignment 

Task and Time Tracking App
Users should be able to manage tasks, track time spent using a real-time timer, and view daily productivity summaries.
This assignment evaluates your backend design, API structure, authentication, deployment, and ability to build clean, functional user interfaces.

Core Requirements
1. Authentication
- Users must be able to sign up, log in, and log out securely.
- Users should only see and manage their own tasks and time logs.
- All protected routes and APIs must enforce authorization checks.

2. Task Management
- Users can create tasks using natural language input (e.g., "follow up with designer").
- Optionally use an AI API to auto-generate:
A clearer task title
A more structured description

Example
User input:
"follow up with designer"
AI-generated suggestion:
Title: "Follow up with UI Designer"
Description: "Send a Slack message to confirm wireframe delivery status."
Users must also be able to:
View all tasks
Edit/update task details
Mark task status: Pending, In Progress, Completed
Delete a task

3. Real-Time Time Tracking 
- Each task must support start/stop time tracking:
- Start tracking with a Start button.
- End tracking with a Stop button.
- Store each session as a time log entry.
- Show elapsed time while tracking is active.
- Users must be able to:
View all time logs
View total time spent on each task

4. Daily Summary
- Create a view that displays a summary for the current day, including:
- Tasks worked on
- Total time tracked
- Completed tasks
- Tasks still in progress or pending

5. API & Backend Requirements
- Build a secure and structured backend with:
- REST or GraphQL API
- CRUD operations for tasks and time logs
- Proper user authorization on every endpoint
- Input validation, error handling, and meaningful HTTP responses
- Organized route and controller logic

6. Deployment
- Deploy the application on any platform of your choice.
- Your README.md should include:
:white_check_mark: Live demo link
:white_check_mark: Working auth
:white_check_mark: (Optional) test credentials for easier review

Deliverables
- GitHub repo with:
- All source code (frontend & backend)
- Clean project structure
- Meaningful Git commit history
- README.md containing:
Setup instructions for local development
Tech stack used (brief)
Live deployed link
Screenshots or demo video (optional)
Evaluation Criteria

AREA	EXPECTATIONS
- AUTHENTICATION	Secure auth with protected routes and data isolation
- TASK MANAGEMENT	Functional CRUD with user-specific task control
- TIME TRACKING	Accurate real-time tracking with session control
- BACKEND/API	Clean, secure APIs with validation and proper status codes
- DEPLOYMENT	Fully deployed and functional
- UI/UX	Clean, responsive, and user-friendly design
- CODE QUALITY	Modular, readable code and structured project layout
- BONUS POINTS	productivity charts, weekly summaries, reminders, etc.