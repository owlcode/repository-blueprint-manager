import { SimpleGit } from "simple-git";
import { RepositoryStrategy } from "../strategy";
import { BranchRepositoryStrategy } from "./branch";

export class GithubPullRequestRepositoryStrategy implements RepositoryStrategy {
  branchStrategy: RepositoryStrategy;
  constructor(private git: SimpleGit) {
    this.branchStrategy = new BranchRepositoryStrategy(this.git);
  }
  async apply() {
    await this.branchStrategy.apply()
    // TODO call GH API to create pull request
  }
}
