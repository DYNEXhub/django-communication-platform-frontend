/**
 * Contact list page with filters and export
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, type ColumnDef } from '@/components/data-table/data-table';
import { ContactForm } from '@/components/forms/contact-form';
import { ContactFilters } from '@/components/contacts/contact-filters';
import {
  useContacts,
  useCreateContact,
  useCompanies,
  useTags,
  useExportContacts,
} from '@/lib/api/hooks/useContacts';
import type { Contact } from '@/lib/api/types';
import { Plus, Download, Upload } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  UNSUBSCRIBED: 'bg-red-100 text-red-800',
};

export default function ContactsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filters, setFilters] = useState<{
    status?: string;
    company?: string;
    tags?: string;
  }>({});

  const pageSize = 20;

  const { contacts, total, isLoading, refetch } = useContacts({
    search: searchQuery,
    status: filters.status,
    company: filters.company,
    tags: filters.tags,
    page,
    pageSize,
  });

  const { companies } = useCompanies();
  const { tags } = useTags();
  const { createContact, isLoading: creating } = useCreateContact();
  const { exportContacts, isLoading: exporting } = useExportContacts();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowClick = (contact: Contact) => {
    router.push(`/contacts/${contact.id}`);
  };

  const handleCreateContact = async (data: {
    name: string;
    email: string;
    phone?: string;
    company_id?: string | null;
    tag_ids?: string[];
    source?: string;
    status?: string;
  }) => {
    try {
      await createContact(data);
      setCreateDialogOpen(false);
      refetch();
      toast.success('Contact created successfully');
    } catch {
      toast.error('Failed to create contact');
    }
  };

  const handleExport = async () => {
    try {
      await exportContacts();
      toast.success('Contacts exported successfully');
    } catch {
      toast.error('Failed to export contacts');
    }
  };

  const handleFilterChange = (newFilters: {
    status?: string;
    company?: string;
    tags?: string;
  }) => {
    setFilters(newFilters);
    setPage(1);
  };

  const columns: ColumnDef<Contact>[] = [
    {
      header: 'Name',
      cell: (row) => <div className="font-medium">{row.name}</div>,
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Phone',
      cell: (row) => row.phone || '-',
    },
    {
      header: 'Company',
      cell: (row) => {
        if (!row.company) return '-';
        if (typeof row.company === 'object') return (row.company as { name: string }).name;
        return String(row.company);
      },
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge className={STATUS_COLORS[row.status] || 'bg-gray-100'} variant="secondary">
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Tags',
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag.id}
              style={{ backgroundColor: tag.color }}
              className="text-xs text-white"
            >
              {tag.name}
            </Badge>
          ))}
          {row.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{row.tags.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your contacts and leads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/contacts/import')}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      <ContactFilters
        companies={companies}
        tags={tags}
        onFilterChange={handleFilterChange}
      />

      <DataTable
        data={contacts}
        columns={columns}
        searchKey="search"
        searchPlaceholder="Search by name or email..."
        isLoading={isLoading}
        pagination={{
          page,
          pageSize,
          total,
        }}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onRowClick={handleRowClick}
      />

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Contact</DialogTitle>
          </DialogHeader>
          <ContactForm
            companies={companies}
            tags={tags}
            onSubmit={handleCreateContact}
            onCancel={() => setCreateDialogOpen(false)}
            isLoading={creating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
