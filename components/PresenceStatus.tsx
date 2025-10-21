"use client";
import { usePresence, usePresenceListener } from "@ably/chat/react";

export default function PresenceStatus() {
  usePresence();
  const { presenceData } = usePresenceListener();

  return (
    <div className="p-4 border-b bg-white">
      <strong className="text-green-700">Online: {presenceData.length}</strong>
      <div className="mt-2 flex flex-col gap-1 overflow-x-auto">
        {presenceData.map((member, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-800">{member.clientId}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
