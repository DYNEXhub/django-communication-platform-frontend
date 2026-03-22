/**
 * Communication channel types matching Django backend models
 */

export type DirectionType = 'INBOUND' | 'OUTBOUND';
export type CommunicationStatus = 'DRAFT' | 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED';

export interface Channel {
  id: string;
  name: string;
  type: 'EMAIL' | 'SMS' | 'WHATSAPP';
  is_active: boolean;
  configuration: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface EmailMessage {
  id: string;
  contact: string;
  channel: string;
  direction: DirectionType;
  status: CommunicationStatus;
  from_email: string;
  to_email: string;
  cc: string[] | null;
  bcc: string[] | null;
  subject: string;
  body_text: string | null;
  body_html: string | null;
  attachments: string[] | null;
  thread_id: string | null;
  message_id: string | null;
  in_reply_to: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  failed_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface SMSMessage {
  id: string;
  contact: string;
  channel: string;
  direction: DirectionType;
  status: CommunicationStatus;
  from_number: string;
  to_number: string;
  content: string;
  sent_at: string | null;
  delivered_at: string | null;
  failed_reason: string | null;
  provider_message_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppMessage {
  id: string;
  contact: string;
  channel: string;
  direction: DirectionType;
  status: CommunicationStatus;
  from_number: string;
  to_number: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  template_name: string | null;
  template_params: Record<string, string> | null;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  failed_reason: string | null;
  provider_message_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  contact: string;
  channel: string;
  direction: DirectionType;
  content: string;
  sender_name: string;
  timestamp: string;
  attachments: string[] | null;
  created_at: string;
  updated_at: string;
}
