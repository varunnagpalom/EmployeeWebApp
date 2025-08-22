# Employee Management Web Application

![React](https://img.shields.io/badge/React-19.1.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.2-purple)
![React Router](https://img.shields.io/badge/React%20Router-7.8.1-red)
![Vitest](https://img.shields.io/badge/Vitest-3.2.4-green)
![Status](https://img.shields.io/badge/Status-Complete-success)

> A modern React-based employee management dashboard with full CRUD operations and comprehensive testing. This project was developed 100% with AI assistance.

## 📑 Overview

This web application provides a complete employee management system with an intuitive dashboard interface. It features a responsive design with full employee lifecycle management capabilities and connects to a backend API for data persistence.

The application follows modern React patterns with:

- **Component-Based Architecture**: Modular and reusable components
- **Client-Side Routing**: Seamless navigation with React Router
- **State Management**: Local state with React hooks
- **API Integration**: RESTful API communication
- **Comprehensive Testing**: Unit tests with React Testing Library

## 🚀 Features

### Core Functionality
- **Employee Dashboard**: View all employees in a structured table format
- **Create Employee**: Add new employees with form validation
- **Edit Employee**: Update existing employee information
- **Delete Employee**: Remove employees with confirmation
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### User Experience
- **Loading States**: Visual feedback during API operations
- **Error Handling**: Meaningful error messages and recovery options
- **Success Notifications**: Confirmation modals for successful operations
- **Form Validation**: Client-side validation with helpful error messages
- **Professional UI**: Clean, modern interface with intuitive navigation

## 🔧 Tech Stack

### Frontend Framework
- **React 19.1.1**: Modern React with latest features
- **Vite 7.1.2**: Fast build tool and development server
- **React Router DOM 7.8.1**: Client-side routing
- **CSS3**: Custom styling with responsive design

### Testing Infrastructure
- **Vitest 3.2.4**: Fast unit testing framework
- **React Testing Library 16.3.0**: Component testing utilities
- **Jest-DOM 6.8.0**: Custom DOM matchers
- **User Event 14.6.1**: User interaction simulation
- **JSdom 26.1.0**: Browser environment simulation

### Development Tools
- **ESLint**: Code linting and formatting
- **Proxy Configuration**: API routing for development

## 📋 Application Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Dashboard` | Main employee listing with CRUD operations |
| `/create-employee` | `CreateEmployee` | Form to add new employees |
| `/edit-employee` | `EditEmployee` | Form to update existing employees |

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # Main employee dashboard
│   ├── CreateEmployee.jsx     # Employee creation form
│   └── EditEmployee.jsx       # Employee editing form
├── __tests__/
│   ├── Dashboard.test.jsx     # Dashboard component tests
│   ├── CreateEmployee.test.jsx # Create form tests
│   ├── EditEmployee.test.jsx  # Edit form tests
│   └── App.test.jsx          # Integration tests
├── test/
│   ├── setup.js              # Test configuration
│   └── utils.jsx             # Test utilities and mocks
├── assets/                   # Static assets
├── App.jsx                   # Main application component
├── App.css                   # Application styles
├── main.jsx                  # Application entry point
└── index.css                 # Global styles
```

## ⚙️ Implementation Journey

### Phase 1: Foundation Setup
1. **Project Initialization**: Set up Vite + React project structure
2. **Routing Configuration**: Implemented React Router for navigation
3. **API Integration**: Connected to backend employee API with proxy configuration

### Phase 2: Core Features
4. **Dashboard Development**: Created employee table with data fetching
5. **CRUD Operations**: Implemented Create, Read, Update, Delete functionality
6. **Form Validation**: Added client-side validation for all forms
7. **Error Handling**: Comprehensive error states and user feedback

### Phase 3: User Experience
8. **Loading States**: Added loading indicators for better UX
9. **Success Modals**: Confirmation dialogs for successful operations
10. **Responsive Design**: Mobile-friendly responsive layout
11. **Professional Styling**: Clean, modern UI design

### Phase 4: Quality Assurance
12. **Test Infrastructure**: Set up Vitest, RTL, and Jest-DOM
13. **Component Tests**: Unit tests for all components with 60+ test cases
14. **Integration Tests**: End-to-end workflow testing
15. **Mock Strategy**: Comprehensive API mocking for reliable tests

## 🧪 Testing Strategy

The project includes comprehensive testing coverage with multiple test categories:

### Component Testing
- **Dashboard Tests**: 16 test cases covering data loading, CRUD operations, and error states
- **CreateEmployee Tests**: 16 test cases for form interactions, validation, and submission
- **EditEmployee Tests**: 20 test cases for form pre-population, updates, and workflows
- **App Integration Tests**: 9 test cases for routing and end-to-end workflows

### Test Categories
- **Rendering Tests**: Component mounting and initial state
- **User Interaction Tests**: Form filling, button clicks, navigation
- **API Integration Tests**: Mock API calls and response handling
- **Error Scenario Tests**: Network failures and validation errors
- **Workflow Tests**: Complete user journeys from start to finish

### Commands
```bash
# Run all tests
npm run test:run

# Run tests in watch mode
npm run test

# Generate coverage report
npm run coverage
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Backend API running on localhost:8080

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EmployeeWebApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm run test:run
   ```

### API Configuration

The application expects a backend API running on `localhost:8080` with the following endpoints:

- `GET /api/employees` - Retrieve all employees
- `POST /api/employees` - Create new employee
- `PATCH /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

## 📊 Employee Data Model

```javascript
{
  "employeeId": 1,
  "name": "John Doe",
  "dateOfJoining": "2025-08-18",
  "department": "IT",
  "salary": 80000,
  "managerId": 1,
  "status": "ACTIVE" // or "NOT_ACTIVE"
}
```

## 🎯 Key Achievements

- ✅ **Complete CRUD Operations**: Full employee lifecycle management
- ✅ **Professional UI/UX**: Clean, intuitive user interface
- ✅ **Comprehensive Testing**: 61 test cases with excellent coverage
- ✅ **Error Handling**: Robust error states and user feedback
- ✅ **Responsive Design**: Mobile-friendly responsive layout
- ✅ **Modern React Patterns**: Hooks, functional components, and best practices
- ✅ **API Integration**: Seamless backend communication with proper error handling
- ✅ **Form Validation**: Client-side validation with helpful error messages

## 🔧 Development Highlights

- **Modern React 19**: Leveraging latest React features and patterns
- **Testing Excellence**: Professional-grade testing with RTL and Vitest
- **Clean Architecture**: Well-organized component structure
- **Developer Experience**: Fast builds with Vite and comprehensive tooling
- **Production Ready**: Proper error handling, loading states, and user feedback

---

*This project demonstrates modern web development practices with React, comprehensive testing strategies, and professional UI/UX design principles.*
