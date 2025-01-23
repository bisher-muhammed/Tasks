# Task Management

Task Management is a full-stack web application built with **Python Django** and **ReactJS**. It features task management functionality with real-time updates and a modern frontend interface.

## Features

### Backend
- Developed using **Django Rest Framework (DRF)**.
- JWT authentication for secure user authentication.
- Real-time task updates using **Django Channels**.
- RESTful API architecture for seamless communication between frontend and backend.

### Frontend
- Built with **ReactJS**.
- **State management** handled using **Redux**.
- Efficient API calls managed with **Redux Thunk**.
- **Centralized API setup** for easy integration and scalability.
- **Recharts** used for displaying task statistics and visualizations.
- Real-time WebSocket connection using:

  ```javascript
  import ReconnectingWebSocket from "reconnecting-websocket";
  ```

## Getting Started

### Prerequisites

1. **Backend**:
   - Python 3.x
   - Django
   - Django Rest Framework
   - Django Channels

2. **Frontend**:
   - Node.js
   - React
   - Redux
   - Recharts

### Installation

#### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/bisher-muhammed/Tasks.git
   cd Tasks
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Start the development server:
   ```bash
   python manage.py runserver
   ```

#### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

## Usage

1. Create, update, and delete tasks through the user-friendly interface.
2. View real-time task updates powered by WebSocket integration.
3. Analyze task statistics and trends using interactive charts.

## Technologies Used

### Backend:
- Django Rest Framework
- Django Channels
- JWT Authentication

### Frontend:
- ReactJS
- Redux
- Redux Thunk
- Recharts
- ReconnectingWebSocket

## Screenshots
*(Include screenshots of your application here)*

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

For more details, visit the [GitHub Repository](https://github.com/bisher-muhammed/Tasks.git).

