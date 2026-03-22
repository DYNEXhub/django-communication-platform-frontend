/**
 * Contact detail page
 */

'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ContactForm } from '@/components/forms/contact-form';
import { NotesList } from '@/components/contacts/notes-list';
import {
  useContact,
  useUpdateContact,
  useDeleteContact,
  useCompanies,
  useTags,
} from '@/lib/api/hooks/useContacts';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  Edit,
  Trash2,
} from 'lucide-react';

const STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  UNSUBSCRIBED: 'bg-red-100 text-red-800',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ContactDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { contact, isLoading, refetch } = useContact(resolvedParams.id);
  const { companies } = useCompanies();
  const { tags } = useTags();
  const { updateContact, isLoading: updating } = useUpdateContact();
  const { deleteContact, isLoading: deleting } = useDeleteContact();

  const handleUpdateContact = async (data: {
    name?: string;
    email?: string;
    phone?: string;
    company_id?: string | null;
    tag_ids?: string[];
    source?: string;
    status?: string;
  }) => {
    try {
      await updateContact(resolvedParams.id, data);
      setEditDialogOpen(false);
      refetch();
      toast.success('Contact updated successfully');
    } catch (error) {
      toast.error('Failed to update contact');
    }
  };

  const handleDeleteContact = async () => {
    try {
      await deleteContact(resolvedParams.id);
      toast.success('Contact deleted successfully');
      router.push('/contacts');
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  const confirmDelete = () => {
    toast.warning('Are you sure you want to delete this contact?', {
      action: {
        label: 'Delete',
        onClick: handleDeleteContact,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-gray-600">Contact not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {contact.name}
                  </CardTitle>
                  <Badge className={STATUS_COLORS[contact.status]} variant="secondary">
                    {contact.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>

                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}

                {contact.company && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span>{contact.company.name}</span>
                  </div>
                )}

                {contact.source && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Source:</span>
                    <span className="text-sm">{contact.source}</span>
                  </div>
                )}
              </div>

              {contact.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Created {new Date(contact.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <NotesList contactId={resolvedParams.id} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">No recent activity</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          <ContactForm
            contact={contact}
            companies={companies}
            tags={tags}
            onSubmit={handleUpdateContact}
            onCancel={() => setEditDialogOpen(false)}
            isLoading={updating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
