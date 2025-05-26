const fs = require('fs');
const path = require('path');

// Path mapping: from each directory level to the correct relative path to types/common
const correctPaths = {
  // models/user/__tests__/ -> ../../../types/common
  'models/user/__tests__/': '../../../types/common',
  
  // models/chat/conversation/create-new-conversation/__tests__/ -> ../../../../../../types/common
  'models/chat/conversation/create-new-conversation/__tests__/': '../../../../../../types/common',
  
  // models/chat/message/user-message/add-message/__tests__/ -> ../../../../../../../types/common
  'models/chat/message/user-message/add-message/__tests__/': '../../../../../../../types/common',
  
  // routes/__tests__/e2e/dev/ -> ../../../../types/common
  'routes/__tests__/e2e/dev/': '../../../../types/common',
  
  // routes/__tests__/e2e/prod/ -> ../../../../types/common
  'routes/__tests__/e2e/prod/': '../../../../types/common',
  
  // routes/assessment/__tests__/e2e/dev/ -> ../../../../../types/common
  'routes/assessment/__tests__/e2e/dev/': '../../../../../types/common',
  
  // routes/user/__tests__/e2e/dev/ -> ../../../../../types/common
  'routes/user/__tests__/e2e/dev/': '../../../../../types/common',
  
  // routes/user/__tests__/unit/ -> ../../../../types/common
  'routes/user/__tests__/unit/': '../../../../types/common',
  
  // routes/setup/__tests__/unit/success/ -> ../../../../../../types/common
  'routes/setup/__tests__/unit/success/': '../../../../../../types/common',
  
  // For all other __tests__ directories in routes/
  'routes/': {
    '__tests__/e2e/dev/success/': '../../../../../types/common',
    '__tests__/e2e/dev/error/': '../../../../../types/common', 
    '__tests__/e2e/dev/': '../../../../../types/common',
    '__tests__/unit/success/': '../../../../../../types/common',
    '__tests__/unit/error/': '../../../../../../types/common',
    '__tests__/unit/': '../../../../../types/common',
    '__tests__/': '../../../../types/common'
  }
};

// File extensions to process
const extensions = ['.ts', '.test.ts', '.spec.ts'];

// Incorrect import patterns to fix
const incorrectPatterns = [
  /from\s+['"`]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/types\/common['"`]/g,
  /from\s+['"`]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/types\/common['"`]/g,
  /from\s+['"`]\.\.\/\.\.\/\.\.\/\.\.\/types\/common['"`]/g,
  /from\s+['"`]\.\.\/\.\.\/\.\.\/types\/common['"`]/g,
  /from\s+['"`]\.\.\/\.\.\/types\/common['"`]/g,
  /from\s+['"`]\.\.\/types\/common['"`]/g
];

function getCorrectPath(filePath) {
  // Normalize the file path
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  // Check exact matches first
  for (const [dirPattern, correctPath] of Object.entries(correctPaths)) {
    if (typeof correctPath === 'string') {
      if (normalizedPath.includes(dirPattern)) {
        return correctPath;
      }
    } else {
      // Handle nested patterns for routes/
      if (normalizedPath.startsWith(dirPattern)) {
        for (const [subPattern, subCorrectPath] of Object.entries(correctPath)) {
          if (normalizedPath.includes(dirPattern + subPattern)) {
            return subCorrectPath;
          }
        }
      }
    }
  }
  
  // Calculate relative path based on directory depth
  const depth = normalizedPath.split('/').length - 1;
  
  if (normalizedPath.includes('__tests__')) {
    // Most test files are 3-7 levels deep
    if (depth >= 7) return '../../../../../../../types/common';
    if (depth >= 6) return '../../../../../../types/common';
    if (depth >= 5) return '../../../../../types/common';
    if (depth >= 4) return '../../../../types/common';
    if (depth >= 3) return '../../../types/common';
    return '../../types/common';
  }
  
  // Default fallback
  return '../../../types/common';
}

function fixTypeImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has type imports that need fixing
    const hasIncorrectImport = incorrectPatterns.some(pattern => pattern.test(content));
    
    if (!hasIncorrectImport) {
      return false; // No changes needed
    }
    
    const correctPath = getCorrectPath(filePath);
    let newContent = content;
    
    // Replace all incorrect import patterns with correct path
    incorrectPatterns.forEach(pattern => {
      newContent = newContent.replace(pattern, `from '${correctPath}'`);
    });
    
    // Only write if content actually changed
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed: ${filePath} -> ${correctPath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findAndFixFiles(dir, basePath = '') {
  let fixedCount = 0;
  
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const relativePath = path.join(basePath, item.name);
      
      if (item.isDirectory()) {
        // Skip node_modules and other irrelevant directories
        if (['node_modules', '.git', 'dist', 'build'].includes(item.name)) {
          continue;
        }
        fixedCount += findAndFixFiles(fullPath, relativePath);
      } else if (item.isFile()) {
        // Process TypeScript files
        if (extensions.some(ext => item.name.endsWith(ext))) {
          if (fixTypeImports(fullPath)) {
            fixedCount++;
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return fixedCount;
}

// Start the fix process
console.log('🔧 Starting type import path fixes...\n');

const startTime = Date.now();
const fixedCount = findAndFixFiles('./');
const endTime = Date.now();

console.log(`\n✅ Type import fix completed!`);
console.log(`📊 Fixed ${fixedCount} files in ${endTime - startTime}ms`);
console.log(`🧪 Run 'npx tsc --noEmit' to verify fixes\n`); 