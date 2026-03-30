import { BaseService } from "./base";

interface KnowledgeBase {
  id: string;
  label: string;
  content: string;
  source: string;
  last_updated: string;
}

class KnowledgeBaseService extends BaseService {
  public async add(label: string, content: string): Promise<KnowledgeBase> {
    const { data } = await this.client.post<KnowledgeBase>(
      "/knowledge-base/add",
      { label, content },
    );

    return data;
  }

  public async upload(label: string, file: File): Promise<KnowledgeBase> {
    const formData = new FormData();
    formData.append("label", label);
    formData.append("content", file);

    const { data } = await this.client.post<KnowledgeBase>(
      "/knowledge-base/upload",
      formData,
    );

    return data;
  }

  public async get() {
    const { data } = await this.client.get<KnowledgeBase[]>("/knowledge-base");

    return data;
  }

  public async delete(id: string) {
    await this.client.delete(`/knowledge-base/${id}`);
  }

  public async getRoleList() {
    const { data } = await this.client.get<string[]>(
      "/knowledge-base/get-roles",
    );

    return data;
  }
}

export default new KnowledgeBaseService();
