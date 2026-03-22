/**
 * Pipeline and deals types matching Django backend models
 */

export interface Pipeline {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PipelineStage {
  id: string;
  pipeline: string;
  name: string;
  position: number;
  probability: number;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
}

export type DealStatus = 'OPEN' | 'WON' | 'LOST';

export interface Deal {
  id: string;
  title: string;
  pipeline: string;
  stage: string;
  contact: string;
  value: number;
  currency: string;
  expected_close_date: string | null;
  status: DealStatus;
  probability: number;
  owner: string;
  description: string | null;
  lost_reason: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

export type InteractionType = 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'TASK';

export interface Interaction {
  id: string;
  contact: string;
  deal: string | null;
  type: InteractionType;
  subject: string;
  description: string | null;
  date: string;
  duration_minutes: number | null;
  outcome: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}
