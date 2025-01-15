# Event Management System

Welcome to the **Event Management System**! This application provides a robust backend API designed to manage users, events, registrations, and analytics, delivering a seamless experience for organizers, attendees, and administrators.

## 🌟 Features

### **User Management**

- **Registration**: Create a new user account.
- **Authentication**: Secure login with JWT-based token authentication.
- **User Profiles**: View and update user details (e.g., name, email).
- **Role Management**: Role-based access control for `user`, `organizer`, and `admin`.

### **Event Management**

- **Create Events**: Organizers can create events with details like name, date, location, and capacity.
- **Update/Delete Events**: Manage event details (restricted to organizers).
- **View Events**: Retrieve all events or detailed information for a specific event.

### **Registration Management**

- **Register for Events**: Users can register for available events.
- **Cancel Registrations**: Users can cancel their event registrations.
- **Attendee Lists**: Organizers can view lists of attendees for their events.

### **Admin Features**

- **Manage Users**: Admins can view and delete users (soft delete).
- **Event Analytics**: View events with registration statistics.

### **Analytics**

- **Popular Events**: View the top 5 most registered events.
- **Active Users**: Identify the most active users based on registrations.
- **Event Stats**: Detailed analytics for specific events, including attendee count.

### **Notifications**

- **Send Notifications**: Organizers can notify attendees of event updates via email or webhooks.

---

## 🚀 Technologies Used

- **Backend Framework**: [Express.js](https://expressjs.com/) (Node.js)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose ODM
- **Authentication**: [JWT](https://jwt.io/) for secure token-based auth
- **Email**: [Nodemailer](https://nodemailer.com/) for email notifications
- **Testing**: [Jest](https://jestjs.io/) and [SuperTest](https://github.com/visionmedia/supertest)
- **Documentation**: [Swagger/OpenAPI](https://swagger.io/)

---

## 📂 File Structure

```bash
Event-Management-System/
├── .env                        # Environment variables (DB URI, JWT secret, etc.)
├── .gitignore                  # Files to exclude from version control
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Locked versions of dependencies
├── README.md                   # Project setup and usage instructions
├── docs/
│   ├── openapi.yaml            # OpenAPI documentation (Swagger spec)
│   └── PostmanCollection.json  # Postman collection for testing APIs
├── src/
│   ├── app.js                  # Express app setup
│   ├── server.js               # Application entry point
│   ├── config/                 # Configuration files
│   │   ├── db.js               # MongoDB connection
│   │   └── index.js            # Global app configurations
│   ├── controllers/            # Route controllers
│   │   ├── admin.controller.js # Admin-related tasks
│   │   ├── analytics.controller.js # Analytics endpoints
│   │   ├── auth.controller.js  # Authentication endpoints
│   │   ├── event.controller.js # Event-related endpoints
│   │   ├── notification.controller.js # Notifications
│   │   └── user.controller.js  # User-related endpoints
│   ├── middlewares/            # Middleware
│   │   ├── auth.middleware.js  # JWT verification, role-based checks
│   │   └── error.middleware.js # Error handling
│   ├── models/                 # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── event.model.js
│   │   ├── registration.model.js
│   │   └── index.js            # Centralized model export
│   ├── routes/                 # API route handlers
│   │   ├── admin.routes.js
│   │   ├── analytics.routes.js
│   │   ├── auth.routes.js
│   │   ├── event.routes.js
│   │   ├── notification.routes.js
│   │   ├── user.routes.js
│   │   └── index.js            # Central router
│   ├── services/               # Business logic
│   │   ├── admin.service.js
│   │   ├── analytics.service.js
│   │   ├── auth.service.js
│   │   ├── event.service.js
│   │   ├── notification.service.js
│   │   └── user.service.js
│   ├── utils/                  # Helper utilities
│   │   ├── constants.js        # App constants
│   │   ├── email.js            # Email sending logic
│   │   └── logger.js           # Logging setup
│   └── tests/                  # Unit and integration tests
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       └── setup.js            # Global test setup
│   ├── tests/                  # Test for my currnet services : Currently in development
```

---

## ⚙️ Setup and Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-repo/event-management-system.git
   cd event-management-system
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file with the following variables:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-management
   JWT_SECRET=simplejwt
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASS=yourpassword
   PORT=4000
   ```

4. **Start the Server**:

   ```bash
   npm start
   ```

5. **Run Tests**:

   ```bash
   npm test
   ```

6. **API Documentation**:
   - Import `docs/PostmanCollection.json` into Postman.
   - Use `docs/openapi.yaml` for Swagger UI.

---

## 🔥 Key Features Demonstrated

1. **Role-based Access Control**:

   - Secure access based on `admin`, `organizer`, or `user` roles.

2. **Event Analytics**:

   - Real-time stats on popular events and active users.

3. **Secure Authentication**:

   - Password hashing with `bcrypt`.
   - JWT-based session management.

4. **Scalability**:
   - MongoDB aggregation for event stats.
   - Modular and clean code structure for easy expansion.

---

## 📖 API Examples

### **Register a User**

- **Endpoint**: `POST /api/auth/register`
- **Body**:

  ```json
  {
    "name": "Alice Organizer",
    "email": "alice@example.com",
    "password": "123456"
  }
  ```

### **Create an Event**

- **Endpoint**: `POST /api/events`
- **Headers**:

  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```

- **Body**:

  ```json
  {
    "name": "Tech Conference 2025",
    "description": "Latest in tech",
    "date": "2025-06-20T09:00:00.000Z",
    "location": "Virtual",
    "capacity": 200
  }
  ```

### **Get Event Stats**

- **Endpoint**: `GET /api/analytics/events/popular`
- **Headers**:

  ```json
  {
    "Authorization": "Bearer <admin-token>"
  }
  ```

---

## 🛠️ Future Enhancements

- **Redis Caching** for analytics endpoints.
- **Search and Filtering** for events.
- **WebSockets** for real-time attendee updates.

---

## 🙌 Contributing

Feel free to fork the repository, submit issues, or create pull requests. Contributions are always welcome!
