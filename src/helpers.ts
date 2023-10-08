import { extname } from "path";
import { logger } from "./logger"
import { BlueprintConfig, BlueprintStrategy } from "./model/types";


export const fatal = (message: string, code = 1) => {
    logger.fatal(message);
    process.exit(code);
}

export const unifyBlueprintDefinition = (definition: string | BlueprintConfig): BlueprintConfig => {
    if (typeof definition === 'string') {
        return {
            name: definition,
            strategy: BlueprintStrategy.enum.replace
        }
    }

    return definition;
}

export const isJson = (file: string) => extname(file) === '.json' 