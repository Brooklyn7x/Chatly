import { Chat } from "@/types";
import { useState } from "react";

interface SearchContentProps {
  chats: Chat[];
  searchQuery: string;
}

export default function SearchContent({
  chats,
  searchQuery,
}: SearchContentProps) {
  return <div>Search Area</div>;
}
