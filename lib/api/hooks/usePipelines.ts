/**
 * React hooks for pipeline and deal management
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { get, post, patch } from "../client";
import type { PaginatedResponse } from "../client";
import type {
  Pipeline,
  PipelineStage,
  Deal,
  Interaction,
} from "../types/pipeline";

/**
 * Fetch all pipelines
 */
export function usePipelines() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPipelines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await get<PaginatedResponse<Pipeline>>(
        "/pipelines/pipelines/"
      );
      setPipelines(response.results);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch pipelines"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPipelines();
  }, [fetchPipelines]);

  return { pipelines, loading, error, refetch: fetchPipelines };
}

/**
 * Fetch a single pipeline with its stages
 */
export function usePipeline(id: string | null) {
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPipeline = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch pipeline
      const pipelineData = await get<Pipeline>(`/pipelines/pipelines/${id}/`);
      setPipeline(pipelineData);

      // Fetch stages for this pipeline
      const stagesResponse = await get<PaginatedResponse<PipelineStage>>(
        "/pipelines/stages/",
        { pipeline: id }
      );
      // Sort stages by position
      const sortedStages = stagesResponse.results.sort(
        (a, b) => a.position - b.position
      );
      setStages(sortedStages);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch pipeline"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPipeline();
  }, [fetchPipeline]);

  return { pipeline, stages, loading, error, refetch: fetchPipeline };
}

/**
 * Fetch deals with optional filters
 */
export function useDeals(params?: {
  pipeline?: string;
  stage?: string;
  status?: string;
}) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams: Record<string, string> = {};
      if (params?.pipeline) queryParams.pipeline = params.pipeline;
      if (params?.stage) queryParams.stage = params.stage;
      if (params?.status) queryParams.status = params.status;

      const response = await get<PaginatedResponse<Deal>>(
        "/pipelines/deals/",
        queryParams
      );
      setDeals(response.results);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch deals"));
    } finally {
      setLoading(false);
    }
  }, [params?.pipeline, params?.stage, params?.status]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  return { deals, loading, error, refetch: fetchDeals };
}

/**
 * Fetch a single deal
 */
export function useDeal(id: string | null) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDeal = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const dealData = await get<Deal>(`/pipelines/deals/${id}/`);
      setDeal(dealData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch deal"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDeal();
  }, [fetchDeal]);

  return { deal, loading, error, refetch: fetchDeal };
}

/**
 * Create a new deal
 */
export function useCreateDeal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createDeal = async (
    dealData: Partial<Deal>
  ): Promise<Deal | null> => {
    try {
      setLoading(true);
      setError(null);
      const newDeal = await post<Deal, Partial<Deal>>(
        "/pipelines/deals/",
        dealData
      );
      return newDeal;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create deal"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createDeal, loading, error };
}

/**
 * Update an existing deal
 */
export function useUpdateDeal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateDeal = async (
    id: string,
    dealData: Partial<Deal>
  ): Promise<Deal | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedDeal = await patch<Deal, Partial<Deal>>(
        `/pipelines/deals/${id}/`,
        dealData
      );
      return updatedDeal;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update deal"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateDeal, loading, error };
}

/**
 * Move a deal to a different stage (for kanban drag-and-drop)
 */
export function useMoveDeal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const moveDeal = async (
    dealId: string,
    newStageId: string
  ): Promise<Deal | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedDeal = await patch<Deal, { stage: string }>(
        `/pipelines/deals/${dealId}/`,
        { stage: newStageId }
      );
      return updatedDeal;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to move deal"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { moveDeal, loading, error };
}

/**
 * Create a new pipeline
 */
export function useCreatePipeline() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPipeline = async (
    data: { name: string; description?: string }
  ): Promise<Pipeline | null> => {
    try {
      setLoading(true);
      setError(null);
      const newPipeline = await post<Pipeline, typeof data>(
        "/pipelines/pipelines/",
        data
      );
      return newPipeline;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create pipeline"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPipeline, loading, error };
}

/**
 * Fetch interactions for a deal
 */
export function useInteractions(dealId: string | null) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInteractions = useCallback(async () => {
    if (!dealId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await get<PaginatedResponse<Interaction>>(
        "/pipelines/interactions/",
        { deal: dealId }
      );
      setInteractions(response.results);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch interactions")
      );
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  return { interactions, loading, error, refetch: fetchInteractions };
}
