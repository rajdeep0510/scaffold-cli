# Supabase Configuration

## Environment Variables

To use the `scaffold use` command, you need to set up your Supabase credentials. You have two options:

### Option 1: Environment Variables (Recommended)

Set these environment variables in your terminal or add them to your `.bashrc`, `.zshrc`, or `.env` file:

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_KEY="your-anon-key-here"
export SUPABASE_BUCKET="components"  # Optional, defaults to 'components'
```

#### For temporary use (current session only):
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_KEY="your-anon-key-here"
```

#### For permanent use:

**For Zsh (macOS default):**
```bash
echo 'export SUPABASE_URL="https://your-project.supabase.co"' >> ~/.zshrc
echo 'export SUPABASE_KEY="your-anon-key-here"' >> ~/.zshrc
source ~/.zshrc
```

**For Bash:**
```bash
echo 'export SUPABASE_URL="https://your-project.supabase.co"' >> ~/.bashrc
echo 'export SUPABASE_KEY="your-anon-key-here"' >> ~/.bashrc
source ~/.bashrc
```

### Option 2: Hardcode in use.js (Not Recommended for Public Repos)

If you prefer to hardcode the values (only do this if the repo is private), edit `/commands/use.js`:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co'
const SUPABASE_KEY = 'your-anon-key-here'
const STORAGE_BUCKET = 'components'
```

## Getting Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** > **API**
4. Copy:
   - **Project URL** → This is your `SUPABASE_URL`
   - **anon public** key → This is your `SUPABASE_KEY`

## Setting Up Storage Bucket

1. In your Supabase project, go to **Storage**
2. Create a new bucket called `components` (or use a different name and set `SUPABASE_BUCKET`)
3. Make the bucket **Public** or configure appropriate policies for read access
4. Upload component ZIP files with the naming convention: `ComponentName.zip`

### Bucket Policies

For public read access, add this policy to your bucket:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'components' );
```

## Component ZIP Structure

Each component ZIP file should contain:
```
ComponentName.zip
├── meta.json          # Required: Component metadata
├── ComponentName.jsx  # Your component file(s)
├── index.js          # Export file
└── ...               # Any other files
```

Example `meta.json`:
```json
{
  "name": "Button",
  "description": "A customizable button component",
  "version": "1.0.0",
  "author": "Your Name",
  "dependencies": {
    "npm": ["framer-motion"],
    "peer": []
  }
}
```

## Usage

Once configured, use the command:

```bash
scaffold use ComponentName
```

This will:
1. Download `ComponentName.zip` from your Supabase storage bucket
2. Extract it to `components/ui/ComponentName` (or `src/components/ui/ComponentName` if using src directory)
3. Install any dependencies listed in `meta.json`
4. Display import instructions
