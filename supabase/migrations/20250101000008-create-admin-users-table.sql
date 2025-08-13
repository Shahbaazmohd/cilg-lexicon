-- Drop existing table if it exists to avoid conflicts
DROP TABLE IF EXISTS admin_users CASCADE;

-- Drop existing functions and triggers if they exist
DROP FUNCTION IF EXISTS handle_new_admin_user();
DROP FUNCTION IF EXISTS update_admin_last_sign_in();

-- Create admin_users table with proper references and constraints
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'moderator')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sign_in TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id),
    UNIQUE(email)
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (simplified to avoid circular dependencies)
CREATE POLICY "Users can view own admin record" ON admin_users
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all admin users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Create function to handle new admin user creation
CREATE OR REPLACE FUNCTION handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the new user's email matches admin or moderator patterns
    IF NEW.email IN ('admin@cilg.com', 'moderator@cilg.com') THEN
        -- Insert into admin_users table
        INSERT INTO admin_users (user_id, email, role)
        VALUES (
            NEW.id,
            NEW.email,
            CASE 
                WHEN NEW.email = 'admin@cilg.com' THEN 'admin'
                WHEN NEW.email = 'moderator@cilg.com' THEN 'moderator'
            END
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_admin_user();

-- Create function to update last sign in
CREATE OR REPLACE FUNCTION update_admin_last_sign_in()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE admin_users 
    SET last_sign_in = NOW()
    WHERE user_id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for sign in updates
DROP TRIGGER IF EXISTS update_admin_last_sign_in_trigger ON auth.users;
CREATE TRIGGER update_admin_last_sign_in_trigger
    AFTER UPDATE OF last_sign_in_at ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_last_sign_in();

-- Create indexes for better performance
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);

-- Grant necessary permissions (no sequence needed for UUID primary key)
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_users TO authenticated;
