const envFilter = (
  env: NodeJS.ProcessEnv,
  blacklist: string[],
): NodeJS.ProcessEnv => {
  const result: NodeJS.ProcessEnv = {};
  Object.keys(env).forEach((key) => {
    if (!blacklist.includes(key)) {
      result[key] = env[key];
    }
  });
  return result;
};

export default envFilter;
