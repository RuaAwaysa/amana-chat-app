"use client";
import { useChatConnection } from "@ably/chat/react";

export default function ConnectionStatus() {
  const { currentStatus } = useChatConnection();
  return (
    <div className="p-4 text-center border bg-gray-100">
      <h2 className="text-lg font-semibold text-blue-500">
        Ably Chat Connection
      </h2>
      <p className="mt-2">Connection: {currentStatus}</p>
    </div>
  );
}
