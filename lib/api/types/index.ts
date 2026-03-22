/**
 * Centralized export for all API types
 */

// Auth types
export type {
  User,
  UserRole,
  TokenPair,
  LoginCredentials,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './auth';

// Contact types
export type {
  Contact,
  Company,
  Tag,
  ContactGroup,
  CustomFieldDefinition,
  Note,
  SimpleUser,
} from './contact';

// Pipeline types
export type {
  Pipeline,
  PipelineStage,
  Deal,
  DealStatus,
  Interaction,
  InteractionType,
} from './pipeline';

// Campaign types
export type {
  Template,
  Campaign,
  CampaignRecipient,
  ChannelType,
  CampaignStatus,
} from './campaign';

// Communication types
export type {
  Channel,
  EmailMessage,
  SMSMessage,
  WhatsAppMessage,
  ChatMessage,
  DirectionType,
  CommunicationStatus,
} from './communication';

// Automation types
export type {
  Automation,
  AutomationLog,
  Webhook,
  WebhookDelivery,
  TriggerType,
  ActionType,
} from './automation';
