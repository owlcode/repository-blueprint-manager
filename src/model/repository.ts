import { string } from "zod";
import gitUrlParse from "git-url-parse";
import { rimrafSync } from "rimraf";
import { execSync } from "child_process";
import { existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import simpleGit, { SimpleGit } from "simple-git";
import { unifyBlueprintDefinition, isJson } from "../helpers";
import { logger } from "../logger";
import { MergeJsonStrategy } from "../strategies/file/merge-json";
import { ReplaceStrategy } from "../strategies/file/replace";
import { BlueprintConfig, RepositoryConfig } from "./types";
import { RepositoryStrategy } from "../strategies/strategy";
import { BranchRepositoryStrategy } from "../strategies/repository/branch";
import { DirectPushRepositoryStrategy } from "../strategies/repository/direct-push";
import { GithubPullRequestRepositoryStrategy } from "../strategies/repository/github-pull-request";
// import { runtimeConfig } from "./runtime-config";

export class Repository {
  name: string;
  git: SimpleGit;
  baseDir: string;
  gitUrl: gitUrlParse.GitUrl;
  strategy: RepositoryStrategy;
  blueprints: BlueprintConfig[];

  constructor(config: RepositoryConfig) {
    this.gitUrl = gitUrlParse(config.gitUrl);
    this.name = config.name || this.gitUrl.name;

    this.baseDir = this.getBaseDir(this.name);

    this.strategy = this.getStrategy(config.strategy);
    this.git = simpleGit(this.baseDir, { baseDir: this.baseDir });
    this.blueprints = config.blueprints.map(unifyBlueprintDefinition);

    this.ensureWorkDir();
  }

  async clone() {
    return await this.git.clone(this.gitUrl.href, `.`, {
      "--depth": 1,
    });
  }

  exec(command: string) {
    const out = execSync(command, {
      cwd: this.baseDir,
    });
    logger.info(out.toString());
  }

  async executeUpdate() {
    this.strategy.apply();
  }

  executeBlueprints() {
    const replace = new ReplaceStrategy();
    const mergeJson = new MergeJsonStrategy();
    this.blueprints.forEach((blueprint, i) => {
      const sourceDir = join("blueprints", blueprint.name);
      const files = readdirSync(sourceDir);

      files.forEach((file) => {
        const sourceFilePath = join(sourceDir, file);
        const targetFilePath = join(this.baseDir, file);

        if (isJson(file)) {
          mergeJson.apply(sourceFilePath, targetFilePath);
        } else {
          replace.apply(sourceFilePath, targetFilePath);
        }
      });
    });
  }

  private getStrategy(strategyName?: string): RepositoryStrategy {
    switch (strategyName) {
      case "branch":
        return new BranchRepositoryStrategy(this.git);
      case "directPush":
        return new DirectPushRepositoryStrategy(this.git);
      case "githubPullRequest":
        return new GithubPullRequestRepositoryStrategy(this.git);
      default:
        return new BranchRepositoryStrategy(this.git);
    }
  }

  private getBaseDir(name: string): string {
    // const workDir = runtimeConfig.workDir;
    const workDir = ".tmp";
    return join(workDir, name.replace(/[^a-z0-9]/gi, "_").toLowerCase());
  }

  private ensureWorkDir(): void {
    if (existsSync(this.baseDir)) {
      rimrafSync(this.baseDir);
    }
    mkdirSync(this.baseDir, { recursive: true });
  }
}
