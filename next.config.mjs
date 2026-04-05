import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

const createConfig = (phase) => {
  const isDevelopmentServer = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    distDir: isDevelopmentServer ? ".next-dev" : ".next"
  };
};

export default createConfig;
