import fs from 'fs'
import path from 'path' 
import { execSync } from 'child_process'

export function buildAllProjects(options = {}) {
  const {
    root = process.cwd(),
    outputPath = path.join(root, 'dist'),
    skipDirs = ['node_modules', 'dist', '.git', '.pnpm']
  } = options

  fs.mkdirSync(outputPath, { recursive: true })

  const entries = fs.readdirSync(root, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory() || skipDirs.includes(entry.name)) continue

    const projectPath = path.join(root, entry.name)
    const packageJsonPath = path.join(projectPath, 'package.json')

    if (fs.existsSync(packageJsonPath)) {
      try {
        console.log(`🚀 Building: ${entry.name}`)
        execSync('pnpm run build', { 
          cwd: projectPath,
          stdio: 'inherit'
        })
        console.log(`✅ Built: ${entry.name}`)
      } catch (error) {
        console.error(`❌ Failed to build ${entry.name}:`, error.message)
        continue 
      }
    }
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || skipDirs.includes(entry.name)) continue

    const projectPath = path.join(root, entry.name)
    const distPath = path.join(projectPath, 'dist')

    if (fs.existsSync(distPath)) {
      const target = path.join(outputPath, entry.name, 'dist')
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.cpSync(distPath, target, { recursive: true })
      console.log(`📦 Collected: ${entry.name}`)
    }
  }

  console.log('🎉 All builds and collections completed!')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildAllProjects()
}