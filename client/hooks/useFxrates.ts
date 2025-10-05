import { useQuery } from "@tanstack/react-query";
import getConversionRate from "../apis/fxrates";

export function useFxRates(from: string, to: string, amount: number) {
  const query = useQuery({
    queryKey: ["fxrates", from, to, amount],
    queryFn: async () => {
      return getConversionRate({ from, to, amount })
    },
    enabled: !!from && !!to && amount > 0,
  });

  return {
    ...query,
  }
}