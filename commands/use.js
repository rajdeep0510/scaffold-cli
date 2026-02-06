// @scaffold use component_name command for installing third party components
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import ora from 'ora'
import { execSync } from 'child_process'
import { createClient } from '@supabase/supabase-js'
import AdmZip from 'adm-zip'
import os from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Supabase configuration
// You can either:
// 1. Set these as environment variables (SUPABASE_URL and SUPABASE_KEY)
// 2. Or hardcode them here (not recommended for public repos)
const SUPABASE_URL = 'https://rhhvlbptsyvhejnpbvxh.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaHZsYnB0c3l2aGVqbnBidnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODU0MzQsImV4cCI6MjA4NTQ2MTQzNH0.zO04aAkZTCs6kj8wgPZf1TyPOJAqF1qsw8qlcdpPiwo'
const STORAGE_BUCKET = 'published-components' // default bucket name

// Initialize Supabase client
let supabase = null

function initSupabase() {
    if (!SUPABASE_URL || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        throw new Error('SUPABASE_URL is not set. Please set it in environment variables.')
    }
    if (!SUPABASE_KEY || SUPABASE_KEY === 'YOUR_SUPABASE_ANON_KEY') {
        throw new Error('SUPABASE_KEY is not set. Please set it in environment variables.')
    }
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    return supabase
}

export async function useComponent(name) {
    const spinner = ora('Initializing...').start()

    try {
        // Initialize Supabase
        spinner.text = 'Connecting to Supabase...'
        initSupabase()

        // Detect Next.js structure
        spinner.text = 'Detecting project structure...'
        const useSrc = await fs.pathExists('src')
        const hasApp = await fs.pathExists(path.join(useSrc ? 'src' : '', 'app'))
        const hasPages = await fs.pathExists(path.join(useSrc ? 'src' : '', 'pages'))

        if (!hasApp && !hasPages) {
            spinner.fail(chalk.red('Could not detect Next.js routing structure (no app/ or pages/ directory)'))
            return
        }

        const baseDir = useSrc ? 'src/components/ui' : 'components/ui'
        const targetDir = path.join(baseDir, name)

        // Check if component already exists
        if (await fs.pathExists(targetDir)) {
            spinner.warn(chalk.yellow(`Component '${name}' already exists at ${targetDir}`))
            const answer = await new Promise((resolve) => {
                process.stdout.write(chalk.cyan('Do you want to overwrite it? (y/N): '))
                process.stdin.once('data', (data) => {
                    resolve(data.toString().trim().toLowerCase())
                })
            })

            if (answer !== 'y' && answer !== 'yes') {
                spinner.info(chalk.blue('Operation cancelled'))
                return
            }

            await fs.remove(targetDir)
        }

        // 1. List files in the component folder to find versions
        spinner.text = `Scanning versions for '${name}'...`
        const { data: versionFolders, error: listError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .list(name)

        if (listError || !versionFolders || versionFolders.length === 0) {
            spinner.fail(chalk.red(`Could not find component '${name}' in bucket.`))
            console.error(chalk.red('Error:'), listError?.message || 'Folder is empty')
            return
        }

        // 2. Determine the latest version (assuming folders are named like 1.0.0)
        // Filter out any files, keep only folders (which have null ID in list response usually, or check metadata)
        const versions = versionFolders
            .map(f => f.name)
            .filter(v => v !== '.emptyFolderPlaceholder')
            .sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }))

        if (versions.length === 0) {
            spinner.fail(chalk.red(`No version folders found for '${name}'`))
            return
        }

        const latestVersion = versions[0]
        const filePath = `${name}/${latestVersion}/package.zip`
        const localZipName = `${name}-${latestVersion}.zip`

        // 3. Download the specific package.zip
        spinner.text = `Downloading ${chalk.cyan(name)} v${latestVersion}...`
        const { data, error: downloadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .download(filePath)

        if (downloadError) {
            spinner.fail(chalk.red(`Failed to download '${filePath}'`))
            console.error(chalk.red(`Error details:`), downloadError)
            return
        }

        // Save zip file to temp directory
        spinner.text = `Extracting component '${name}'...`
        const tempDir = path.join(os.tmpdir(), `scaffold-${Date.now()}`)
        await fs.ensureDir(tempDir)
        const zipPath = path.join(tempDir, localZipName)

        // Convert Blob to Buffer and save
        const arrayBuffer = await data.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        await fs.writeFile(zipPath, buffer)

        // Unzip the file
        const zip = new AdmZip(zipPath)
        const extractPath = path.join(tempDir, 'extracted')
        zip.extractAllTo(extractPath, true)

        // Find the component directory by looking for meta.json recursively
        let componentSourceDir = null
        const findMetaJson = async (dir) => {
            const items = await fs.readdir(dir)

            // Check if meta.json is in this directory
            if (items.includes('meta.json')) {
                componentSourceDir = dir
                return
            }

            // Check subdirectories (excluding system folders)
            for (const item of items) {
                const fullPath = path.join(dir, item)
                const stat = await fs.stat(fullPath)
                if (stat.isDirectory() && item !== '__MACOSX' && item !== '__pycache__') {
                    await findMetaJson(fullPath)
                    if (componentSourceDir) return
                }
            }
        }

        await findMetaJson(extractPath)

        // Fallback to extractPath if not found (the validation step later will catch if it's truly missing)
        if (!componentSourceDir) {
            componentSourceDir = extractPath
        }

        // Validate meta.json
        const metaPath = path.join(componentSourceDir, 'meta.json')
        if (!(await fs.pathExists(metaPath))) {
            spinner.fail(chalk.red(`No meta.json found in downloaded component '${name}'`))

            console.log(chalk.yellow('\nContents found in ZIP:'))
            const allFiles = await fs.readdir(extractPath, { recursive: true })
            allFiles.forEach(f => console.log(`  - ${f}`))

            console.log(chalk.cyan('\n💡 Tip: Your package.zip must include a meta.json file at the root.'))
            await fs.remove(tempDir)
            return
        }

        const meta = await fs.readJson(metaPath)
        if (!meta.name || !meta.description || !meta.version) {
            spinner.fail(chalk.red(`Invalid meta.json for '${name}'. Missing required fields.`))
            await fs.remove(tempDir)
            return
        }

        // Copy to target directory
        spinner.text = `Installing component '${name}'...`
        await fs.ensureDir(baseDir)
        await fs.copy(componentSourceDir, targetDir)

        // Install dependencies if specified in meta.json
        if (meta.dependencies && (meta.dependencies.npm?.length > 0 || meta.dependencies.peer?.length > 0)) {
            spinner.text = `Installing dependencies for '${name}'...`

            try {
                if (meta.dependencies.npm?.length > 0) {
                    const npmDeps = meta.dependencies.npm.join(' ')
                    execSync(`npm install ${npmDeps}`, { stdio: 'inherit' })
                    console.log(chalk.green(`✅ Installed npm dependencies: ${npmDeps}`))
                }

                if (meta.dependencies.peer?.length > 0) {
                    const peerDeps = meta.dependencies.peer.join(' ')
                    execSync(`npm install --save-peer ${peerDeps}`, { stdio: 'inherit' })
                    console.log(chalk.green(`✅ Installed peer dependencies: ${peerDeps}`))
                }
            } catch (err) {
                console.log(chalk.yellow(`⚠️  Warning: Failed to install some dependencies. You may need to install them manually.`))
                console.error(err)
            }
        }

        // Clean up temp files
        await fs.remove(tempDir)

        spinner.succeed(chalk.green(`Component '${meta.name}' installed successfully at ${targetDir}`))

        // Display component info
        console.log(chalk.yellow(`\nℹ️  Description:`), chalk.white(meta.description))
        console.log(chalk.magenta(`📦 Version:`), chalk.white(meta.version))
        if (meta.author) {
            console.log(chalk.magenta(`👤 Author:`), chalk.white(meta.author))
        }
        console.log(chalk.cyan(`\n👉 Import in Next.js:`))
        console.log(chalk.blueBright(`   import { ${meta.name} } from "@/components/ui/${name}"\n`))

    } catch (err) {
        spinner.fail(chalk.red(`Failed to use component '${name}'`))
        console.error(chalk.red('\nError details:'), err.message)

        if (err.message.includes('SUPABASE_URL') || err.message.includes('SUPABASE_KEY')) {
            console.log(chalk.yellow('\n💡 Tip: Set your Supabase credentials:'))
            console.log(chalk.cyan('   export SUPABASE_URL="your-supabase-url"'))
            console.log(chalk.cyan('   export SUPABASE_KEY="your-supabase-anon-key"'))
            console.log(chalk.cyan('   export SUPABASE_BUCKET="components" # optional\n'))
        }
    }
}
