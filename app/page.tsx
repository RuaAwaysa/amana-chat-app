'use client'; // Mark this as a client component

import React from 'react';
import { AblyProvider } from 'ably/react';
import * as Ably from 'ably';
import Chat from '../componenets/chat'; // Corrected path assuming you rename 'componenets' to 'components'

/**
 * NOTE: A top-level Ably clien
 * t instance is created here.
 * This will be shared across all users on the same server instance.
 * In a real-world application, you would likely want to use Ably's token authentication
 * to provide unique capabilities and client IDs for each user.
 * For this simple chat app, a single client with a random ID is sufficient.
 */
const ablyClient = new Ably.Realtime({
  // This key is public and safe to use in client-side code.
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
  // Every user connecting will get a random ID.
  clientId: `chat-user-${Math.random().toString(36).substring(7)}`,
  autoConnect: true,
});

/**
 * This is the root page component for the `/` route.
 * It wraps the Chat component with the AblyProvider to make the Ably client
 * available to all child components via React's context.
 */
export default function Page() {
  return (
    <AblyProvider client={ablyClient}>
      <Chat />
    </AblyProvider>
  );
}
