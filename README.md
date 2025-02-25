# Task Management Application

## Short Description

This is a task management application built using **React.js**, **Node.js**, **Express.js**, **MongoDB**, and **Tailwind CSS**. Users can manage their tasks across multiple projects, with features like drag-and-drop task categorization, task CRUD operations, and project management.

## Live Link

[View the live application](https://task-management-one-phi.vercel.app/)

## Technologies Used

- **Frontend:**

  - React.js
  - React Router
  - Tailwind CSS
  - DaisyUI
  - React Icons
  - Axios
  - Drag and Drop Context from `@hello-pangea/dnd`

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Cors
  - Axios for HTTP requests

## Dependencies

- **Frontend:**

  - `@hello-pangea/dnd` for drag-and-drop functionality
  - `axios` for HTTP requests
  - `react-icons` for icons
  - `react-router-dom` for routing
  - `tailwindcss` and `daisyui` for styling

- **Backend:**
  - `express` for building the server
  - `mongodb` and `mongodb+srv` for connecting to MongoDB database
  - `cors` to allow cross-origin requests

## Installation Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/task-management-app.git
   cd task-management-app
   ```

Frontend Setup:

Navigate to the frontend folder and install dependencies:
cd frontend
npm install

Backend Setup:

Navigate to the backend folder and install dependencies:

cd backend
npm install

Features
Task Management:

Users can add, edit, and delete tasks within their selected project.
Drag and drop tasks between categories (To-Do, In Progress, Done).
Auto-saving of task updates with real-time changes.
Project Management:

Users can create new projects.
Projects are linked to the user’s email and tasks are associated with each project.
Authentication:

User authentication and session management are implemented using Firebase.

API Endpoints
GET /projects: Fetch all projects of a user.
GET /tasks/:project: Fetch tasks for a specific project.
POST /projects: Add a new project.
POST /tasks: Add a new task.
PUT /tasks/:id: Update task details.
DELETE /tasks/:id: Delete a task.

Future Enhancements
User authentication can be expanded to support JWT for security.
Task filtering and sorting improvements can be implemented.
User-specific notifications and reminders for tasks.
License

This project is licensed under the MIT License - see the LICENSE file for details.
