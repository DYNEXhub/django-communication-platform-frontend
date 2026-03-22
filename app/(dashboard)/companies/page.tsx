/**
 * Companies list page
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, type ColumnDef } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CompanyForm } from '@/components/forms/company-form';
import { useCompanies, useCreateCompany } from '@/lib/api/hooks/useContacts';
import type { Company } from '@/lib/api/types';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function CompaniesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { companies, total, isLoading, refetch } = useCompanies({
    search: searchQuery,
    page,
    pageSize,
  });
  const { createCompany, isLoading: isCreating } = useCreateCompany();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleCreate = async (data: {
    name: string;
    domain?: string;
    industry?: string;
    size?: string;
  }) => {
    try {
      await createCompany(data);
      toast.success('Company created successfully');
      setIsCreateDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create company');
    }
  };

  const columns: ColumnDef<Company>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      className: 'font-medium',
    },
    {
      header: 'Domain',
      cell: (row) =>
        row.domain ? (
          <a
            href={`https://${row.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {row.domain}
          </a>
        ) : (
          '-'
        ),
    },
    {
      header: 'Industry',
      cell: (row) => row.industry || '-',
    },
    {
      header: 'Size',
      cell: (row) => row.size || '-',
    },
    {
      header: 'Contacts',
      cell: (row) => row.contact_count || 0,
      className: 'text-center',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-gray-600 mt-1">Manage your company directory</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Company
        </Button>
      </div>

      <DataTable
        data={companies}
        columns={columns}
        searchKey="search"
        searchPlaceholder="Search by name, domain, or industry..."
        isLoading={isLoading}
        onSearch={handleSearch}
        onRowClick={(company) => router.push(`/companies/${company.id}`)}
        pagination={{
          page,
          pageSize,
          total,
        }}
        onPageChange={setPage}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Company</DialogTitle>
          </DialogHeader>
          <CompanyForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
