# Supabase Setup Instructions

## Overview
This guide will help you set up your Supabase database to work with the DZ Taxi application. We've already updated the application to use your Supabase credentials, but you need to apply the database schema manually.

## Your Supabase Project Details
- **Project URL**: https://yhgwamnugcobegewbowe.supabase.co
- **Project ID**: yhgwamnugcobegewbowe
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZ3dhbW51Z2NvYmVnZXdib3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNDgwMDcsImV4cCI6MjA3NDYyNDAwN30.QbpKZ7wcwCCbc9zWt9t88r-czuUMSk3YaFDan9EJmYQ
- **Service Role Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZ3dhbW51Z2NvYmVnZXdib3dlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA0ODAwNywiZXhwIjoyMDc0NjI0MDA3fQ.rCH0__AID9ysfNnd3mjHPZlnUMehQnK9BY4-9l2gYKE

## Steps to Set Up Your Database

### 1. Access Your Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. Select your project with ID: `yhgwamnugcobegewbowe`

### 2. Apply the Database Schema
1. In the left sidebar, click on "SQL Editor"
2. Click "New Query"
3. Copy and paste the contents of the file `supabase/migrations/20260206000000_supabase_full_reset.sql` into the editor
4. Click "Run" to execute the query

This will create all the necessary tables and set up the proper security policies.

### 3. Set Up Authentication
The application expects certain authentication settings. Make sure your Supabase project has:
1. Email authentication enabled
2. The proper JWT settings (these should be automatically configured)

### 4. Verify the Setup
After applying the schema, you can verify the tables were created:
1. In the Supabase dashboard, go to "Table Editor"
2. You should see the following tables:
   - profiles
   - bookings
   - trips
   - vehicles
   - notifications
   - system_settings
   - admin_logs
   - _signup_errors

### 5. Test the Application
1. Make sure your `.env` file contains:
   ```
   VITE_SUPABASE_URL=https://yhgwamnugcobegewbowe.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZ3dhbW51Z2NvYmVnZXdib3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNDgwMDcsImV4cCI6MjA3NDYyNDAwN30.QbpKZ7wcwCCbc9zWt9t88r-czuUMSk3YaFDan9EJmYQ
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Visit http://localhost:5173 and test the application

## Troubleshooting

### If you encounter connection issues:
1. Make sure your Supabase project is fully provisioned (status should be "Active Healthy")
2. Check that your credentials in the `.env` file are correct
3. Ensure you have internet connectivity

### If data doesn't appear to sync:
1. Clear your browser's local storage
2. Refresh the page
3. Make sure you're logged in to the application

### If you get authentication errors:
1. Verify that email authentication is enabled in your Supabase project
2. Check that the JWT settings match your project configuration

## Additional Notes

The application is configured to use Supabase as the only database option. The local SQLite database has been completely removed to prevent data conflicts.

If you need to reset your database, you can re-run the SQL script from the SQL Editor in your Supabase dashboard.