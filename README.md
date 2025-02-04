# Annual Report Portal for Educational Institutes

A comprehensive web application for managing and generating annual reports for educational institutions.

## Features

- User Authentication and Authorization
- Report Creation and Management
- File Upload Integration with Google Drive
- Analytics Dashboard
- Department-wise Performance Metrics
- Real-time Collaboration
- PDF Generation and Export

## Tech Stack

- **Frontend**: React, Material-UI, Chart.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **File Storage**: Google Drive API
- **Authentication**: JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google Cloud Platform Account (for Drive API)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/annual-report-portal
   JWT_SECRET=your_jwt_secret_key_here
   GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id
   NODE_ENV=development
   ```

4. Create the `uploads` directory:
   ```bash
   mkdir uploads
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_NAME=Annual Report Portal
   ```

## Running the Application

### Start the Backend Server

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the server:
   ```bash
   npm start
   ```

The server will start on http://localhost:5000

### Start the Frontend Application

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The application will open in your default browser at http://localhost:3000

## API Documentation

### Authentication Routes
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Report Routes
- GET `/api/reports` - Get all reports
- POST `/api/reports` - Create a new report
- GET `/api/reports/:id` - Get specific report
- PUT `/api/reports/:id` - Update report
- DELETE `/api/reports/:id` - Delete report
- POST `/api/reports/:id/submit` - Submit report for review
- POST `/api/reports/:id/review` - Review report

### Analytics Routes
- GET `/api/analytics/dashboard` - Get dashboard statistics
- GET `/api/analytics/departments` - Get department metrics
- GET `/api/analytics/user-activity` - Get user activity metrics
- GET `/api/analytics/completion-time` - Get report completion metrics

### Integration Routes
- POST `/api/integration/upload` - Upload file to local storage
- POST `/api/integration/upload-drive` - Upload file to Google Drive
- GET `/api/integration/file/:fileId` - Get file from Google Drive
- DELETE `/api/integration/file/:fileId` - Delete file from Google Drive

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 