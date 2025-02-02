import React from 'react';
import { Search } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import SearchResultItem from './SearchResultItem';
import { AnimatePresence, motion } from 'framer-motion';

const SearchView = () => {
  const { searchQuery, searchResults, setSearchQuery } = useSearch();

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages and chats..."
            className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {searchResults.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {searchResults.map((result) => (
                <SearchResultItem key={result.id} result={result} />
              ))}
            </motion.div>
          ) : searchQuery ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p>No results found</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p>Try searching for messages or chats</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchView; 