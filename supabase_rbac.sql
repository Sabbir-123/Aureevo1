-- Add 'role' and 'permissions' to admin_users table
ALTER TABLE public.admin_users
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'admin',
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;

-- Convert existing 'admin' users to true 'root' admins so they have full access
UPDATE public.admin_users
SET role = 'root'
WHERE role = 'admin';

-- Make sure the root user has an empty permissions array (root has access to everything)
UPDATE public.admin_users
SET permissions = '[]'::jsonb
WHERE role = 'root';
