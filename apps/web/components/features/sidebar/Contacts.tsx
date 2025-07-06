"use client";

import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useFetchContacts } from "@/hooks/user/useContact";
import useChat from "@/hooks/useChat";

import AddNewContact from "./AddNewContact";

interface ContactsProps {
  onClose: () => void;
}

export default function Contacts({ onClose }: ContactsProps) {
  const { setActiveChat } = useChat();

  const { contacts, isLoading, error } = useFetchContacts();
  const [localModal, setLocalModal] = useState(false); // local "add-contact" sheet

  /* ------------------------------ Memo Helpers ----------------------------- */
  const empty = useMemo(
    () => !isLoading && contacts.length === 0,
    [isLoading, contacts]
  );

  /* -------------------------------- UI ------------------------------------ */
  return (
    <>
      {/* Overlay */}
      <div className="absolute inset-0 overflow-y-auto bg-card">
        {/* Header */}
        <header className="flex items-center gap-4 p-4 border-b">
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold">Contacts</h2>
        </header>

        {/* Body */}
        <div className="h-[calc(100vh-100px)] flex flex-col p-4 space-y-6">
          {/* Scrollable contacts list */}
          <Card className="flex-1 border-none overflow-y-auto">
            <CardContent className="p-6 space-y-4">
              {/* Loading  */}
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-md" />
                ))}

              {/* Error  */}
              {error && (
                <p className="text-center text-destructive">{error.message}</p>
              )}

              {/* Empty  */}
              {empty && (
                <p className="text-center text-muted-foreground">
                  No contacts yet – add someone!
                </p>
              )}

              {/* List  */}
              {contacts.map((c: any, i: number) => (
                <ContactCard
                  key={i}
                  contact={c}
                  onMessage={() => setActiveChat(c._id)}
                />
              ))}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="pt-2">
            <Button className="w-full" onClick={() => setLocalModal(true)}>
              Add New Contact
            </Button>
          </div>
        </div>
      </div>

      {/* Add-Contact sheet (local) */}
      {localModal && (
        <AddNewContact open={localModal} onClose={() => setLocalModal(false)} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Sub-Component                               */
/* -------------------------------------------------------------------------- */

import { Contact } from "@/types";
import { UserAvatar } from "@/components/common/UserAvatar";

interface ContactCardProps {
  contact: Contact;
  onMessage: () => void;
}

function ContactCard({ contact, onMessage }: ContactCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors bg-background">
      <UserAvatar
        url={contact.profilePicture}
        alt={contact.username}
        size="md"
        className="flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{contact.username}</p>
        <p className="text-sm text-muted-foreground truncate">
          {contact.email}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onMessage}>
        Message
      </Button>
    </div>
  );
}
