/**
 * Kanban board page for a specific pipeline
 */

"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  usePipeline,
  useDeals,
  useMoveDeal,
  useCreateDeal,
} from "@/lib/api/hooks/usePipelines";
import { useContacts } from "@/lib/api/hooks/useContacts";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { DealForm } from "@/components/forms/deal-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus } from "lucide-react";
import type { Deal } from "@/lib/api/types/pipeline";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PipelineKanbanPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { pipeline, stages, loading: pipelineLoading } = usePipeline(resolvedParams.id);
  const { deals, loading: dealsLoading, refetch: refetchDeals } = useDeals({
    pipeline: resolvedParams.id,
  });
  const { moveDeal } = useMoveDeal();
  const { createDeal, loading: isCreating } = useCreateDeal();

  const { contacts } = useContacts();
  const [showDealForm, setShowDealForm] = useState(false);

  const handleDealMove = async (dealId: string, newStageId: string) => {
    await moveDeal(dealId, newStageId);
    refetchDeals();
  };

  const handleDealClick = (dealId: string) => {
    router.push(`/deals/${dealId}`);
  };

  const handleCreateDeal = async (dealData: Partial<Deal>) => {
    const newDeal = await createDeal({
      ...dealData,
      pipeline: resolvedParams.id,
    });

    if (newDeal) {
      setShowDealForm(false);
      refetchDeals();
    }
  };

  if (pipelineLoading || dealsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!pipeline) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Pipeline not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/pipelines")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {pipeline.name}
            </h1>
            {pipeline.description && (
              <p className="text-sm text-muted-foreground">
                {pipeline.description}
              </p>
            )}
          </div>
        </div>
        <Button onClick={() => setShowDealForm(true)}>
          <Plus className="mr-2 size-4" />
          Add Deal
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        {stages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p>No stages configured for this pipeline</p>
              <p className="text-sm mt-2">
                Add stages to start organizing your deals
              </p>
            </div>
          </div>
        ) : (
          <KanbanBoard
            stages={stages}
            deals={deals}
            onDealMove={handleDealMove}
            onDealClick={handleDealClick}
          />
        )}
      </div>

      {/* Create Deal Dialog */}
      <Dialog open={showDealForm} onOpenChange={setShowDealForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Deal</DialogTitle>
          </DialogHeader>
          <DealForm
            stages={stages}
            contacts={contacts}
            onSubmit={handleCreateDeal}
            onCancel={() => setShowDealForm(false)}
            isSubmitting={isCreating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
