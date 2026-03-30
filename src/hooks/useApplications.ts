import { useEffect, useMemo, useState } from "react";
import ApplicationService, { type Application } from "@/services/application";

export const useApplications = () => {
  const [allApplications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    ApplicationService.getApplications().then(setApplications);
  }, []);

  const saved = useMemo(() => {
    return allApplications.filter((app) => app.status === "ready");
  }, [allApplications]);

  const applications = useMemo(() => {
    return allApplications.filter((app) => app.status !== "ready");
  }, [allApplications]);

  return { applications, saved };
};
