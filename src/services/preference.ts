import { BaseService } from "./base";

interface UserPreferenceUpdateableFields {
  directories: string[];
  job_search_at: string;
  application_delay: number;
  application_frequency_min: number;
  application_frequency_max: number;
  preferred_roles: string[];
  organization_blacklist: string[];
  minimum_salary: number;
  salary_currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD";
  preferred_modalities: ("onsite" | "remote" | "hybrid")[];
  preferred_countries?: string[];
  auto_apply: boolean;
  experience_level?: string;
}

export interface UserPreference extends UserPreferenceUpdateableFields {
  id: string;
  last_updated: string;
}

class UserPreferenceService extends BaseService {
  public async update(preferences: Partial<UserPreferenceUpdateableFields>) {
    const { data } = await this.client.patch<UserPreference>(
      "/preference",
      preferences,
    );

    return data;
  }

  public async get() {
    const { data } = await this.client.get<UserPreference>("/preference");

    return data;
  }
}

export default new UserPreferenceService();
