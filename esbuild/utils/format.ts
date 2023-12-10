export function transformKeys(
  obj: Record<string, any>
): Record<string, string> {
  const transformedObj: Record<string, string> = {};

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const transformedKey = key.replace(/([A-Z])/g, "_$1").toUpperCase();
      transformedObj[`process.env.${transformedKey}`] = `'${obj[key]}'`;
    }
  }

  return transformedObj;
}
