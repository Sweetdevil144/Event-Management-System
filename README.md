# Event Management System

Welcome to the **Event Management System**! This application is designed to facilitate the management of events, users, and analytics, providing a seamless experience for organizers and attendees alike.

## Overview

```bash
Event-Management-System/
├── .env                        # Environment variables (database URL, JWT secret, etc.)
├── .gitignore                  # Files/directories to ignore in Git
├── package.json                # NPM metadata and dependencies
├── package-lock.json           # Locked versions of dependencies
├── README.md                   # Project setup and usage instructions
├── docs/
│   ├── openapi.yaml            # Swagger/OpenAPI specification (optional)
│   └── PostmanCollection.json  # Postman collection for API testing (optional)
├── src/
│   ├── app.js                  # Express app configuration
│   ├── server.js               # Application entry point (start the server)
│   ├── config/
│   │   ├── db.js               # Database connection setup
│   │   └── index.js            # Other global configs (CORS, environment setups, etc.)
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── analytics.controller.js
│   │   ├── auth.controller.js
│   │   ├── event.controller.js
│   │   ├── notification.controller.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js  # JWT verification, role-based checks
│   │   └── error.middleware.js # Centralized error handling
│   ├── models/
│   │   ├── user.model.js
│   │   ├── event.model.js
│   │   ├── registration.model.js
│   │   └── index.js            # File to import and export all models
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── analytics.routes.js
│   │   ├── auth.routes.js
│   │   ├── event.routes.js
│   │   ├── notification.routes.js
│   │   ├── user.routes.js
│   │   └── index.js            # Central router to combine all route modules
│   ├── services/
│   │   ├── admin.service.js
│   │   ├── analytics.service.js
│   │   ├── auth.service.js
│   │   ├── event.service.js
│   │   ├── notification.service.js
│   │   └── user.service.js
│   ├── utils/
│   │   ├── constants.js        # Any constants used throughout the app
│   │   ├── email.js            # Functions to handle email sending
│   │   └── logger.js           # Central logging functionality
│   └── tests/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       └── setup.js            # Global test setup (e.g., test DB config)
└── ...
```
