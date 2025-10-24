# B2B Organization Management System

A full-stack web application for managing B2B organizations and their users. Built with React, Node.js, Express, and MySQL.

## 🚀 Features

- **Dashboard** with real-time statistics (total organizations, users, active/inactive counts)
- **Organizations Management**: Create, read, update, delete organizations with logo upload
- **Users Management**: Add, edit, delete users with role assignment and serial numbers
- **Search & Filter**: Find organizations by name/email and filter by status
- **Responsive UI**: Built with Tailwind CSS and SweetAlert2 notifications

## 🛠️ Tech Stack
### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - API calls
- **SweetAlert2** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Sequelize** - ORM
- **MySQL** - Database
- **Multer** - File uploads
- **CORS** - Cross-origin support

## 📁 Project Structure
<pre>
project-root/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   └── Organizations.js
│   │   │   └── user.js
│   │   ├── controllers/
│   │   │   └── organizationController.js
│   │   │   └── userController.js
│   │   ├── routes/
│   │   │   └── OrganizationRoutes.js
│   │   │   └── userRoutes.js
│   │   └── middleware/
│   │   │   └── upload.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── App.jsx
│   │   └── App.css
│   │   └── main.jsx
│   │   └── index.css
│   └── package.json
│
├── .gitignore
└── README.md
</pre>

## 🔌 API Endpoints

### Organizations
- `GET /api/organizations` - Get all organizations
- `GET /api/organizations/:id` - Get single organization
- `POST /api/organizations` - Create organization
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization
- `POST /api/organizations/:id/logo` - Upload logo

### Users
- `GET /api/users/organization/:id` - Get users by organization
- `GET /api/users/count` - Get total user count
- `GET /api/users/count/organization` - Get user count per organization
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user



