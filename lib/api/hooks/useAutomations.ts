"use client";

import { useState, useEffect, useCallback } from "react";
import { get } from "../client";
import type { PaginatedResponse } from "../client";
import type { Automation } from "../types/automation";

export function useAutomations() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAutomations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await get<PaginatedResponse<Automation>>(
        "/automations/automations/"
      );
      setAutomations(response.results);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch automations")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAutomations();
  }, [fetchAutomations]);

  return { automations, loading, error, refetch: fetchAutomations };
}
