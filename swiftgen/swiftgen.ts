// swiftgen.ts
import { Project } from "ts-morph";
import fs from 'fs';
import path from 'path';
import { convertType } from './typeMap';

console.log("Starting SwiftGen...");

// Read configuration file
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log("Configuration loaded:", config);

function initializeProject(filePath: string) {
  const project = new Project();
  return project.addSourceFileAtPath(filePath);
}

function extractVariables(sourceFile: any) {
  return sourceFile.getVariableStatements()
    .flatMap((statement: any) => statement.getDeclarations().map((decl: any) => decl.getName()));
}

function extractFunctions(sourceFile: any) {
  return sourceFile.getFunctions().map((func: any) => ({
    name: func.getName(),
    parameters: func.getParameters().map((param: any) => ({
      name: param.getName(),
      type: convertType(param.getType().getText()),
      default: param.hasInitializer() ? param.getInitializer()?.getText() : undefined
    })),
    typeParameters: func.getTypeParameters().map((param: any) => param.getName())
  }));
}

function extractEnums(sourceFile: any) {
  return sourceFile.getEnums().map((enumDecl: any) => ({
    name: enumDecl.getName(),
    members: enumDecl.getMembers().map((member: any) => member.getName())
  }));
}

function extractTypeAliases(sourceFile: any) {
  return sourceFile.getTypeAliases().map((alias: any) => ({
    name: alias.getName(),
    properties: alias.getTypeNode().getType().getProperties().map((prop: any) => ({
      name: prop.getName(),
      type: convertType(prop.getTypeAtLocation(prop.getDeclarations()[0]).getText())
    }))
  }));
}

function generateSwiftCode(variables: string[], functions: any[], enums: any[], typeAliases: any[]) {
  let swiftCode = `enum TypeSwift {\n`;

  if (variables.length > 0) {
    swiftCode += `\n  // Variables\n`;
    variables.forEach(variable => {
      swiftCode += `  case ${variable}\n`;
    });
  }

  if (functions.length > 0) {
    swiftCode += `\n  // Functions\n`;
    functions.forEach(func => {
      const params = func.parameters.map((param: any) => {
        const type = param.type === 'Optional' ? `${param.type}<${convertType('string')}>` : param.type;
        const defaultValue = param.default ? ` = ${param.default}` : '';
        return `_${param.name}: ${type}${defaultValue}`;
      }).join(', ');
      const typeParams = func.typeParameters.length > 0 ? `<${func.typeParameters.join(', ')}>` : '';
      swiftCode += `  case ${func.name}${typeParams}(${params.replace(/_/g, '_ ')})\n`;
    });
  }

  if (enums.length > 0) {
    swiftCode += `\n  // Enums\n`;
    enums.forEach(enumDecl => {
      swiftCode += `  enum ${enumDecl.name} {\n`;
      enumDecl.members.forEach((member: any) => {
        swiftCode += `    case ${member}\n`;
      });
      swiftCode += `  }\n`;
    });
  }

  if (typeAliases.length > 0) {
    swiftCode += `\n  // Type Aliases\n`;
    typeAliases.forEach(alias => {
      swiftCode += `  struct ${alias.name} {\n`;
      alias.properties.forEach((prop: any) => {
        swiftCode += `    var ${prop.name}: ${prop.type}\n`;
      });
      swiftCode += `  }\n`;
    });
  }

  swiftCode += `}\n`;
  return swiftCode;
}

function writeSwiftCodeToFile(filePath: string, swiftCode: string) {
  const outputDir = path.join(__dirname, config.outputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const fileName = `${config.outputPrefix}${path.basename(filePath, '.ts')}${config.outputSuffix}`;
  const outputFilePath = path.join(outputDir, fileName);
  fs.writeFileSync(outputFilePath, swiftCode);
  console.log(`Swift code generated successfully for ${filePath} at ${outputFilePath}`);
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
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

const inputDir = config.inputDir;
console.log("Input directory:", inputDir);
const inputFiles = getAllFiles(inputDir);
console.log("Input files:", inputFiles);

inputFiles.forEach((filePath: string) => {
  try {
    const sourceFile = initializeProject(filePath);
    const variables = extractVariables(sourceFile);
    const functions = extractFunctions(sourceFile);
    const enums = extractEnums(sourceFile);
    const typeAliases = extractTypeAliases(sourceFile);
    const swiftCode = generateSwiftCode(variables, functions, enums, typeAliases);
    writeSwiftCodeToFile(filePath, swiftCode);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
});

console.log("SwiftGen completed.");
