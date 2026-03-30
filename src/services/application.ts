import { BaseService } from "./base";

export type StatsPeriod = "weekly" | "monthly";

interface ApplicationStats {
  totalApplications: 0;
  totalSaved: 0;
  applied: 0;
  interviews: 0;
  offers: 0;
  averageResponseTimeInDays: 3;
  applicationSuccessRate: 0;
}

export interface SavedJob {
  created_at: string;
  updated_at: string;
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  minimum_salary?: number;
  maximum_salary?: number;
  salary_currency?: string;
  posted_at?: string;
  modalities?: ("remote" | "onsite" | "hybrid")[];
  source: string;
  source_url: string;
  external_url: string;
  experience_level?: string;
}

export interface Application {
  id: string;
  status: "ready" | "applied" | "interview" | "offer" | "declined";
  match_score: number;
  resume_url: string;
  job: SavedJob;
  applied_at?: string;
  interviewing_at?: string;
  offered_at?: string;
  rejected_at?: string;
}

class ApplicationService extends BaseService {
  public async getStats(period?: StatsPeriod) {
    const { data } = await this.client.get<ApplicationStats>(
      `/applications/stats${period ? `?period=${period}` : ""}`,
    );

    return data;
  }

  public async getApplications() {
    const { data } = await this.client.get<Application[]>("/applications");

    return data;
  }

  public async apply(application_id: string) {
    await this.client.post(`/applications/apply/${application_id}`);
  }

  public async scan() {
    await this.client.post("/jobs/scan");
  }

  public async applyToAllPending() {
    await this.client.post("/applications/apply/all");
  }
}

export default new ApplicationService();
