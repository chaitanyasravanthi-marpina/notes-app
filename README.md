# 📝 NotesApp — Full Stack MERN Notes Application

A production-grade notes application built with the MERN stack featuring
JWT authentication, real-time UI updates, dark mode, and a complete note
management system.

🔗 **Live Demo:** https://notesappap.netlify.app

---

## 📸 Features

### Authentication
- JWT-based secure authentication
- Password hashing with bcryptjs
- Protected routes on both frontend and backend
- Persistent login with localStorage

### Notes Management
- Create, edit, and delete notes
- Pin important notes to the top
- Archive notes for later reference
- Trash system with restore and permanent delete
- Color coding with 8 color options
- Tags and categories

### UI/UX
- Dark mode with system preference persistence
- Toast notifications for all actions
- Responsive grid layout
- Search and filter notes in real time
- Optimistic UI updates — no page refresh needed
- Edit modal with pre-filled form data

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| CORS | Cross-origin requests |

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI library |
| Vite | Build tool |
| React Router | Client-side routing |
| Axios | HTTP requests |
| Context API | Global state management |

### Deployment
| Service | Purpose |
|---|---|
| Render | Backend hosting |
| Netlify | Frontend hosting |
| MongoDB Atlas | Cloud database |

---

## 🏗️ Architecture
Frontend (React + Vite)
↓ HTTP requests with JWT
Backend (Node + Express)
↓ Mongoose queries
Database (MongoDB Atlas)

### Folder Structure

notes-app/
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth + error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── server.js       # Entry point
│
└── frontend/
└── src/
├── api/        # Axios API calls
├── components/ # Reusable UI components
├── context/    # Auth, Theme, Toast context
├── pages/      # Full page components
└── App.jsx     # Routing

---

## 🔐 API Endpoints

### Auth Routes
POST /api/auth/register   Register new user
POST /api/auth/login      Login user

### Notes Routes
GET    /api/notes              Get all notes
POST   /api/notes              Create note
GET    /api/notes/:id          Get single note
PUT    /api/notes/:id          Update note
DELETE /api/notes/:id          Move to trash
PUT    /api/notes/:id/pin      Toggle pin
PUT    /api/notes/:id/archive  Toggle archive
GET    /api/notes/trash        Get trashed notes
PUT    /api/notes/:id/restore  Restore from trash
DELETE /api/notes/:id/permanent Permanently delete
GET    /api/notes/archived     Get archived notes

---

## 🚀 Run Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### Clone the repo
```bash
git clone https://github.com/chaitanyasravanthi-marpina/notes-app.git
cd notes-app
```

### Setup Backend
```bash
cd backend
npm install
```

Create `backend/.env`:

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

```bash
npm run dev
```

### Setup Frontend
```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
VITE_API_URL=http://localhost:5000/api
```bash
npm run dev
```

### Open in browser

Frontend: http://localhost:5173
Backend:  http://localhost:5000

---

## 💡 Key Learnings

- Designed and implemented REST API with MVC architecture
- Built JWT authentication flow from scratch
- Implemented soft delete pattern for trash system
- Used MongoDB indexes for optimized search queries
- Managed complex frontend state with React Context API
- Applied optimistic UI updates for instant user feedback
- Deployed full stack app with separate frontend and backend services

---

## 👨‍💻 Author

**Marpina Chaitanya Sravanthi**
- GitHub: [@chaitanyasravanthi-marpina](https://github.com/chaitanyasravanthi-marpina)

---

## 📄 License

MIT License — feel free to use this project for learning or inspiration.