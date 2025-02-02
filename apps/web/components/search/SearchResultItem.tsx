import React from 'react';
import { Avatar } from '../ui/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface SearchResultItemProps {
  result: {
    id: string;
    type: 'chat' | 'message';
    title: string;
    avatar?: string;
    lastMessage?: string;
    timestamp: Date;
  };
}

const SearchResultItem = ({ result }: SearchResultItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center p-4 hover:bg-muted/50 cursor-pointer transition-colors"
    >
      <Avatar src={result.avatar} alt={result.title} className="h-12 w-12" />
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium truncate">{result.title}</h3>
          {result.timestamp && (
            <span className="text-xs text-muted-foreground ml-2">
              {formatDistanceToNow(result.timestamp, { addSuffix: true })}
            </span>
          )}
        </div>
        {result.lastMessage && (
          <p className="text-sm text-muted-foreground truncate">
            {result.lastMessage}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default SearchResultItem; 