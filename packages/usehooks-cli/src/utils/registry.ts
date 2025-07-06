import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface HookMeta {
  name: string
  description: string
  category?: string
  dependencies?: string[]
  devDependencies?: string[]
  files: {
    name: string
    type: 'hook' | 'example' | 'test'
  }[]
  examples?: {
    name: string
    description: string
  }[]
}

export interface Hook extends HookMeta {
  files: {
    name: string
    content: string
    type: 'hook' | 'example' | 'test'
  }[]
}

// Path to the hooks package
const HOOKS_PACKAGE_PATH = path.resolve(__dirname, '../../../hooks/src')

export async function getHook(name: string): Promise<Hook | null> {
  try {
    const hookDir = path.join(HOOKS_PACKAGE_PATH, name)
    const metaPath = path.join(hookDir, 'meta.json')
    
    // Check if hook directory and meta file exist
    const [hookDirExists, metaExists] = await Promise.all([
      fs.pathExists(hookDir),
      fs.pathExists(metaPath)
    ])
    
    if (!hookDirExists || !metaExists) {
      return null
    }
    
    // Read metadata
    const meta: HookMeta = await fs.readJSON(metaPath)
    
    // Read hook files
    const files = await Promise.all(
      meta.files.map(async (fileInfo) => {
        const filePath = path.join(hookDir, fileInfo.name)
        const content = await fs.readFile(filePath, 'utf-8')
        return {
          name: fileInfo.name,
          content,
          type: fileInfo.type
        }
      })
    )
    
    return {
      ...meta,
      files
    }
  } catch (error) {
    console.error(`Error loading hook ${name}:`, error)
    return null
  }
}

export async function getAllHooks(): Promise<HookMeta[]> {
  try {
    const hookDirs = await fs.readdir(HOOKS_PACKAGE_PATH)
    const hooks: HookMeta[] = []
    
    for (const dir of hookDirs) {
      const hookDir = path.join(HOOKS_PACKAGE_PATH, dir)
      const metaPath = path.join(hookDir, 'meta.json')
      
      const [isDirectory, metaExists] = await Promise.all([
        fs.stat(hookDir).then(stat => stat.isDirectory()).catch(() => false),
        fs.pathExists(metaPath)
      ])
      
      if (isDirectory && metaExists) {
        const meta: HookMeta = await fs.readJSON(metaPath)
        hooks.push(meta)
      }
    }
    
    return hooks.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error loading hooks:', error)
    return []
  }
}

export async function getHooksByCategory(): Promise<Record<string, HookMeta[]>> {
  const hooks = await getAllHooks()
  const categories: Record<string, HookMeta[]> = {}
  
  hooks.forEach(hook => {
    const category = hook.category || 'misc'
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push(hook)
  })
  
  return categories
}
