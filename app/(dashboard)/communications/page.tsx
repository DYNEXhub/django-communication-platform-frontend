"use client";

import { useChannels, useEmailMessages } from "@/lib/api/hooks/useCommunications";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, Phone, Hash } from "lucide-react";

const CHANNEL_ICON: Record<string, typeof Mail> = {
  EMAIL: Mail,
  SMS: Phone,
  WHATSAPP: MessageSquare,
};

export default function CommunicationsPage() {
  const { channels, loading: channelsLoading, error: channelsError } = useChannels();
  const { messages, loading: messagesLoading } = useEmailMessages();

  if (channelsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading communications...</div>
      </div>
    );
  }

  if (channelsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Error: {channelsError.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Communications</h1>
        <p className="text-muted-foreground">
          Manage your communication channels and messages
        </p>
      </div>

      {/* Channels */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Channels</h2>
        {channels.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No channels configured</h3>
              <p className="text-sm text-muted-foreground">
                Set up email, SMS, or WhatsApp channels to start communicating
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => {
              const Icon = CHANNEL_ICON[channel.type] || Hash;
              return (
                <Card key={channel.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="size-5 text-muted-foreground" />
                        <CardTitle className="text-base">{channel.name}</CardTitle>
                      </div>
                      <Badge variant={channel.is_active ? "default" : "secondary"}>
                        {channel.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Type: {channel.type}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Messages */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Emails</h2>
        {messagesLoading ? (
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        ) : messages.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No email messages yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {messages.slice(0, 10).map((msg) => (
              <Card key={msg.id}>
                <CardContent className="flex items-center justify-between py-3 px-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs shrink-0">
                        {msg.direction}
                      </Badge>
                      <p className="text-sm font-medium truncate">{msg.subject}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {msg.from_email} → {msg.to_email}
                    </p>
                  </div>
                  <Badge variant={msg.status === "DELIVERED" ? "default" : "secondary"} className="text-xs ml-2 shrink-0">
                    {msg.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
