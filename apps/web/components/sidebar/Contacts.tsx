"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useFetchContacts } from "@/hooks/useContact";
import { Contact } from "@/types";
import { UserAvatar } from "../shared/UserAvatar";

const ContactPage = ({ onClose }: { onClose: () => void }) => {
  const { contacts, error, isLoading } = useFetchContacts();
  return (
    <div className="fixed inset-0 overflow-y-auto bg-secondary/30">
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl text-center font-semibold">Contacts</h2>
          <Button
            variant="ghost"
            size={"icon"}
            onClick={onClose}
            className="rounded-full border"
          >
            ✕
          </Button>
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              {contacts.map((contact: Contact) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
