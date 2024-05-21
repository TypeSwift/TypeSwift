export const typeMap: { [key: string]: string } = {
  'string': 'String',
  'boolean': 'Bool',
  'number': 'Double',
  'any': 'Any',
  'void': 'Void',
  'undefined': 'Optional',
  'null': 'Optional',
};

export function convertType(tsType: string): string {
  // arrays
  if (tsType.endsWith("[]")) {
    const elementType = tsType.slice(0, -2);
    return `[${convertType(elementType)}]`;
  }
  
  // generic types: Array<T>
  if (tsType.startsWith("Array<")) {
    const elementType = tsType.slice(6, -1);
    return `[${convertType(elementType)}]`;
  }

  // other known types
  if (typeMap[tsType]) {
    return typeMap[tsType];
  }

  // Optional types for undefined and null
  if (tsType === 'undefined' || tsType === 'null') {
    return 'Optional';
  }

  return tsType;
}
