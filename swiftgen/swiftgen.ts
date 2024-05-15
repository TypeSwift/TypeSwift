import { Project } from "ts-morph";
import fs from 'fs';
import { convertType } from './typeMap';

const exampleFiles = ["example.ts", "example1.ts", "example2.ts", "example3.ts", "example4.ts", "example5.ts"];

/**
 * Initializes a ts-morph Project and adds the source file at the given path.
 * @param filePath - The path to the TypeScript file.
 * @returns The source file.
 */
function initializeProject(filePath: string) {
  const project = new Project();
  return project.addSourceFileAtPath(filePath);
}

/**
 * Extracts variable names from the source file.
 * @param sourceFile - The source file to extract variables from.
 * @returns An array of variable names.
 */
function extractVariables(sourceFile: any) {
  return sourceFile.getVariableStatements()
    .flatMap((statement: any) => statement.getDeclarations().map((decl: any) => decl.getName()));
}

/**
 * Extracts function details from the source file.
 * @param sourceFile - The source file to extract functions from.
 * @returns An array of function details including names, parameters, and default values.
 */
function extractFunctions(sourceFile: any) {
  return sourceFile.getFunctions().map((func: any) => ({
    name: func.getName(),
    parameters: func.getParameters().map((param: any) => ({
      name: param.getName(),
      type: convertType(param.getType().getText()),
      default: param.hasInitializer() ? param.getInitializer()?.getText() : undefined
    }))
  }));
}

/**
 * Extracts enum definitions from the source file.
 * @param sourceFile - The source file to extract enums from.
 * @returns An array of enums with their names and members.
 */
function extractEnums(sourceFile: any) {
  return sourceFile.getEnums().map((enumDecl: any) => ({
    name: enumDecl.getName(),
    members: enumDecl.getMembers().map((member: any) => member.getName())
  }));
}

/**
 * Generates Swift code for variables, functions, and enums.
 * @param variables - An array of variable names.
 * @param functions - An array of function details.
 * @param enums - An array of enum definitions.
 * @returns The generated Swift code as a string.
 */
function generateSwiftCode(variables: string[], functions: any[], enums: any[]) {
  let swiftCode = `enum TypeSwift {\n\n  // Variables\n`;
  variables.forEach(variable => {
    swiftCode += `  case ${variable}\n`;
  });

  swiftCode += `\n  // Functions\n`;
  functions.forEach(func => {
    const params = func.parameters.map((param: any) => {
      const type = param.type === 'Optional' ? `${param.type}<${convertType('string')}>` : param.type;
      const defaultValue = param.default ? ` = ${param.default}` : '';
      return `_${param.name}: ${type}${defaultValue}`;
    }).join(', ');
    swiftCode += `  case ${func.name}(${params.replace(/_/g, '_ ')})\n`;
  });

  swiftCode += `\n  // Enums\n`;
  enums.forEach(enumDecl => {
    swiftCode += `  enum ${enumDecl.name} {\n`;
    enumDecl.members.forEach((member: string) => {
      swiftCode += `    case ${member}\n`;
    });
    swiftCode += `  }\n`;
  });

  swiftCode += `}\n`;
  return swiftCode;
}

/**
 * Writes the generated Swift code to a file.
 * @param filePath - The path to the TypeScript file.
 * @param swiftCode - The generated Swift code.
 */
function writeSwiftCodeToFile(filePath: string, swiftCode: string) {
  const outputFilePath = filePath.replace('.ts', '_output.swift');
  fs.writeFileSync(outputFilePath, swiftCode);
  console.log(`Swift code generated successfully for ${filePath}!`);
}

exampleFiles.forEach(filePath => {
  try {
    const sourceFile = initializeProject(filePath);
    const variables = extractVariables(sourceFile);
    const functions = extractFunctions(sourceFile);
    const enums = extractEnums(sourceFile);
    const swiftCode = generateSwiftCode(variables, functions, enums);
    writeSwiftCodeToFile(filePath, swiftCode);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
});
