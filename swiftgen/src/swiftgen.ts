import { Project } from "ts-morph";
import path from 'path';
import { convertType } from './utils/typeMap';
import { readConfig, writeSwiftCodeToFile, getAllFiles } from './utils/fileUtils';

console.log("Starting SwiftGen...");

// Read configuration file
const configPath = path.join(__dirname, 'config/config.json');
const config = readConfig(configPath);

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

  // Add the computed property for jsString
  swiftCode += `\n  // Computed property for jsString\n  var jsString: String {\n    switch self {\n`;
  
  variables.forEach(variable => {
    swiftCode += `    case .${variable}:\n      return "${variable}"\n`;
  });

  functions.forEach(func => {
    const params = func.parameters.map((param: any) => `\\(${param.name})`).join(', ');
    swiftCode += `    case .${func.name}(${func.parameters.map((param: any) => `let ${param.name}`).join(', ')}):\n`;
    swiftCode += `      return "${func.name}(${params})"\n`;
  });

  swiftCode += `    }\n  }\n`;

  swiftCode += `}\n`;
  return swiftCode;
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

const swiftCode = generateSwiftCode(combinedVariables, combinedFunctions, combinedEnums, combinedTypeAliases);
writeSwiftCodeToFile(swiftCode, config.outputDir, config.outputFileName, config.outputSuffix);

console.log("SwiftGen completed.");
