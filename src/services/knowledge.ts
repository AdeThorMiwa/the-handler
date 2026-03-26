import { BaseService } from "./base";

interface KnowledgeBase {
  id: string;
  label: string;
  content: string;
  source: string;
  last_updated: string;
}

class KnowledgeBaseService extends BaseService {
  public async addKnowledgeBase(
    label: string,
    content: string,
  ): Promise<KnowledgeBase> {
    const { data } = await this.client.post<KnowledgeBase>(
      "/knowledge-base/add",
      { label, content },
    );

    return data;
  }

  public async uploadKnowledgeBase(
    label: string,
    file: File,
  ): Promise<KnowledgeBase> {
    const formData = new FormData();
    formData.append("label", label);
    formData.append("content", file);

    const { data } = await this.client.post<KnowledgeBase>(
      "/knowledge-base/upload",
      formData,
    );

    return data;
  }
}

export default new KnowledgeBaseService();
