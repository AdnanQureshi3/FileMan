# FileMan - Made File Sharing Easy  
FileMan is a modern and secure **file-sharing platform** designed for seamless uploads, sharing, and management.  
Built with the **PERN stack**, it ensures high performance, secure data handling, and a smooth user experience.  
The platform supports **user authentication**, **payment integration**, and **cloud-based file management**, making file sharing effortless and reliable for both individuals and teams.

## Table of Contents

- [✨ Features](#-features)
- [🧠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Setup Instructions](#️-setup-instructions)
- [🏗️ Architecture](#️-architecture)
- [🧩 Technical Decisions](#-technical-decisions)
- [🐞 Known Issues](#-known-issues)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
 

## ✨ Features

- **Dashboard**: Overview of uploaded files, users, and sharing stats.  
- **Secure Uploads**: Supports file encryption before upload.  
- **File Sharing Links**: Generate shareable links with expiry timers.  
- **Authentication**: JWT-based secure login/signup.  
- **Access Control**: Manage visibility (public/private) of shared files.  
- **Download Tracking**: Logs who downloaded and when.  
- **Responsive UI**: Fully optimized for mobile and desktop.  
- **Dark/Light Theme**: Toggle with persisted user preference.  
- **Notifications**: Toast alerts for success, errors, and info.  
- **Search**: Quickly find files by name or type.

## 🧠 Tech Stack

- **Frontend**: React.js (18+), TypeScript  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Payments**: Razorpay (Checkout + Webhook Integration)
- **Styling**: Tailwind CSS, Shadcn/UI  
- **Routing**: React Router (6+)  
- **Icons**: Lucide React  
- **Charts**: Recharts (for analytics dashboard)  
- **State Management**: React Context API  
- **Linting/Formatting**: ESLint, Prettier


## 📁 Project Structure

```/FILEMAN 📂
├── client/ (Frontend: React/Vite Application)
│   ├── dist/                 # Production build output
│   ├── node_modules/         # Frontend dependencies
│   ├── public/               # Static assets (e.g., index.html)
│   ├── src/
│   │   ├── assets/           # Images, fonts, and other static resources
│   │   ├── components/       # Core reusable UI components
│   │   ├── config/           # Frontend specific configurations
│   │   ├── Hooks/            # Custom React hooks for logic reuse
│   │   ├── Redux/            # Global state management files (actions, slices, store)
│   │   ├── Ui/               # Primitive/atomic UI components
│   │   ├── App.jsx           # Main application component
│   │   └── main.jsx          # Application entry point
│   ├── .env                  # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js        # Vite build configuration
|
├── node_modules/             # Top-level dependencies (if shared or global)
├── prisma/                   # Prisma ORM schema and configuration
|
└── ServerSide/ (Backend: Node.js/Express Application)
    ├── src/
    │   ├── config/           # External service configuration (Razorpay, S3)
    │   │   ├── razorpay.js
    │   │   └── s3.js
    │   ├── Controllers/      # Application business logic functions
    │   │   ├── email_controller.js
    │   │   ├── file_controllers.js
    │   │   └── user_controller.js
    │   ├── DB/               # Database connection setup
    │   │   └── prisma.js
    │   ├── Middlewares/      # Request processing (Authentication, file handling)
    │   │   ├── Auth.js
    │   │   └── Multer.js
    │   ├── Routes/           # Express route definitions
    │   │   ├── fileRouter.js
    │   │   ├── new.js
    │   │   ├── razorpay.js
    │   │   └── userRouter.js
    │   ├── Validation/       # Data validation logic
    │   │   └── UserValidation.js
    │   ├── app.js            # Express app configuration
    │   └── index.js          # Server entry point (starts the Express server)
    ├── .env
    ├── .gitignore
    └── package.json
```

## ⚙️ Setup Instructions

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher

### Installation

1. **Clone the Repository**
  ```bash
  git clone <repository-url>
  cd FileMan
  ```

2. **Install Dependencies**
  ```bash
  npm install
  ```

3. **Set Up Environment**
  - Create a `.env` file in the root:
    ```
    VITE_API_URL=http://localhost:5173
    ```

4. **Initialize MSW**
  ```bash
  npx msw init public/ --save
  ```

5. **Run the Development Server**
  ```bash
  npm run dev
  ```
  Open [http://localhost:5173](http://localhost:5173) in your browser.

6. **Build for Production**
  ```bash
  npm run build
  npm run preview
  ```

### 🧠 Scripts

- `npm run dev`: Start the backend server in development mode using **nodemon**.  
- `npm run start`: Start the backend server in production mode.  
- `npm run build`: Install dependencies and build the frontend client.  
- `npm run postinstall`: Automatically run Prisma generate after dependencies install.  
- `npm test`: Placeholder test command (currently not configured).


## 🏗️ Architecture

### 🖥️ Frontend

- **React.js**: Component-based architecture with JavaScript.  
- **React Router**: Client-side routing (`/`, `/login`, `/register`, `/f/file_shortId`, `/resetpassword`).  
- **ThemeProvider**: Custom React Context for theme, toggling Tailwind’s `dark` mode and persisting in `localStorage`.  
- **Tailwind CSS**: Utility-first styling for responsive, modern UI.
- **Razorpay Checkout Integration**: Handles payment UI for file premium features or storage plans using Razorpay’s JavaScript SDK.

---

### 🗄️ Backend

- **Node.js + Express.js**: RESTful API for authentication, uploads, and file metadata.  
- **PostgreSQL**: Stores user details, file metadata, and logs.  
- **Prisma ORM**: Simplifies database interaction with type-safe queries.  
- **JWT Authentication**: Secures routes and user access tokens.  
- **Multer + AWS S3**: Handles local and cloud-based file uploads.
- **Razorpay Payment Verification**: Securely validates transactions via Razorpay webhook or signature verification before unlocking premium access.


---

### environmental Variables

```
PORT=3000
CLIENT_URL=https://frontend-url.vercel.app
JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_aws_bucket_name

EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password

DATABASE_URL=your_postgres_connection_url

```

---

### ⚙️ Data Layer

- **Database Layer**: Managed with Prisma; handles users, files, and permissions.  
- **API Layer**: RESTful endpoints for upload, download, and delete actions.  
- **Analytics**: Local and server-side computation for file statistics.  

---

### 🧩 Key Components

- **Navbar**: Responsive with links to Upload, Files, and Profile.  
- **Dashboard**: Displays analytics and storage insights.  
- **Uploader**: Drag-and-drop upload component integrated with backend API.  
- **Auth Pages**: Login, Register, and Forgot Password using JWT flow.  
- **FileList**: Lists files with filters, sorting, and download/delete options.  

---

## 🧠 Technical Decisions

- **PERN Stack**: Combines PostgreSQL, Express, React, and Node for full-stack performance.  
- **Prisma ORM**: Type-safe database management and migrations.  
- **Tailwind CSS**: Fast, consistent, and responsive styling.  
- **JWT Auth**: Secure user sessions with access and refresh tokens.  
- **Cloud Upload Support**: Ready for AWS S3 or Cloudinary integration.  
- **Vite**: Ultra-fast frontend bundler for React.  

---

## 🪲 Known Issues

- **File Upload Size Limit**:  
  Large files may need cloud storage integration.  
  Configure limits in `multer` or server `.env`.

- **Email Sending Issue**:  
  You may not receive emails due to blocking of the SMTP server on Render.

- **CORS Configuration**:  
  If frontend and backend run separately, update allowed origins in Express middleware.  

- **Database Migration Conflicts**:  
  Run `npx prisma migrate reset` if schema changes cause errors.  


---

## 🤝 Contributing

1. Fork the repository.  
2. Create a feature branch:  
   ```bash
   git checkout -b feature/xyz


## Contributing

1. Fork the repository.
2. Create a feature branch:
  ```bash
  git checkout -b feature/xyz
  ```
3. Commit your changes:
  ```bash
  git commit -m "Add feature xyz"
  ```
4. Push to your branch:
  ```bash
  git push origin feature/xyz
  ```
5. Open a pull request.

## 📜 License
© 2025 Adnan Qureshi.  
All rights reserved.  
