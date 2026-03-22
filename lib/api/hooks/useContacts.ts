/**
 * React hooks for contacts API
 */

import { useState, useEffect, useCallback } from 'react';
import { get, post, patch, del } from '../client';
import type { PaginatedResponse } from '../client';
import type { Contact, Company, Tag, Note } from '../types';

// ─── Contacts ────────────────────────────────────────────

interface UseContactsParams {
  search?: string;
  status?: string;
  company?: string;
  tags?: string;
  page?: number;
  pageSize?: number;
}

interface UseContactsReturn {
  contacts: Contact[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useContacts(params?: UseContactsParams): UseContactsReturn {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams: Record<string, string> = {};

      if (params?.search) queryParams.search = params.search;
      if (params?.status) queryParams.status = params.status;
      if (params?.company) queryParams.company = params.company;
      if (params?.tags) queryParams.tags = params.tags;
      if (params?.page) queryParams.page = String(params.page);
      if (params?.pageSize) queryParams.page_size = String(params.pageSize);

      const response = await get<PaginatedResponse<Contact>>(
        '/contacts/contacts/',
        queryParams
      );

      setContacts(response.results);
      setTotal(response.count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch contacts'));
    } finally {
      setIsLoading(false);
    }
  }, [params?.search, params?.status, params?.company, params?.tags, params?.page, params?.pageSize]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return { contacts, total, isLoading, error, refetch: fetchContacts };
}

// ─── Single Contact ──────────────────────────────────────

interface UseContactReturn {
  contact: Contact | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useContact(id: string | undefined): UseContactReturn {
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContact = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await get<Contact>(`/contacts/contacts/${id}/`);
      setContact(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch contact'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  return { contact, isLoading, error, refetch: fetchContact };
}

// ─── Create Contact ──────────────────────────────────────

interface CreateContactData {
  name: string;
  email: string;
  phone?: string;
  company_id?: string | null;
  tag_ids?: string[];
  source?: string;
  status?: string;
}

interface UseCreateContactReturn {
  createContact: (data: CreateContactData) => Promise<Contact>;
  isLoading: boolean;
  error: Error | null;
}

export function useCreateContact(): UseCreateContactReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createContact = async (data: CreateContactData): Promise<Contact> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await post<Contact, CreateContactData>(
        '/contacts/contacts/',
        data
      );
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create contact');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createContact, isLoading, error };
}

// ─── Update Contact ──────────────────────────────────────

interface UpdateContactData {
  name?: string;
  email?: string;
  phone?: string;
  company_id?: string | null;
  tag_ids?: string[];
  source?: string;
  status?: string;
}

interface UseUpdateContactReturn {
  updateContact: (id: string, data: UpdateContactData) => Promise<Contact>;
  isLoading: boolean;
  error: Error | null;
}

export function useUpdateContact(): UseUpdateContactReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateContact = async (id: string, data: UpdateContactData): Promise<Contact> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await patch<Contact, UpdateContactData>(
        `/contacts/contacts/${id}/`,
        data
      );
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update contact');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateContact, isLoading, error };
}

// ─── Delete Contact ──────────────────────────────────────

interface UseDeleteContactReturn {
  deleteContact: (id: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function useDeleteContact(): UseDeleteContactReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteContact = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await del(`/contacts/contacts/${id}/`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete contact');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteContact, isLoading, error };
}

// ─── Companies ───────────────────────────────────────────

interface UseCompaniesParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

interface UseCompaniesReturn {
  companies: Company[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCompanies(params?: UseCompaniesParams): UseCompaniesReturn {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams: Record<string, string> = {};
      if (params?.search) queryParams.search = params.search;
      if (params?.page) queryParams.page = String(params.page);
      if (params?.pageSize) queryParams.page_size = String(params.pageSize);

      const response = await get<PaginatedResponse<Company>>(
        '/contacts/companies/',
        queryParams
      );
      setCompanies(response.results);
      setTotal(response.count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch companies'));
    } finally {
      setIsLoading(false);
    }
  }, [params?.search, params?.page, params?.pageSize]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return { companies, total, isLoading, error, refetch: fetchCompanies };
}

// ─── Single Company ──────────────────────────────────────

interface UseCompanyReturn {
  company: Company | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCompany(id: string | undefined): UseCompanyReturn {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompany = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await get<Company>(`/contacts/companies/${id}/`);
      setCompany(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch company'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  return { company, isLoading, error, refetch: fetchCompany };
}

// ─── Create/Update/Delete Company ────────────────────────

interface CompanyData {
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
}

export function useCreateCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCompany = async (data: CompanyData): Promise<Company> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await post<Company, CompanyData>('/contacts/companies/', data);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create company');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCompany, isLoading, error };
}

export function useUpdateCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateCompany = async (id: string, data: Partial<CompanyData>): Promise<Company> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await patch<Company, Partial<CompanyData>>(
        `/contacts/companies/${id}/`,
        data
      );
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update company');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateCompany, isLoading, error };
}

export function useDeleteCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteCompany = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await del(`/contacts/companies/${id}/`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete company');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteCompany, isLoading, error };
}

// ─── Tags ────────────────────────────────────────────────

interface UseTagsReturn {
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await get<PaginatedResponse<Tag>>('/contacts/tags/');
      setTags(response.results);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tags'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return { tags, isLoading, error, refetch: fetchTags };
}

// ─── Notes ───────────────────────────────────────────────

interface UseNotesReturn {
  notes: Note[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useNotes(contactId: string | undefined): UseNotesReturn {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!contactId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await get<PaginatedResponse<Note>>(
        '/contacts/notes/',
        { contact: contactId }
      );
      setNotes(response.results);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch notes'));
    } finally {
      setIsLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { notes, isLoading, error, refetch: fetchNotes };
}

interface CreateNoteData {
  contact: string;
  content: string;
}

export function useCreateNote() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createNote = async (data: CreateNoteData): Promise<Note> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await post<Note, CreateNoteData>('/contacts/notes/', data);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create note');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createNote, isLoading, error };
}

export function useToggleNotePin() {
  const [isLoading, setIsLoading] = useState(false);

  const togglePin = async (noteId: string): Promise<Note> => {
    setIsLoading(true);
    try {
      const response = await post<Note>(`/contacts/notes/${noteId}/toggle_pin/`);
      return response;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to toggle pin');
    } finally {
      setIsLoading(false);
    }
  };

  return { togglePin, isLoading };
}

export function useDeleteNote() {
  const [isLoading, setIsLoading] = useState(false);

  const deleteNote = async (noteId: string): Promise<void> => {
    setIsLoading(true);
    try {
      await del(`/contacts/notes/${noteId}/`);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete note');
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteNote, isLoading };
}

// ─── CSV Import ──────────────────────────────────────────

interface ImportResult {
  created: number;
  errors: string[];
}

export function useImportContacts() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const importContacts = async (file: File, hasHeader: boolean = true): Promise<ImportResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('has_header', String(hasHeader));

      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const token = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('auth-store') || '{}')?.state?.accessToken
        : null;

      const response = await fetch(`${BASE_URL}/contacts/contacts/import_contacts/`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Import failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to import contacts');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { importContacts, isLoading, error };
}

// ─── CSV Export ──────────────────────────────────────────

export function useExportContacts() {
  const [isLoading, setIsLoading] = useState(false);

  const exportContacts = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const token = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('auth-store') || '{}')?.state?.accessToken
        : null;

      const response = await fetch(`${BASE_URL}/contacts/contacts/export_contacts/`, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contacts.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to export contacts');
    } finally {
      setIsLoading(false);
    }
  };

  return { exportContacts, isLoading };
}
