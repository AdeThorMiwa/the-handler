import { useStats } from "./useStats";

export const useWeeklyStats = () => {
  const { applied, interviews, offers } = useStats("weekly");

  return [
    {
      label: "Applied",
      value: applied,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Interview",
      value: interviews,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Offers",
      value: offers,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];
};
