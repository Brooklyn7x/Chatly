import { useState } from "react";
import { Search, UserPlus, UserRound } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loading } from "../ui/loading";
import { toast } from "sonner";
import { useAddNewContact, useSearchUser } from "@/hooks/useContact";
import { User } from "@/types";

interface AddNewContactProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddNewContact = ({ open, onOpenChange }: AddNewContactProps) => {
  const [query, setQuery] = useState("");
  const { users, isLoading } = useSearchUser(query);
  const { addNewContact, isLoading: isAdding } = useAddNewContact();

  const handleAddFoundContact = async (userId: string) => {
    const foundUser = users.find((user: User) => user.id === userId);
    if (!foundUser) return;
    try {
      await addNewContact(foundUser.id);
      toast.success(`Added ${foundUser.username} as a contact`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to add contact");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] h-full pointer-events-auto flex flex-col rounded-xl">
        <DialogHeader className="p-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              Add New Contact
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Search for users or add by email address
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 pb-2">
          <div className="relative">
            <div
              className="absolute left-3 top-3 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            >
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="Search by name or email"
              className="pl-10 h-12 rounded-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {isLoading ? (
            <div className="flex justify-center my-8">
              <Loading />
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-2 mt-2">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Search Results
              </p>
              {users.map((user: User) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/60 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {user.profilePicture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <UserRound className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 rounded-full"
                    onClick={() => handleAddFoundContact(user.id)}
                    disabled={isAdding}
                  >
                    {isAdding ? (
                      <span
                        className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"
                        role="status"
                        aria-label="loading"
                      />
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-1" />
                        <span>Add</span>
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-24 text-center mt-4">
              {query.trim() ? (
                <p className="text-sm text-muted-foreground mb-1">
                  No users found with that name
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Type to search for users
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewContact;
