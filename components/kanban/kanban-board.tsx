/**
 * Kanban board with drag-and-drop functionality
 */

"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "./kanban-column";
import { DealCard } from "./deal-card";
import type { PipelineStage, Deal } from "@/lib/api/types/pipeline";

interface KanbanBoardProps {
  stages: PipelineStage[];
  deals: Deal[];
  onDealMove: (dealId: string, newStageId: string) => void;
  onDealClick: (dealId: string) => void;
}

export function KanbanBoard({
  stages,
  deals,
  onDealMove,
  onDealClick,
}: KanbanBoardProps) {
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const deal = active.data.current?.deal as Deal | undefined;
    if (deal) {
      setActiveDeal(deal);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveDeal(null);

    if (!over) return;

    const dealId = active.id as string;
    const newStageId = over.id as string;

    // Get the deal's current stage
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    // Only move if the stage actually changed
    if (deal.stage !== newStageId) {
      onDealMove(dealId, newStageId);
    }
  };

  const handleDragCancel = () => {
    setActiveDeal(null);
  };

  // Group deals by stage
  const dealsByStage = stages.reduce(
    (acc, stage) => {
      acc[stage.id] = deals.filter((deal) => deal.stage === stage.id);
      return acc;
    },
    {} as Record<string, Deal[]>
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            deals={dealsByStage[stage.id] || []}
            onDealClick={onDealClick}
          />
        ))}
      </div>

      {/* Drag overlay for visual feedback */}
      <DragOverlay>
        {activeDeal ? (
          <div className="rotate-3 opacity-90">
            <DealCard deal={activeDeal} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
