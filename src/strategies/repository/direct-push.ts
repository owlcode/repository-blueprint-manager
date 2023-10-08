import { SimpleGit } from "simple-git";
import { RepositoryStrategy } from "../strategy";

export class DirectPushRepositoryStrategy implements RepositoryStrategy {
  constructor(private git: SimpleGit) {}
  async apply() {
    await this.git.add(".");
    await this.git.commit("chore: apply blueprint");
    await this.git.push();
  }
}
