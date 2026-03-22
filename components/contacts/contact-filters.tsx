'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Company, Tag } from '@/lib/api/types';

interface ContactFiltersProps {
  companies: Company[];
  tags: Tag[];
  onFilterChange: (filters: {
    status?: string;
    company?: string;
    tags?: string;
  }) => void;
}

export function ContactFilters({
  companies,
  tags,
  onFilterChange,
}: ContactFiltersProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');

  const handleStatusChange = (status: string) => {
    const newStatus = status === 'all' ? '' : status;
    setSelectedStatus(newStatus);
    onFilterChange({
      status: newStatus || undefined,
      company: selectedCompany || undefined,
      tags: tagsInput || undefined,
    });
  };

  const handleCompanyChange = (companyId: string) => {
    const newCompany = companyId === 'all' ? '' : companyId;
    setSelectedCompany(newCompany);
    onFilterChange({
      status: selectedStatus || undefined,
      company: newCompany || undefined,
      tags: tagsInput || undefined,
    });
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    onFilterChange({
      status: selectedStatus || undefined,
      company: selectedCompany || undefined,
      tags: value || undefined,
    });
  };

  const handleClearFilters = () => {
    setSelectedStatus('');
    setSelectedCompany('');
    setTagsInput('');
    onFilterChange({});
  };

  const hasActiveFilters = selectedStatus || selectedCompany || tagsInput;

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card text-card-foreground">
      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">Status:</label>
        <select
          value={selectedStatus || 'all'}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-3 py-1.5 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="UNSUBSCRIBED">Unsubscribed</option>
        </select>
      </div>

      {/* Company Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">Company:</label>
        <select
          value={selectedCompany || 'all'}
          onChange={(e) => handleCompanyChange(e.target.value)}
          className="px-3 py-1.5 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">Tags:</label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder="Filter by tag name..."
          className="px-3 py-1.5 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-48"
        />
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          className="ml-2"
        >
          Clear filters
        </Button>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 ml-auto">
          {selectedStatus && (
            <Badge variant="secondary" className="text-xs">
              Status: {selectedStatus}
            </Badge>
          )}
          {selectedCompany && (
            <Badge variant="secondary" className="text-xs">
              Company: {companies.find((c) => c.id === selectedCompany)?.name}
            </Badge>
          )}
          {tagsInput && (
            <Badge variant="secondary" className="text-xs">
              Tags: {tagsInput}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
