# Setup Guide

## Prerequisites
- Node.js (version 16 or higher)
- npm package manager

## Installation Steps

1. **Install server dependencies:**
   ```bash
   npm install
   ```

2. **Install client dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Create environment file:**
   ```bash
   cp env.example .env
   ```

4. **Start the application:**
   ```bash
   npm run dev
   ```

## What This Does

- **Backend**: Starts Express server on port 5000
- **Frontend**: Starts React app on port 3000
- **Database**: SQLite database is created automatically with sample data

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Test Login

- **Email**: test@brandmetrics.com
- **Password**: agent123

## Troubleshooting

If you get errors:
1. Make sure Node.js version is 16+
2. Try deleting `node_modules` and running `npm install` again
3. Check that ports 3000 and 5000 are available
