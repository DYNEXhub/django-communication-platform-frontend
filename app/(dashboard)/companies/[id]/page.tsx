/**
 * Company detail page - view and manage single company
 */

'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CompanyForm } from '@/components/forms/company-form';
import { DataTable, type ColumnDef } from '@/components/data-table/data-table';
import {
  useCompany,
  useUpdateCompany,
  useDeleteCompany,
  useContacts,
} from '@/lib/api/hooks/useContacts';
import type { Contact } from '@/lib/api/types';
import { Building2, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

interface CompanyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { company, isLoading, refetch } = useCompany(resolvedParams.id);
  const { contacts, isLoading: contactsLoading } = useContacts({
    company: resolvedParams.id,
  });
  const { updateCompany, isLoading: isUpdating } = useUpdateCompany();
  const { deleteCompany, isLoading: isDeleting } = useDeleteCompany();

  const handleUpdate = async (data: {
    name: string;
    domain?: string;
    industry?: string;
    size?: string;
  }) => {
    try {
      await updateCompany(resolvedParams.id, data);
      toast.success('Company updated successfully');
      setIsEditDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update company');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCompany(resolvedParams.id);
      toast.success('Company deleted successfully');
      router.push('/companies');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete company');
    }
  };

  const contactColumns: ColumnDef<Contact>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      className: 'font-medium',
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
      header: 'Status',
      cell: (row) => (
        <Badge
          variant={
            row.status === 'ACTIVE'
              ? 'default'
              : row.status === 'INACTIVE'
              ? 'secondary'
              : 'destructive'
          }
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading company...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Company not found</h2>
          <Button onClick={() => router.push('/companies')}>Back to Companies</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <p className="text-gray-600 mt-1">
              {company.contact_count} {company.contact_count === 1 ? 'contact' : 'contacts'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Domain</p>
            <p className="font-medium">{company.domain || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Industry</p>
            <p className="font-medium">{company.industry || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Size</p>
            <p className="font-medium">{company.size || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Owner</p>
            <p className="font-medium">{company.owner?.username || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="font-medium">{formatDate(company.created_at)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium">{formatDate(company.updated_at)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Contacts ({company.contact_count})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={contacts}
            columns={contactColumns}
            isLoading={contactsLoading}
            onRowClick={(contact) => router.push(`/contacts/${contact.id}`)}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          <CompanyForm
            company={company}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
            isLoading={isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <strong>{company.name}</strong>? This action cannot be
              undone.
            </p>
            {company.contact_count > 0 && (
              <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
                Warning: This company has {company.contact_count}{' '}
                {company.contact_count === 1 ? 'contact' : 'contacts'}. Deleting the company will
                not delete the contacts, but they will no longer be associated with this company.
              </p>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete Company'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
