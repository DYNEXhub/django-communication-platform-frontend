"use client";

import { useCampaigns } from "@/lib/api/hooks/useCampaigns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Mail, MessageSquare, Send } from "lucide-react";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  COMPLETED: "default",
  RUNNING: "default",
  DRAFT: "secondary",
  SCHEDULED: "outline",
  PAUSED: "outline",
  CANCELLED: "destructive",
};

export default function CampaignsPage() {
  const { campaigns, loading, error } = useCampaigns();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading campaigns...</div>
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
        <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
        <p className="text-muted-foreground">
          Manage your marketing campaigns
        </p>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Megaphone className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
            <p className="text-sm text-muted-foreground">
              Create your first campaign to start reaching contacts
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{campaign.name}</CardTitle>
                  <Badge variant={STATUS_VARIANT[campaign.status] || "secondary"}>
                    {campaign.status}
                  </Badge>
                </div>
                {campaign.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {campaign.description}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Send className="size-4" />
                      Recipients
                    </span>
                    <span className="font-medium">{campaign.total_recipients}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Mail className="size-4" />
                      Sent
                    </span>
                    <span className="font-medium">{campaign.sent_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="size-4" />
                      Opened
                    </span>
                    <span className="font-medium">
                      {campaign.total_recipients > 0
                        ? `${Math.round((campaign.opened_count / campaign.total_recipients) * 100)}%`
                        : "0%"}
                    </span>
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
