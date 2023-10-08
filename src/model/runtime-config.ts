import { Repository } from "./repository";
import { existsSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { Config, RepositoryConfig } from "./types";
import { logger } from "../logger";

export const configLookup = (): Promise<unknown> => {
  const paths = [".rbmrc.js", ".rbmrc.cjs", ".rbmrc.mjs"];
  const [configPath] = paths
    .map((path) => join(cwd(), path))
    .filter((path) => existsSync(path));

  if (!configPath) {
    logger.error("add configuration");
    throw new Error("Configuration file not found");
  }
  logger.info(`Found ${configPath}`);

  return import(configPath).then(file => file.default);
};

export class RuntimeConfig {
  static async init() {
    return new RuntimeConfig();
  }

  readonly paths = [".rbmrc.js", ".rbmrc.mjs"];

  workDir: string;
  repositories: RepositoryConfig[];

  constructor() {
    const [configPath] = this.paths
      .map((path) => join(cwd(), path))
      .filter((path) => existsSync(path));

    if (!configPath) {
      logger.error("add configuration");
      throw new Error("Configuration file not found");
    }
    logger.info(`Found ${configPath}`);

    const config = require(configPath);
    const parsedConfig = Config.safeParse(config);
    if (parsedConfig.success === false) {
      logger.debug(parsedConfig.error.issues);
      throw new Error("Configuration is not valid");
    } else {
      logger.info("Loaded and validated repository configuration");
      const originalLength = parsedConfig.data.repositories.length;
      const setLength = new Set(
        parsedConfig.data.repositories.map((a) => a.name)
      ).size;
      if (originalLength !== setLength) {
        logger.error("duplicate names");
      }

      this.workDir = parsedConfig.data.workDir || ".tmp";
      this.repositories = parsedConfig.data.repositories;
    }
  }
}

// export const runtimeConfig = RuntimeConfig.init();
