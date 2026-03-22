"use client";

import { useState, useEffect, useCallback } from "react";
import { get } from "../client";
import type { PaginatedResponse } from "../client";
import type { Campaign } from "../types/campaign";

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await get<PaginatedResponse<Campaign>>(
        "/campaigns/campaigns/"
      );
      setCampaigns(response.results);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch campaigns")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return { campaigns, loading, error, refetch: fetchCampaigns };
}
