#!/usr/bin/env node

import { rimrafSync } from "rimraf";
import { configLookup } from "./model/runtime-config";
import { logger } from "./logger";
import { Repository } from "./model/repository";

configLookup().then((config) => {
  
});

// runtimeConfig.repositories
//   .map((repo) => new Repository(repo))
//   .forEach(async (repository) => {
//     logger.debug(repository.name);
//     await repository.clone();

//     repository.executeBlueprints();
//     repository.executeUpdate();
//     repository.exec("git status");
//   });
