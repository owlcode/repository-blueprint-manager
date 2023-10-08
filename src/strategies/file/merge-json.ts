import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { Output, Strategy } from '../strategy';
import mergeWith from 'lodash.mergewith';

export class MergeJsonStrategy implements Strategy {
    apply(fromPath: string, toPath: string, options?: any) {
        if (!existsSync(toPath)) {
            copyFileSync(fromPath, toPath)
            return Output.Success
        }

        const sourceFile = JSON.parse(readFileSync(fromPath).toString());
        const targetFile = JSON.parse(readFileSync(toPath).toString());

        const merged = mergeWith(sourceFile, targetFile);

        writeFileSync(toPath, JSON.stringify(merged, null, 2))

        return Output.Success
    }

}