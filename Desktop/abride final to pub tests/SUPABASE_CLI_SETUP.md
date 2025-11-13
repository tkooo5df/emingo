# Supabase CLI Setup Guide

## Overview
This guide will help you set up and use the Supabase CLI with your DZ Taxi project. The CLI allows you to develop locally and deploy to the Supabase Platform.

## Prerequisites
1. Node.js installed on your machine
2. Your Supabase project fully provisioned (status should be "Active Healthy")

## Installation

### Install Supabase CLI as a dev dependency
```bash
npm install supabase --save-dev
```

## Project Setup

### 1. Initialize the Supabase project
If you don't have a supabase/config.toml file:
```bash
npx supabase init
```

If you already have a config file, update it to match your project ID:
```toml
project_id = "yhgwamnugcobegewbowe"
```

### 2. Link to your remote Supabase project
```bash
npx supabase link --project-ref yhgwamnugcobegewbowe
```

When prompted, enter your database password. You can find this in your Supabase dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings > Database
4. Copy the password from the "Connection Info" section

### 3. Push your local migrations to the remote database
```bash
npx supabase db push
```

This will apply all the migration files in your `supabase/migrations` directory to your remote Supabase database.

## Common Commands

### Start local development
```bash
npx supabase start
```

### Stop local development
```bash
npx supabase stop
```

### Generate types from your database schema
```bash
npx supabase gen types typescript --project-id yhgwamnugcobegewbowe > src/integrations/supabase/types.ts
```

### Create a new migration
```bash
npx supabase db diff -f migration_name
```

### Reset your local database
```bash
npx supabase db reset
```

## Troubleshooting

### Project Not Active
If you see "Project status is COMING_UP instead of Active Healthy":
1. Wait for your project to finish provisioning in the Supabase dashboard
2. The status should change to "Active Healthy" when ready

### Connection Issues
If you encounter connection issues:
1. Verify your project ID is correct
2. Check that your database password is correct
3. Ensure you have internet connectivity
4. Check that your Supabase project is not paused

### Updating the CLI
To update the Supabase CLI:
```bash
npm update supabase --save-dev
```

If you have any Supabase containers running locally, stop them and delete their data volumes before proceeding with the upgrade:
```bash
npx supabase stop --no-backup
```

## Next Steps

Once your Supabase project is fully provisioned and you've successfully linked it:

1. Push your database schema:
   ```bash
   npx supabase db push
   ```

2. Generate TypeScript types:
   ```bash
   npx supabase gen types typescript --project-id yhgwamnugcobegewbowe > src/integrations/supabase/types.ts
   ```

3. Test your application:
   ```bash
   npm run dev
   ```

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guidelines-and-limitations/cli)
- [Supabase Migration Guide](https://supabase.com/docs/guides/cli/local-development)