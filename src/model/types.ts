import { object, string, z, union, record } from "zod";

export const blueprintStrategies = ["replace", "merge"] as const;
export const BlueprintStrategy = z.enum(blueprintStrategies);

export const repositoryStrategies = ["pullRequest", "push"] as const;
export const RepositoryStrategy = z.enum(repositoryStrategies);

export const BlueprintStrategyConfig = record(string().min(1), string());

export const BlueprintConfig = object({
  name: string(),
  strategy: union([BlueprintStrategy, BlueprintStrategyConfig]),
});

export type BlueprintConfig = z.infer<typeof BlueprintConfig>;

export const RepositoryConfig = object({
  name: string().optional(),
  gitUrl: string(),
  strategy: RepositoryStrategy.optional(),
  blueprints: union([string(), BlueprintConfig]).array(),
});

export type RepositoryConfig = z.infer<typeof RepositoryConfig>;

export const Config = object({
  workDir: string().default(".tmp"),
  repositories: RepositoryConfig.array(),
});

export type Config = z.infer<typeof Config>;
