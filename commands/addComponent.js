import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import figlet from 'figlet'
import ora from 'ora'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url)) // ESM-safe __dirname


// banner TODO: remove
console.log(
  chalk.cyan(
    figlet.text('scaffold', { font: 'doom' }, function (err, data) {
      if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
      }
      console.log(data);
    })

  )
)

export async function addComponent(name) {
  const useSrc = await fs.pathExists('src')
  const hasApp = await fs.pathExists(path.join(useSrc ? 'src' : '', 'app'))
  const hasPages = await fs.pathExists(path.join(useSrc ? 'src' : '', 'pages'))

  if (!hasApp && !hasPages) {
    console.log(chalk.red('Could not detect Next.js routing structure (no app/ or pages/ directory)'))
    return
  }

  const baseDir = useSrc ? 'src/components/ui' : 'components/ui'
  const targetDir = path.join(baseDir, name)
  const templateDir = path.resolve(__dirname, '../templates', name)

  // 🔎 check if template folder exists
  if (!(await fs.pathExists(templateDir))) {
    console.log(chalk.red(`Template folder '${templateDir}' not found.`))
    return
  }

  // 🔎 validate meta.json before copying
  const metaPath = path.join(templateDir, 'meta.json')
  if (!(await fs.pathExists(metaPath))) {
    console.log(chalk.red(`No meta.json found in template '${name}'`))
    return
  }

  const meta = await fs.readJson(metaPath)
  if (!meta.name || !meta.description || !meta.version) {
    console.log(chalk.red(`Invalid meta.json for '${name}'. Missing required fields.`))
    return
  }

  // 🌀 Spinner while copying
  const spinner = ora(`Adding component '${name}'...`).start()

  try {
    await fs.ensureDir(targetDir)
    await fs.copy(templateDir, targetDir)

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

    spinner.succeed(chalk.green(`Component '${meta.name}' created at ${targetDir}`))

    console.log(chalk.yellow(`ℹ️  Description:`), chalk.white(meta.description))
    console.log(chalk.magenta(`📦 Version:`), chalk.white(meta.version))
    console.log(chalk.magenta(`Author :`), chalk.white(meta.author))
    console.log(chalk.cyan(`\n👉 Import in Next.js:`))
    console.log(chalk.blueBright(`   import { ${meta.name} } from "@/components/ui/${name}"\n`))
  } catch (err) {
    spinner.fail(chalk.red(`Failed to add component '${name}'`))
    console.error(err)
  }
}

// change made TODO:remove