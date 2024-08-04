import { logger } from "./logger";

export const measurePerformance = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  logger.info(`${name} took ${(end - start).toFixed(2)}ms`);
  return result;
};
