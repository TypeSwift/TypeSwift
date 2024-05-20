import fs from 'fs';
import path from 'path';

export function readConfig(configPath: string) {
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

export function ensureOutputDirExists(outputDir: string) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

export function writeSwiftCodeToFile(swiftCode: string, outputDir: string, outputFileName: string, outputSuffix: string) {
  const resolvedOutputDir = path.isAbsolute(outputDir) ? outputDir : path.join(__dirname, outputDir);
  ensureOutputDirExists(resolvedOutputDir);

  const outputFilePath = path.join(resolvedOutputDir, `${outputFileName}${outputSuffix}`);
  fs.writeFileSync(outputFilePath, swiftCode);
  console.log(`Swift code generated successfully at ${outputFilePath}`);
}

export function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.ts')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}
