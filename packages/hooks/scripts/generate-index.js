import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const hooksDir = path.resolve(__dirname, '../src');

async function generateIndex() {
  const hooks = [];
  const entries = await fs.readdir(hooksDir);
  
  for (const entry of entries) {
    const hookPath = path.join(hooksDir, entry);
    const metaPath = path.join(hookPath, 'meta.json');
    
    try {
      await fs.access(metaPath);
      const metaContent = await fs.readFile(metaPath, 'utf8');
      const meta = JSON.parse(metaContent);
      hooks.push(meta);
    } catch (error) {
      // Skip if meta.json doesn't exist
      continue;
    }
  }
  
  await fs.writeFile(
    path.join(hooksDir, 'index.json'), 
    JSON.stringify(hooks, null, 2)
  );
  console.log(`Generated index.json with ${hooks.length} hooks`);
}

generateIndex().catch(console.error);