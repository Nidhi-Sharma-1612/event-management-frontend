# Event Management Frontend

## 🚀 Overview

The Event Management Frontend is a web application that allows users to create, manage, and join events in real time. It provides different experiences for authenticated users and guests, ensuring a smooth and interactive event management system.

## 🛠 Tech Stack

- **Frontend:** React.js, Vite, Material UI, Tailwind CSS
- **State Management:** React Hooks
- **API Handling:** Axios
- **WebSockets:** Socket.io-client
- **Backend Integration:** Node.js, Express.js (connected via REST API)
- **Authentication:** JWT-based authentication

## 🎯 Features

- **Event Creation & Management:** Authenticated users can create, edit, and delete events.
- **Event Filtering:** Filter events based on categories and date.
- **Live Event Updates:** Real-time updates on event attendees using WebSockets.
- **Guest User Support:** Guests can view and join events but cannot create or modify them.
- **Join & Leave Events:** Guests can join and leave events dynamically.
- **Session Management:** If a guest leaves an event and closes the browser, they are automatically removed from the event.
- **Optimized UI:** Responsive and accessible user experience.

## 🌐 Deployed Link

🔗 [Live Demo](https://event-management-frontend-mu.vercel.app/)

## 🏗 Project Workflow

### 1️⃣ User Workflow

1. **Guest User:**

   - Can view all events.
   - Can join an event, which updates the attendee count in real time.
   - If they close the browser tab, they are automatically removed from the event.

2. **Authenticated User:**
   - Can create, edit, and delete events.
   - Can only see events created by them.
   - Cannot join events but can manage attendee counts.

### 2️⃣ Frontend Workflow

1. **User Authentication:**

   - JWT token is stored in local storage after login.
   - If the user is a guest, their role is stored separately.

2. **Fetching Events:**

   - If the user is authenticated, only their created events are fetched.
   - If the user is a guest, all events are fetched.

3. **Event Management:**

   - Authenticated users can create, update, or delete their events.
   - Guests can join and leave events, updating attendee count dynamically.

4. **WebSocket Integration:**
   - Attendee counts update in real time.
   - When a guest leaves an event, WebSockets notify other users.

## 🏃‍♂️ Getting Started

### Prerequisites

- **Node.js** installed
- **Vite** for fast development

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/event-management-frontend.git
   cd event-management-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create an `.env` file and set the API base URL:**

   ```bash
   VITE_BASE_URL=http://localhost:5000/api
   ```

4. **Start the application:**

   ```bash
   npm run dev
   ```

5. **Access the app in the browser:**
   - Open [http://localhost:5173](http://localhost:5173)

```

```
