/**
 * Draggable deal card for kanban board
 */

"use client";

import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import type { Deal } from "@/lib/api/types/pipeline";
import { Calendar, DollarSign, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface DealCardProps {
  deal: Deal;
  onClick: () => void;
}

export function DealCard({ deal, onClick }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: deal.id,
      data: {
        type: "deal",
        deal,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // Format currency
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency || "USD",
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "WON":
        return "default";
      case "LOST":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none",
        isDragging && "opacity-50 cursor-grabbing"
      )}
      {...listeners}
      {...attributes}
    >
      <Card
        size="sm"
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={(e) => {
          // Prevent click during drag
          if (!isDragging) {
            onClick();
          }
        }}
      >
        <CardContent className="space-y-3">
          {/* Deal name */}
          <div className="font-medium text-sm line-clamp-2">
            {deal.title}
          </div>

          {/* Value */}
          <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
            <DollarSign className="size-4" />
            {formatCurrency(deal.value, deal.currency)}
          </div>

          {/* Probability badge */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {deal.probability}% prob.
            </Badge>
            <Badge variant={getStatusVariant(deal.status)} className="text-xs">
              {deal.status}
            </Badge>
          </div>

          {/* Expected close date */}
          {deal.expected_close_date && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {formatDate(deal.expected_close_date)}
            </div>
          )}

          {/* Owner avatar */}
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <User className="size-4" />
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              Owner: {deal.owner}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
