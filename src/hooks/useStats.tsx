import type { StatsPeriod } from "@/services/application";
import { useEffect, useState } from "react";
import ApplicationService from "@/services/application";

export const useStats = (period?: StatsPeriod) => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    totalSaved: 0,
    applied: 0,
    interviews: 0,
    offers: 0,
    declined: 0,
    averageResponseTimeInDays: 0,
    autoApplySuccessRate: 0,
  });

  useEffect(() => {
    ApplicationService.getStats(period).then((stats) =>
      setStats((s) => {
        return Object.assign(s, stats);
      }),
    );
  }, [period]);

  return stats;
};
