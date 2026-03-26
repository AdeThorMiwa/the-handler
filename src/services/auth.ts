import { BaseService } from "./base";
import LocalStorageService from "./storage";

class AuthService extends BaseService {
  public async authenticate(code: string) {
    const { data } = await this.client.post<{ token: string }>(
      "/auth/with-google",
      { code },
    );

    LocalStorageService.writeAuthToken(data.token);
  }
}

export default new AuthService();
