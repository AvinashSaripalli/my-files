# Employee Management System

This is an Employee Management System (EMS) built using Node.js, Express.js, MySQL, and ReactJS. The system allows users to perform CRUD operations on employee data, with role-based access (Admin, Manager, Employee). The admin and manager can perform CRUD operations on employee data, while employees have access to their personal data.

## Features

- **User Authentication**: Role-based authentication (Admin, Manager, Employee).
- **CRUD Operations**: Admin and Manager can Create, Read, Update, and Delete employee records.
- **Employee Dashboard**: Displays personalized data for employees.
- **Role-based Access**: Different levels of access for Admin, Manager, and Employee.
- **File Upload**: Employee profile photos can be uploaded.
- **Employee Management**: Manage employees by adding new records, editing existing records, and deleting them.
- **Analytics**: Various charts and graphs for analyzing employee data by department, role, etc.

## Tech Stack

- **Frontend**:
  - ReactJS (Material UI, Redux)
  - React Router
- **Backend**:
  - Node.js with Express.js
  - MySQL Database
  - JWT Authentication
  - Multer for file uploads
- **Development Tools**:
  - npm
  - Visual Studio Code

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL
- npm (Node Package Manager)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/AvinashSaripalli/Employee-Management-System.git
   cd Employee-Management-System

