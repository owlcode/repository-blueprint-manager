export enum Output {
    Success = 0,
    Error = 1
}

export interface RepositoryStrategy {
    apply(): any
}

export interface Strategy {
    apply(fromPath: string, toPath: string, options?: any): Output
}