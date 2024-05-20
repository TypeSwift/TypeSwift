import { convertType } from "../utils/typeMap";


export function generateSwiftCode(variables: string[], functions: any[], enums: any[], typeAliases: any[]) {
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

      if (params.length > 0) {
        swiftCode += `  case ${func.name}(${params.replace(/_/g, '_ ')})\n`;
      } else {
        swiftCode += `  case ${func.name}\n`;
      }
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
    const paramNames = func.parameters.map((param: any) => `\\(${param.name})`).join(', ');
    if (func.parameters.length > 0) {
      swiftCode += `    case .${func.name}(${func.parameters.map((param: any) => `let ${param.name}`).join(', ')}):\n`;
      swiftCode += `      return "${func.name}(${paramNames})"\n`;
    } else {
      swiftCode += `    case .${func.name}:\n`;
      swiftCode += `      return "${func.name}()"\n`;
    }
  });

  swiftCode += `    }\n  }\n`;

  swiftCode += `}\n`;
  return swiftCode;
}
