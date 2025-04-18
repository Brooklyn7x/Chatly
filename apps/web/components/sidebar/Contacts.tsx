"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useFetchContacts } from "@/hooks/user/useContact";
import { Contact } from "@/types";
import { UserAvatar } from "../common/UserAvatar";
import AddNewContact from "../sidebar/AddNewContact";

interface ContactPageProps {
  onClose: () => void;
}

const Contacts = ({ onClose }: ContactPageProps) => {
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const { contacts, isLoading, error } = useFetchContacts();

  // if (isLoading) {
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-secondary/30">
  //       Loading...
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-secondary/30">
  //       Error: {error.message}
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="absolute inset-0 overflow-y-auto bg-card">
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-center font-semibold">Contacts</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full border"
            >
              ✕
            </Button>
          </div>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    No contacts found.
                  </div>
                ) : (
                  contacts.map((contact: Contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center gap-4 p-4 hover:bg-secondary/50 rounded-lg transition-colors border"
                    >
                      <UserAvatar url={contact.profilePicture} />
                      <div className="flex-1">
                        <h3 className="font-medium">{contact.username}</h3>
                        <p className="text-sm text-muted-foreground">
                          {contact.email}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Message
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6">
                <Button
                  className="w-full"
                  onClick={() => setIsAddContactOpen(true)}
                >
                  Add New Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddNewContact
        open={isAddContactOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setIsAddContactOpen(false);
          }
        }}
      />
    </>
  );
};

export default Contacts;
