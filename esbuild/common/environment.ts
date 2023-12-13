import { transformKeys } from "../utils";

export function createClientEnvironment(
  envObj: Record<string, any>
): Record<string, string> {
  const clientEnvironment = transformKeys(envObj);

  Object.keys(process.env).forEach((key) => {
    if (key.startsWith("CLIENT_") && process.env[key] !== undefined) {
      clientEnvironment[`process.env.${key}`] = `'${process.env[key]}'`;
    }
  });

  return clientEnvironment;
}
