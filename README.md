# Solar Administration Portal

A full-stack web application for managing solar panel installations, customer bookings, billing, and worker management. Built with React (frontend) and Django REST Framework (backend).

## Features

- Customer dashboard for booking installations and viewing usage/billing
- Admin dashboard for managing customers, workers, and installations
- Worker interface for managing assignments and updates
- Real-time analytics and reporting
- Secure authentication system

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Django 4.2, Django REST Framework
- **Database**: SQLite (development)
- **Authentication**: JWT tokens

## Prerequisites

- **Python 3.8+** (comes pre-installed on macOS)
- **Node.js 16+** and npm (install from [nodejs.org](https://nodejs.org) or use Homebrew: `brew install node`)
- **Git** (for cloning the repository)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SolarAdministration
```

### 2. Backend Setup (Django)

#### Install Python Dependencies

```bash
pip3 install django djangorestframework django-cors-headers Pillow
```

#### Run Database Migrations

```bash
cd backend
python3 manage.py migrate
```

#### Start the Backend Server

```bash
python3 manage.py runserver
```

The backend API will be available at `http://127.0.0.1:8000`

### 3. Frontend Setup (React)

#### Install Node Dependencies

```bash
# Return to project root
cd ..
npm install
```

#### Start the Frontend Development Server

```bash
npm run dev
```

The frontend application will be available at `http://localhost:5174`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5174`

Both servers must be running simultaneously for the application to work properly.

## Available Scripts

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Scripts

- `python3 manage.py runserver` - Start Django development server
- `python3 manage.py migrate` - Apply database migrations
- `python3 manage.py createsuperuser` - Create admin user

## Project Structure

```
SolarAdministration/
├── backend/                 # Django backend
│   ├── api/                # Main API app
│   ├── solar_api/          # Django project settings
│   ├── db.sqlite3          # SQLite database
│   └── manage.py           # Django management script
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API service functions
│   └── store/             # State management
├── public/                 # Static assets
└── package.json           # Frontend dependencies
```

## API Endpoints

The backend provides REST API endpoints for:

- `/api/auth/` - Authentication (login/register)
- `/api/customers/` - Customer management
- `/api/workers/` - Worker management
- `/api/installations/` - Installation tracking
- `/api/billing/` - Billing and payments

## Development Notes

- The application uses SQLite for development. For production, consider PostgreSQL.
- CORS is configured to allow requests from the frontend development server.
- Authentication uses JWT tokens stored in localStorage.

## Troubleshooting

### Common Issues

1. **Permission denied on npm scripts**
   ```bash
   chmod +x node_modules/.bin/vite
   ```

2. **Python command not found**
   - Use `python3` instead of `python`
   - Ensure Python 3.8+ is installed

3. **Port conflicts**
   - Backend runs on port 8000 by default
   - Frontend runs on port 5174 by default
   - Change ports if needed: `python3 manage.py runserver 8001`

4. **Module not found errors**
   - Ensure all dependencies are installed
   - Try removing `node_modules` and `package-lock.json`, then run `npm install`

### Getting Help

If you encounter issues:

1. Check that both servers are running
2. Verify all dependencies are installed
3. Check browser console for frontend errors
4. Check Django console for backend errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
