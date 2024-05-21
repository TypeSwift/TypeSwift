import { Project } from "ts-morph";
import path from 'path';
import fs from 'fs';
import { readConfig, writeSwiftCodeToFile, getAllFiles } from './utils/fileUtils';
import { convertType } from "./utils/typeMap";
import { generateSwiftCode } from './gen/swiftCodeGen';

console.log("Starting SwiftGen...");

// Read configuration file
const configPath = path.join(__dirname, 'config/config.json');
const config = readConfig(configPath);

console.log("Configuration loaded:", config);

// Read package.json file
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageInfo = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

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

const inputDir = config.inputDir;
console.log("Input directory:", inputDir);
const inputFiles = getAllFiles(inputDir);
console.log("Input files:", inputFiles);

let combinedVariables: string[] = [];
let combinedFunctions: any[] = [];
let combinedEnums: any[] = [];
let combinedTypeAliases: any[] = [];

inputFiles.forEach((filePath: string) => {
  try {
    const sourceFile = initializeProject(filePath);
    combinedVariables = combinedVariables.concat(extractVariables(sourceFile));
    combinedFunctions = combinedFunctions.concat(extractFunctions(sourceFile));
    combinedEnums = combinedEnums.concat(extractEnums(sourceFile));
    combinedTypeAliases = combinedTypeAliases.concat(extractTypeAliases(sourceFile));
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
});

const swiftCode = generateSwiftCode(combinedVariables, combinedFunctions, combinedEnums, combinedTypeAliases, packageInfo);
writeSwiftCodeToFile(swiftCode, config.outputDir, config.outputFileName, config.outputSuffix);

console.log("SwiftGen completed.");
