"use client";

import { useAutomations } from "@/lib/api/hooks/useAutomations";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Play, Clock } from "lucide-react";

const TRIGGER_LABELS: Record<string, string> = {
  CONTACT_CREATED: "Contact Created",
  CONTACT_UPDATED: "Contact Updated",
  DEAL_CREATED: "Deal Created",
  DEAL_STAGE_CHANGED: "Deal Stage Changed",
  DEAL_WON: "Deal Won",
  DEAL_LOST: "Deal Lost",
  EMAIL_RECEIVED: "Email Received",
  EMAIL_OPENED: "Email Opened",
  EMAIL_CLICKED: "Email Clicked",
  FORM_SUBMITTED: "Form Submitted",
  TAG_ADDED: "Tag Added",
  TAG_REMOVED: "Tag Removed",
};

export default function AutomationsPage() {
  const { automations, loading, error } = useAutomations();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading automations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Automations</h1>
        <p className="text-muted-foreground">
          Automate workflows triggered by events
        </p>
      </div>

      {automations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No automations yet</h3>
            <p className="text-sm text-muted-foreground">
              Create automations to trigger actions based on events
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {automations.map((automation) => (
            <Card key={automation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{automation.name}</CardTitle>
                  <Badge variant={automation.is_active ? "default" : "secondary"}>
                    {automation.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {automation.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {automation.description}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Trigger:</span>
                    <span className="font-medium">
                      {TRIGGER_LABELS[automation.trigger_type] || automation.trigger_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Play className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Actions:</span>
                    <span className="font-medium">{automation.actions.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Executions:</span>
                    <span className="font-medium">{automation.execution_count}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
