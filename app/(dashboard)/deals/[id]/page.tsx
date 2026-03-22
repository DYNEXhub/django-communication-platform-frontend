/**
 * Deal detail page
 */

"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  useDeal,
  useUpdateDeal,
  useInteractions,
} from "@/lib/api/hooks/usePipelines";
import { usePipeline } from "@/lib/api/hooks/usePipelines";
import { DealForm } from "@/components/forms/deal-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Edit,
  DollarSign,
  Calendar,
  User,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { Contact } from "@/lib/api/types/contact";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DealDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { deal, loading, refetch } = useDeal(resolvedParams.id);
  const { updateDeal, loading: isUpdating } = useUpdateDeal();
  const { interactions, loading: interactionsLoading } = useInteractions(
    resolvedParams.id
  );
  const { pipeline, stages } = usePipeline(deal?.pipeline || null);

  const [showEditForm, setShowEditForm] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]); // TODO: Fetch from API

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading deal...</div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Deal not found</div>
      </div>
    );
  }

  const handleUpdateDeal = async (dealData: Partial<typeof deal>) => {
    const updated = await updateDeal(deal.id, dealData);
    if (updated) {
      setShowEditForm(false);
      refetch();
    }
  };

  const handleMarkAsWon = async () => {
    await updateDeal(deal.id, {
      status: "WON",
      closed_at: new Date().toISOString(),
    });
    refetch();
  };

  const handleMarkAsLost = async () => {
    await updateDeal(deal.id, {
      status: "LOST",
      closed_at: new Date().toISOString(),
    });
    refetch();
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency || "USD",
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WON":
        return "default";
      case "LOST":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const currentStage = stages.find((s) => s.id === deal.stage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{deal.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStatusColor(deal.status)}>
                {deal.status}
              </Badge>
              {currentStage && (
                <span className="text-sm text-muted-foreground">
                  {currentStage.name}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {deal.status === "OPEN" && (
            <>
              <Button variant="outline" onClick={handleMarkAsLost}>
                <XCircle className="mr-2 size-4" />
                Mark as Lost
              </Button>
              <Button onClick={handleMarkAsWon}>
                <CheckCircle className="mr-2 size-4" />
                Mark as Won
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => setShowEditForm(true)}>
            <Edit className="mr-2 size-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Deal Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="size-4" />
                Value
              </span>
              <span className="font-semibold">
                {formatCurrency(deal.value, deal.currency)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="size-4" />
                Probability
              </span>
              <span className="font-medium">{deal.probability}%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="size-4" />
                Expected Close
              </span>
              <span className="text-sm">
                {formatDate(deal.expected_close_date)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="size-4" />
                Owner
              </span>
              <span className="text-sm">{deal.owner}</span>
            </div>

            {deal.description && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Description
                </p>
                <p className="text-sm">{deal.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Contact ID: {deal.contact}
            </p>
            {/* TODO: Fetch and display full contact details */}
          </CardContent>
        </Card>
      </div>

      {/* Interactions Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          {interactionsLoading ? (
            <div className="text-sm text-muted-foreground">
              Loading interactions...
            </div>
          ) : interactions.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No interactions recorded yet
            </div>
          ) : (
            <div className="space-y-4">
              {interactions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {interaction.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(interaction.date)}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm">{interaction.subject}</h4>
                    {interaction.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {interaction.description}
                      </p>
                    )}
                    {interaction.outcome && (
                      <p className="text-sm mt-2">
                        <span className="font-medium">Outcome:</span>{" "}
                        {interaction.outcome}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Deal Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          <DealForm
            deal={deal}
            stages={stages}
            contacts={contacts}
            onSubmit={handleUpdateDeal}
            onCancel={() => setShowEditForm(false)}
            isSubmitting={isUpdating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
