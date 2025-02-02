import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface SearchHeaderProps {
  onBack: () => void;
}

const SearchHeader = ({ onBack }: SearchHeaderProps) => {
  return (
    <div className="flex items-center h-16 px-4 border-b bg-background">
      <button
        onClick={onBack}
        className="p-2 hover:bg-muted rounded-full transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h1 className="ml-4 font-semibold">Search</h1>
    </div>
  );
};

export default SearchHeader; 