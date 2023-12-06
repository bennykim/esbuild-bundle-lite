export function transformKeys(obj) {
  const transformedObj = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const transformedKey = key.replace(/([A-Z])/g, "_$1").toUpperCase();
      transformedObj[`process.env.${transformedKey}`] = `'${obj[key]}'`;
    }
  }

  return transformedObj;
}
