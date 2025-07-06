import fs from 'fs-extra';
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
    
    if (await fs.pathExists(metaPath)) {
      const meta = await fs.readJSON(metaPath);
      hooks.push(meta);
    }
  }
  
  await fs.writeJSON(path.join(hooksDir, 'index.json'), hooks, { spaces: 2 });
  console.log(`Generated index.json with ${hooks.length} hooks`);
}

generateIndex().catch(console.error);