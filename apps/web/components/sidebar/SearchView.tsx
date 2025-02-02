import { useState } from "react";

interface SearchViewProps {
  query: string;
}

export const SearchView = ({ query }: SearchViewProps) => {
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // TODO: Implement search logic here
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {searchResults.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            {searchQuery ? "No results found" : "Enter a search term to begin"}
          </div>
        ) : (
          <div className="space-y-4">
            {searchResults.map((result: any) => (
              <SearchResult key={result.id} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

interface SearchResultProps {
  result: any; // TODO: Define proper type
}

const SearchResult = ({ result }: SearchResultProps) => {
  return (
    <div className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
      <div className="font-medium">{result.title}</div>
      <div className="text-sm text-gray-500 mt-1">{result.preview}</div>
    </div>
  );
};
