# Aura Chat App 🌟

Aura Chat App is a real-time chat application built using the MERN stack. It enables seamless one-on-one and group communication with modern features like real-time messaging, file sharing, and a responsive UI.

---

## 🚀 Live Demo
[Check out the live demo](https://www.loom.com/share/3fb2ba9e71634606bf84602e99f9bdc2?sid=4b0c09b1-f10c-4529-b793-d7bae00bbf48)

---

## 📸 Screenshots

1. Home Screen  
   ![Home Screen Placeholder](https://github.com/Yuvrajdhakrey8/aura-chat-app/blob/main/client/public/screenshots/home-page.png?raw=true)

2. Chat Interface  
   ![Chat Interface Placeholder](https://github.com/Yuvrajdhakrey8/aura-chat-app/blob/main/client/public/screenshots/chat-page.png?raw=true)

---

## ✨ Features

- 🔒 User authentication with JWT
- 💬 One-on-one and group chat
- ⚡ Real-time messaging using Socket.IO
- 📁 File and image sharing
- 🌐 Zustand for global state management
- 📱 Fully responsive UI using ShadCN and Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Zustand (for state management)
- ShadCN
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB (Database)

### Real-time Communication
- Socket.IO

### Authentication
- JSON Web Tokens (JWT)

---

### 🖥️ Instructions to Run Locally

Follow these steps to set up and run the project locally:

#### 1. Clone the Repository
```bash
git clone https://github.com/Yuvrajdhakrey8/aura-chat-app.git
cd aura-chat-app
```

#### 2. Backend Setup
1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Rename the `.env.sample` file to `.env`:
   ```bash
   mv .env.sample .env
   ```
4. Open the `.env` file and add the required credentials:
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secret key for JWT authentication.

5. Start the backend server:
   ```bash
   npm start
   ```
   The backend will now run on `http://localhost:8000` by default.

#### 3. Frontend Setup
1. Open a new terminal and navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm start
   ```
   The frontend will now run on `http://localhost:5173`.

#### 4. Access the Application
- Frontend: Open `http://localhost:5173` in your browser.
- Backend: Ensure the backend is running at `http://localhost:8000`.

#### 5. Development Workflow
- Keep the backend and frontend servers running in separate terminals.
- Any changes made to the code will automatically refresh the respective servers for a smoother development experience.