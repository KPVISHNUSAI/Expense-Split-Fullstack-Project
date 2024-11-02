# Create root project directory
New-Item -ItemType Directory -Path "expense-split-app"
Set-Location -Path "expense-split-app"

# Frontend structure
New-Item -ItemType Directory -Path "frontend"
Set-Location -Path "frontend"

# Frontend subdirectories
@(
    "public", "public/assets",
    "src", "src/components",
    "src/components/layout", "src/components/auth", "src/components/dashboard",
    "src/components/expenses", "src/components/groups", "src/components/settlements",
    "src/redux", "src/redux/slices", "src/redux/actions",
    "src/services", "src/utils", "src/styles", "src/styles/components"
) | ForEach-Object {
    New-Item -ItemType Directory -Path $_
}

# Create frontend files
@(
    "src/App.jsx",
    "src/index.jsx",
    "src/routes.js",
    "public/index.html",
    ".env",
    "README.md"
) | ForEach-Object {
    New-Item -ItemType File -Path $_
}

# Create component files
@(
    "src/components/layout/Header.jsx",
    "src/components/layout/Sidebar.jsx",
    "src/components/layout/Footer.jsx",
    "src/components/auth/Login.jsx",
    "src/components/auth/Register.jsx",
    "src/components/auth/ProtectedRoute.jsx",
    "src/components/dashboard/Dashboard.jsx",
    "src/components/dashboard/BalanceCard.jsx",
    "src/components/dashboard/ActivityFeed.jsx",
    "src/components/expenses/ExpenseList.jsx",
    "src/components/expenses/ExpenseForm.jsx",
    "src/components/expenses/ExpenseCard.jsx",
    "src/components/groups/GroupList.jsx",
    "src/components/groups/GroupForm.jsx",
    "src/components/groups/GroupDetail.jsx",
    "src/components/settlements/SettlementList.jsx",
    "src/components/settlements/SettlementForm.jsx"
) | ForEach-Object {
    New-Item -ItemType File -Path $_
}

# Create Redux files
@(
    "src/redux/store.js",
    "src/redux/slices/authSlice.js",
    "src/redux/slices/expenseSlice.js",
    "src/redux/slices/groupSlice.js",
    "src/redux/slices/settlementSlice.js",
    "src/redux/actions/authActions.js",
    "src/redux/actions/expenseActions.js",
    "src/redux/actions/groupActions.js",
    "src/redux/actions/settlementActions.js"
) | ForEach-Object {
    New-Item -ItemType File -Path $_
}

# Create service and util files
@(
    "src/services/api.js",
    "src/services/authService.js",
    "src/services/expenseService.js",
    "src/services/groupService.js",
    "src/utils/constants.js",
    "src/utils/helpers.js",
    "src/utils/validation.js",
    "src/styles/global.css"
) | ForEach-Object {
    New-Item -ItemType File -Path $_
}

# Return to root and create backend structure
Set-Location ..
New-Item -ItemType Directory -Path "backend"
Set-Location -Path "backend"

# Backend subdirectories
@(
    "cmd/server",
    "internal/api/handlers",
    "internal/api/middleware",
    "internal/api/routes",
    "internal/config",
    "internal/db/migrations",
    "internal/models",
    "internal/repositories",
    "internal/services",
    "pkg/logger",
    "pkg/validator",
    "pkg/utils"
) | ForEach-Object {
    New-Item -ItemType Directory -Path $_
}

# Create backend files
@(
    "cmd/server/main.go",
    "internal/api/handlers/auth.go",
    "internal/api/handlers/expense.go",
    "internal/api/handlers/group.go",
    "internal/api/handlers/settlement.go",
    "internal/api/handlers/user.go",
    "internal/api/middleware/auth.go",
    "internal/api/middleware/cors.go",
    "internal/api/middleware/logger.go",
    "internal/api/routes/routes.go",
    "internal/config/config.go",
    "internal/db/migrations/000001_init_schema.up.sql",
    "internal/db/migrations/000001_init_schema.down.sql",
    "internal/db/postgres.go",
    "internal/models/user.go",
    "internal/models/expense.go",
    "internal/models/group.go",
    "internal/models/settlement.go",
    "internal/repositories/user_repository.go",
    "internal/repositories/expense_repository.go",
    "internal/repositories/group_repository.go",
    "internal/repositories/settlement_repository.go",
    "internal/services/auth_service.go",
    "internal/services/expense_service.go",
    "internal/services/group_service.go",
    "internal/services/settlement_service.go",
    "pkg/logger/logger.go",
    "pkg/validator/validator.go",
    "pkg/utils/jwt.go",
    "pkg/utils/password.go",
    ".env",
    "go.mod",
    "Dockerfile",
    "README.md"
) | ForEach-Object {
    New-Item -ItemType File -Path $_
}

# Return to root and create Docker directory
Set-Location ..
New-Item -ItemType Directory -Path "docker"
@(
    "docker/docker-compose.yml",
    "docker/Dockerfile.frontend",
    "docker/Dockerfile.backend",
    "README.md"
) | ForEach-Object {
    New-Item -ItemType File -Path $_
}