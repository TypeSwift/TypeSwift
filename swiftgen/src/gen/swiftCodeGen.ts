import { convertType } from "../utils/typeMap";

function generateVariableCases(variables: string[]): string {
  let code = `\n  // Variables\n`;
  variables.forEach(variable => {
    code += `  case ${variable}\n`;
  });
  return code;
}

function generateFunctionCases(functions: any[]): string {
  let code = `\n  // Functions\n`;
  functions.forEach(func => {
    const params = func.parameters.map((param: any) => {
      const type = param.type === 'Optional' ? `${param.type}<${convertType('string')}>` : param.type;
      const defaultValue = param.default ? ` = ${param.default}` : '';
      return `_${param.name}: ${type}${defaultValue}`;
    }).join(', ');

    if (params.length > 0) {
      code += `  case ${func.name}(${params.replace(/_/g, '_ ')})\n`;
    } else {
      code += `  case ${func.name}\n`;
    }
  });
  return code;
}

function generateEnumCases(enums: any[]): string {
  let code = `\n  // Enums\n`;
  enums.forEach(enumDecl => {
    code += `  enum ${enumDecl.name} {\n`;
    enumDecl.members.forEach((member: any) => {
      code += `    case ${member}\n`;
    });
    code += `  }\n`;
  });
  return code;
}

function generateTypeAliasCases(typeAliases: any[]): string {
  let code = `\n  // Type Aliases\n`;
  typeAliases.forEach(alias => {
    code += `  struct ${alias.name} {\n`;
    alias.properties.forEach((prop: any) => {
      code += `    var ${prop.name}: ${prop.type}\n`;
    });
    code += `  }\n`;
  });
  return code;
}

function generateJsStringProperty(variables: string[], functions: any[]): string {
  let code = `\n  // Computed property for jsString\n  var jsString: String {\n    switch self {\n`;

  variables.forEach(variable => {
    code += `    case .${variable}:\n      return "${variable}"\n`;
  });

  functions.forEach(func => {
    const paramNames = func.parameters.map((param: any) => `\\(${param.name})`).join(', ');
    if (func.parameters.length > 0) {
      code += `    case .${func.name}(${func.parameters.map((param: any) => `let ${param.name}`).join(', ')}):\n`;
      code += `      return "${func.name}(${paramNames})"\n`;
    } else {
      code += `    case .${func.name}:\n`;
      code += `      return "${func.name}()"\n`;
    }
  });

  code += `    }\n  }\n`;

  return code;
}

export function generateSwiftCode(variables: string[], functions: any[], enums: any[], typeAliases: any[]) {
  let swiftCode = `enum TypeSwift {\n`;

  if (variables.length > 0) {
    swiftCode += generateVariableCases(variables);
  }

  if (functions.length > 0) {
    swiftCode += generateFunctionCases(functions);
  }

  if (enums.length > 0) {
    swiftCode += generateEnumCases(enums);
  }

  if (typeAliases.length > 0) {
    swiftCode += generateTypeAliasCases(typeAliases);
  }

  swiftCode += generateJsStringProperty(variables, functions);

  swiftCode += `}\n`;
  return swiftCode;
}
