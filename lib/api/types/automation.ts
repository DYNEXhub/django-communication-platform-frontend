/**
 * Automation and webhook types matching Django backend models
 */

export type TriggerType =
  | 'CONTACT_CREATED'
  | 'CONTACT_UPDATED'
  | 'DEAL_CREATED'
  | 'DEAL_STAGE_CHANGED'
  | 'DEAL_WON'
  | 'DEAL_LOST'
  | 'EMAIL_RECEIVED'
  | 'EMAIL_OPENED'
  | 'EMAIL_CLICKED'
  | 'FORM_SUBMITTED'
  | 'TAG_ADDED'
  | 'TAG_REMOVED';

export type ActionType =
  | 'SEND_EMAIL'
  | 'SEND_SMS'
  | 'SEND_WHATSAPP'
  | 'ADD_TAG'
  | 'REMOVE_TAG'
  | 'UPDATE_FIELD'
  | 'CREATE_TASK'
  | 'MOVE_DEAL_STAGE'
  | 'WEBHOOK';

export interface Automation {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  trigger_type: TriggerType;
  trigger_config: Record<string, unknown> | null;
  conditions: Record<string, unknown>[] | null;
  actions: {
    type: ActionType;
    config: Record<string, unknown>;
  }[];
  execution_count: number;
  last_executed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AutomationLog {
  id: string;
  automation: string;
  trigger_data: Record<string, unknown>;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  actions_executed: number;
  actions_failed: number;
  error_message: string | null;
  execution_time_ms: number;
  created_at: string;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: TriggerType[];
  is_active: boolean;
  secret: string | null;
  headers: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export interface WebhookDelivery {
  id: string;
  webhook: string;
  event_type: TriggerType;
  payload: Record<string, unknown>;
  status: 'PENDING' | 'DELIVERED' | 'FAILED';
  response_code: number | null;
  response_body: string | null;
  attempts: number;
  next_retry_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}
