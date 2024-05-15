import { Project } from "ts-morph";
import fs from 'fs';
import { convertType } from './typeMap';

const exampleFiles = ["example.ts", "example1.ts", "example2.ts", "example3.ts", "example4.ts", "example5.ts"];

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
    }))
  }));
}

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
    const swiftCode = generateSwiftCode(variables, functions);
    const enums = extractEnums(sourceFile);
    const swiftCode = generateSwiftCode(variables, functions, enums);
    writeSwiftCodeToFile(filePath, swiftCode);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
});
