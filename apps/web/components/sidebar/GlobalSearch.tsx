"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, SearchIcon, X } from "lucide-react";
import { SearchInput } from "../shared/SearchInput";

type SearchTab = "all" | "messages" | "media" | "files" | "users";

export const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [isOpen, setIsOpen] = useState(false);
  //   const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="inset-0 z-50">
      {/* <div className="flex items-center gap-4 w-full">
        <button
          onClick={onBack}
          className={`p-2 border borderflex items-center justify-center text-muted-foreground rounded-full transition-all duration-300 ease-in-out
        }`}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
        />
      </div> */}
      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              className="w-[800px] h-[600px] bg-telegram-bg rounded-lg 
              mx-auto mt-20"
            >
              search
              {/* Search Header */}
              <div className="p-4 border-b border-telegram-border flex items-center">
                <SearchIcon className="w-5 h-5 text-telegram-text-secondary mr-2" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search messages, files and users..."
                  className="flex-1 bg-transparent text-white outline-none"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-telegram-hover rounded-full"
                >
                  <X className="w-5 h-5 text-telegram-text-secondary" />
                </button>
              </div>
              
              {/* Search Tabs */}
              {/* <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} /> */}

              {/* Search Results */}
              <div className="h-[calc(100%-120px)] overflow-y-auto">
                {/* <SearchResults query={debouncedQuery} tab={activeTab} /> */}
                ass
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
