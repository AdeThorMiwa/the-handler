import type { User } from "@/types";
import { BaseService } from "./base";

class UserService extends BaseService {
  public async get() {
    const { data } = await this.client.get<User>("/auth/me");

    return data;
  }
}

export default new UserService();
