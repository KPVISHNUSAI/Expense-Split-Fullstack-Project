# Expense Split Application Backend

A robust REST API backend for managing group expenses and settlements, built with Go, Gin framework, and PostgreSQL.

## 📋 Table of Contents
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Setup & Installation](#-setup--installation)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Development](#-development)

## 🛠 Tech Stack
- **Language:** Go 1.20+
- **Framework:** Gin Web Framework
- **Database:** PostgreSQL
- **ORM:** GORM
- **Authentication:** JWT
- **Documentation:** Swagger (Optional)

## 📁 Project Structure
```
expense-split-app/
├── cmd/
│   └── server/
│       └── main.go            # Application entry point
├── internal/
│   ├── api/
│   │   ├── handlers/         # HTTP request handlers
│   │   ├── middleware/       # Custom middleware
│   │   └── routes/          # Route definitions
│   ├── config/              # Configuration management
│   ├── db/                  # Database setup and migrations
│   ├── models/              # Data models
│   ├── repositories/        # Database operations
│   └── services/           # Business logic
├── pkg/
│   ├── logger/             # Logging utilities
│   ├── utils/              # Shared utilities
│   └── validator/          # Input validation
├── .env.example           # Environment variables template
├── go.mod                 # Go module definition
├── go.sum                 # Go module checksums
└── README.md             # This file
```

## ✨ Features
- User Authentication (Register/Login)
- Group Management
- Expense Tracking
- Expense Splitting
- Settlement Management
- Balance Calculations
- Recurring Settlements

## 🔧 Prerequisites
- Go 1.20 or higher
- PostgreSQL 12 or higher
- Make (optional, for using Makefile)
- Git

## 🚀 Setup & Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd expense-split-app
```

### 2. Environment Setup
Copy the example environment file and update it with your configurations:
```bash
cp .env.example .env
```

Example `.env` configuration:
```env
SERVER_PORT=9000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=expense_split
JWT_SECRET=your-secret-key
ENVIRONMENT=development
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb expense_split

# Run migrations
go run cmd/migration/main.go up
```

### 4. Install Dependencies
```bash
go mod download
```

### 5. Run the Application
```bash
go run cmd/server/main.go
```

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/v1/auth/register    # Register new user
POST   /api/v1/auth/login       # User login
```

### User Endpoints
```
GET    /api/v1/users/me         # Get current user profile
PUT    /api/v1/users/me         # Update user profile
GET    /api/v1/users            # List all users
```

### Group Endpoints
```
POST   /api/v1/groups           # Create new group
GET    /api/v1/groups           # List user's groups
GET    /api/v1/groups/:id       # Get group details
PUT    /api/v1/groups/:id       # Update group
DELETE /api/v1/groups/:id       # Delete group
POST   /api/v1/groups/:id/users # Add user to group
DELETE /api/v1/groups/:id/users/:userId # Remove user from group
```

### Expense Endpoints
```
POST   /api/v1/expenses         # Create new expense
GET    /api/v1/expenses/:id     # Get expense details
PUT    /api/v1/expenses/:id     # Update expense
DELETE /api/v1/expenses/:id     # Delete expense
GET    /api/v1/groups/:id/expenses # Get group expenses
```

### Settlement Endpoints
```
POST   /api/v1/settlements      # Create settlement
GET    /api/v1/settlements/:id  # Get settlement details
PUT    /api/v1/settlements/:id/status # Update settlement status
GET    /api/v1/settlements/pending    # Get pending settlements
GET    /api/v1/groups/:id/settlements # Get group settlements
```

## 💾 Database Schema

### Key Tables
- `users`: User accounts and profiles
- `groups`: Expense groups
- `user_groups`: Group membership (junction table)
- `expenses`: Individual expenses
- `splits`: Expense splits between users
- `settlements`: Payment settlements

## 🔨 Development

### Running Tests
```bash
go test ./...
```

### Code Formatting
```bash
go fmt ./...
```

### Linting
```bash
golangci-lint run
```

### Building for Production
```bash
go build -o app cmd/server/main.go
```

## 🔒 Security
- JWT-based authentication
- Password hashing using bcrypt
- Input validation
- CORS protection
- Rate limiting (optional)

## 🔄 Common Development Tasks

### Adding a New Migration
```bash
# Create new migration files
migrate create -ext sql -dir internal/db/migrations -seq new_migration_name
```

### Updating Dependencies
```bash
go mod tidy
```

### Environment Variables
Required environment variables:
- `SERVER_PORT`: HTTP server port
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret key for JWT signing
- `ENVIRONMENT`: Application environment (development/production)

## 📝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details

## 🤝 Support
For support, email [kpvishnusai1111@gmail.com]