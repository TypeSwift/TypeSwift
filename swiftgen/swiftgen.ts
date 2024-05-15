import { Project } from "ts-morph";
import fs from 'fs';
import { convertType } from './typeMap';

const exampleFiles = ["example.ts", "example1.ts", "example2.ts", "example3.ts", "example4.ts", "example5.ts"];

exampleFiles.forEach(filePath => {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  const variables = sourceFile.getVariableStatements().flatMap(statement => statement.getDeclarations().map(decl => decl.getName()));
  const functions = sourceFile.getFunctions().map(func => ({
    name: func.getName(),
    parameters: func.getParameters().map(param => ({
      name: param.getName(),
      type: convertType(param.getType().getText()),
      default: param.hasInitializer() ? param.getInitializer()?.getText() : undefined
    }))
  }));

  // Generate Swift code
  let swiftCode = `enum TypeSwift {\n\n  // Variables\n`;
  variables.forEach(variable => {
    swiftCode += `  case ${variable}\n`;
  });

  swiftCode += `\n  // Functions\n`;
  functions.forEach(func => {
    const params = func.parameters.map(param => {
      const type = param.type === 'Optional' ? `${param.type}<${convertType('string')}>` : param.type;
      const defaultValue = param.default ? ` = ${param.default}` : '';
      return `_${param.name}: ${type}${defaultValue}`;
    }).join(', ');
    swiftCode += `  case ${func.name}(${params.replace(/_/g, '_ ')})\n`;
  });

  fs.writeFileSync(`${filePath.replace('.ts', '')}_output.swift`, swiftCode);

  console.log(`Swift code generated successfully for ${filePath}!`);
});
