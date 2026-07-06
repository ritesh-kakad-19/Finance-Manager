# Finance Management System

A full-stack personal finance management web application designed to help you track your income, expenses, and manage your budget effectively.

## 🌟 Features
- **User Authentication:** Secure user login, registration, and profile management.
- **Transaction Management:** Add, edit, delete, and categorize your income and expenses.
- **Interactive Dashboard:** Visual analytics using charts for expense trends, income vs. expenses, and category-wise analysis.
- **Budget Planning:** Set limits and get alerts for overspending.
- **Data Management:** Search, filter, and export (CSV/PDF) features for better financial tracking.

## 💻 Tech Stack
This application is built using the **MERN** stack:
- **Frontend:** React 19 (via Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB

## 📦 Libraries & Packages Used
### Frontend (React/Vite)
- `react-router-dom`: For application routing and navigation.
- `axios`: For making HTTP requests to the backend API.
- `bootstrap` & `react-bootstrap`: For responsive design and UI components.
- `react-icons`: For scalable SVG icons.
- `recharts`: For rendering interactive charts on the dashboard.

### Backend (Node/Express)
- `mongoose`: Object Data Modeling (ODM) library for MongoDB.
- `express`: Web framework for handling API routes.
- `dotenv`: For loading environment variables securely.
- `express-async-handler`: Simplifies error handling for async Express routes.

## 🔒 Security Technologies
- **JSON Web Tokens (JWT) (`jsonwebtoken`):** Used for stateless, secure user authentication and protecting API endpoints.
- **Password Hashing (`bcrypt` / `bcryptjs`):** Ensures that user passwords are securely salted and hashed before storing them in the database.
- **CORS (`cors`):** Middleware enabled on the backend to securely restrict and manage cross-origin requests from the frontend.

## 🚀 How to Run the Application
Follow these steps to run the project locally on your machine.

### 1. Setup Environment
1. Clone the repository to your local machine.
2. Open your terminal.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add necessary variables:
   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret-key>
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Open a new terminal instance and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder and add your environment variables:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
*(The browser should automatically open the landing page. If not, visit `http://localhost:5173`)*

## 🎨 Additional Information
- The frontend features a custom-designed dark "glassmorphism" aesthetic tailored for a premium user experience.
- The web app is fully responsive and optimized for both desktop and mobile views.
