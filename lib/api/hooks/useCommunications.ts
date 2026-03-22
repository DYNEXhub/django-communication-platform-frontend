"use client";

import { useState, useEffect, useCallback } from "react";
import { get } from "../client";
import type { PaginatedResponse } from "../client";
import type { Channel, EmailMessage } from "../types/communication";

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await get<PaginatedResponse<Channel>>(
        "/communications/channels/"
      );
      setChannels(response.results);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch channels")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  return { channels, loading, error, refetch: fetchChannels };
}

export function useEmailMessages() {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await get<PaginatedResponse<EmailMessage>>(
        "/communications/emails/"
      );
      setMessages(response.results);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch messages")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, refetch: fetchMessages };
}
