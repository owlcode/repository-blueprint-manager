import { copyFileSync, lstatSync } from "fs";
import { Output, Strategy } from "../strategy";
import { logger } from "../../logger";

export class ReplaceStrategy implements Strategy {
  apply(fromPath: string, toPath: string, options?: any) {
    const from = lstatSync(fromPath);

    if (from.isDirectory()) {
      logger.error("file is directory");
      return Output.Error;
    }

    logger.debug(fromPath, toPath);
    copyFileSync(fromPath, toPath);

    return Output.Success;
  }
}
