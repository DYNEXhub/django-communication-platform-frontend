/**
 * Contact management types matching Django backend models
 */

export interface Tag {
  id: string;
  name: string;
  color: string;
  category: string;
  created_at: string;
  usage_count: number;
}

export interface Company extends Record<string, unknown> {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  contact_count: number;
  owner: SimpleUser | null;
  created_at: string;
  updated_at: string;
}

export interface SimpleUser {
  id: number;
  username: string;
  email: string;
}

export interface CustomFieldDefinition {
  id: string;
  name: string;
  field_type: 'TEXT' | 'NUMBER' | 'DATE' | 'DROPDOWN' | 'BOOLEAN';
  entity_type: 'CONTACT' | 'COMPANY' | 'DEAL';
  options: string[];
  required: boolean;
  order: number;
  created_at: string;
}

export interface Contact extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE' | 'UNSUBSCRIBED';
  source: 'MANUAL' | 'IMPORT' | 'API' | 'FORM';
  company: Company | null;
  tags: Tag[];
  custom_fields: Record<string, string | number | boolean | null>;
  owner: string | null;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  description: string;
  is_dynamic: boolean;
  filter_criteria: Record<string, unknown>;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  contact: string;
  author: SimpleUser | null;
  content: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}
