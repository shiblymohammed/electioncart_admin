import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { useEscapeKey } from '../../hooks/useKeyboardShortcut';
import { SearchResult } from '../../types/ui.types';

interface SearchBarProps {
  onSearch?: (query: string) => Promise<SearchResult[]>;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({
  onSearch,
  placeholder = 'Search...',
  className = '',
}: SearchBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300);

  // Close on ESC key
  useEscapeKey(() => {
    setIsExpanded(false);
    setQuery('');
    setResults([]);
  });

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery && onSearch) {
      setIsLoading(true);
      onSearch(debouncedQuery)
        .then((data) => {
          setResults(data);
          setIsLoading(false);
        })
        .catch(() => {
          setResults([]);
          setIsLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [debouncedQuery, onSearch]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setIsExpanded(false);
    setQuery('');
    setResults([]);
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setQuery('');
    setResults([]);
  };

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const typeLabels: Record<string, string> = {
    order: 'Orders',
    user: 'Users',
    product: 'Products',
    staff: 'Staff',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search button/input */}
      <div className="relative">
        {!isExpanded ? (
          <button
            onClick={handleExpand}
            className="p-2 rounded-lg hover:bg-dark-hover transition-colors text-text-muted hover:text-text"
            aria-label="Open search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-64 px-4 py-2 pl-10 bg-dark-surface border border-dark-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              onClick={handleCollapse}
              className="p-2 rounded-lg hover:bg-dark-hover transition-colors text-text-muted hover:text-text"
              aria-label="Close search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Search results dropdown */}
      {isExpanded && query && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-dark-surface border border-dark-border rounded-lg shadow-card max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-text-muted">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {Object.entries(groupedResults).map(([type, items]) => (
                <div key={type} className="mb-2 last:mb-0">
                  <div className="px-4 py-2 text-xs font-semibold text-text-muted uppercase">
                    {typeLabels[type] || type}
                  </div>
                  {items.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-2 text-left hover:bg-dark-hover transition-colors"
                    >
                      <div className="text-text font-medium">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-sm text-text-muted">{result.subtitle}</div>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-text-muted">
              <p className="text-sm">No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
