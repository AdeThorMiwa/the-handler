import { BaseService } from "./base";

export interface JobDirectoryMetadata {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

type ConnectResponse = { success: boolean; failureReason?: string };

class JobDirectoryService extends BaseService {
  public async getDirectories(): Promise<JobDirectoryMetadata[]> {
    const { data } =
      await this.client.get<JobDirectoryMetadata[]>("/directories");

    return data;
  }

  private async getConnectionUrl(id: string) {
    return "http://localhost:3000/" + id;
  }

  public async connect(id: string) {
    const connectionUrl = await this.getConnectionUrl(id);

    return new Promise<ConnectResponse>((resolve) => {
      const newTab = window.open(connectionUrl, "_blank");

      if (!newTab) {
        throw new Error("Popup blocked or failed to open.");
      }

      let resultData: ConnectResponse = { success: true }; // @todo: fix

      const messageHandler = (event: MessageEvent<ConnectResponse>) => {
        if (event.source === newTab) {
          resultData = event.data;
        }
      };

      window.addEventListener("message", messageHandler);

      const timer = setInterval(() => {
        if (newTab.closed) {
          clearInterval(timer);
          window.removeEventListener("message", messageHandler);

          resolve(resultData);
        }
      }, 500);
    });
  }
}

export default new JobDirectoryService();
