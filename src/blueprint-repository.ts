import { existsSync, readdirSync } from "fs";
import { BlueprintConfig } from "./types";
import { logger } from "./logger";

const blueprintsDirectory = 'blueprints';

export class BlueprintsRepository {
    
    blueprints: Map<string, BlueprintConfig>;

    constructor() {
        if (!existsSync(blueprintsDirectory)) {
            this.blueprints = new Map();
            logger.warn(`Missing ${blueprintsDirectory} directory`)
        } else {
            this.blueprints = new Map(readdirSync(blueprintsDirectory).map((directory) => {
                return [directory, {
                    name: directory
                }]
            }))
        }   
    }

    exists(blueprint: BlueprintConfig): boolean {
        return this.blueprints.has(blueprint.name);
    }
}

export const blueprintRepository = new BlueprintsRepository()