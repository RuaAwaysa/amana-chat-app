"use client";

import { useState, useEffect } from "react";
import * as Ably from "ably";
import { ChatClient, LogLevel } from "@ably/chat";
import { AblyProvider } from "ably/react";
import { ChatClientProvider } from "@ably/chat/react";

export default function AblyClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [clients, setClients] = useState<{
    realtime: Ably.Realtime;
    chat: ChatClient;
  } | null>(null);

  useEffect(() => {
    const ablyKey = process.env.NEXT_PUBLIC_ABLY_API_KEY;
    if (!ablyKey) {
      console.error("Missing NEXT_PUBLIC_ABLY_API_KEY environment variable");
      return;
    }

    // Create the Ably Realtime client
    const realtimeClient = new Ably.Realtime({
      key: ablyKey,
      clientId: `chat-user-${Math.random().toString(36).substring(7)}`,
    });

    // Create the Chat client
    const chatClient = new ChatClient(realtimeClient, {
      logLevel: LogLevel.Info,
    });

    setClients({ realtime: realtimeClient, chat: chatClient });

    // Cleanup on unmount
    return () => {
      realtimeClient.close();
    };
  }, []);

  // Don't render anything until clients are initialized
  if (!clients) return null;

  return (
    <AblyProvider client={clients.realtime}>
      <ChatClientProvider client={clients.chat}>{children}</ChatClientProvider>
    </AblyProvider>
  );
}