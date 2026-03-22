/**
 * Kanban column component with droppable area
 */

"use client";

import { useDroppable } from "@dnd-kit/core";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DealCard } from "./deal-card";
import type { PipelineStage, Deal } from "@/lib/api/types/pipeline";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  stage: PipelineStage;
  deals: Deal[];
  onDealClick: (dealId: string) => void;
}

export function KanbanColumn({ stage, deals, onDealClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
    data: {
      type: "stage",
      stage,
    },
  });

  // Calculate total value of deals in this stage
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="flex flex-col min-w-[280px] w-[280px] h-full">
      <Card
        className={cn(
          "flex flex-col h-full transition-colors",
          isOver && "ring-2 ring-primary"
        )}
      >
        {/* Stage header */}
        <CardHeader className="border-b">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-sm font-semibold">
                {stage.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {deals.length} {deals.length === 1 ? "deal" : "deals"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(totalValue)}
                </span>
              </div>
            </div>
            {/* Stage probability indicator */}
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full bg-primary"
                style={{
                  opacity: stage.probability / 100,
                }}
              />
              <span className="text-xs text-muted-foreground">
                {stage.probability}%
              </span>
            </div>
          </div>
        </CardHeader>

        {/* Droppable area with deals */}
        <CardContent
          ref={setNodeRef}
          className="flex-1 overflow-y-auto min-h-[200px]"
        >
          <div className="space-y-2">
            {deals.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                No deals in this stage
              </div>
            ) : (
              deals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onClick={() => onDealClick(deal.id)}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
