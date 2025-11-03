import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface SearchResult {
  type: 'order' | 'user' | 'product' | 'staff';
  id: number;
  title: string;
  subtitle: string;
  url: string;
}

interface SearchResults {
  orders: SearchResult[];
  users: SearchResult[];
  products: SearchResult[];
  staff: SearchResult[];
}

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({
    orders: [],
    users: [],
    products: [],
    staff: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setQuery('');
        setResults({ orders: [], users: [], products: [], staff: [] });
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsExpanded(true);
      }
      if (e.key === 'Escape') {
        setIsExpanded(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ orders: [], users: [], products: [], staff: [] });
      return;
    }

    const debounce = setTimeout(async () => {
      await performSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      const response = await api.get('/admin/search/', {
        params: { q: searchQuery }
      });

      const data = response.data;
      setResults({
        orders: data.orders || [],
        users: data.users || [],
        products: data.products || [],
        staff: data.staff || [],
      });
    } catch (err: any) {
      console.error('Search failed:', err);
      // Silently fail - search is not critical
    } finally {
      setLoading(false);
    }
  };

  const getAllResults = (): SearchResult[] => {
    return [
      ...results.orders,
      ...results.users,
      ...results.products,
      ...results.staff,
    ];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allResults = getAllResults();
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % allResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allResults.length) % allResults.length);
    } else if (e.key === 'Enter' && allResults[selectedIndex]) {
      e.preventDefault();
      handleResultClick(allResults[selectedIndex]);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setIsExpanded(false);
    setQuery('');
    setResults({ orders: [], users: [], products: [], staff: [] });
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'order':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'user':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'product':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'staff':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const totalResults = getAllResults().length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Button/Input */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-3 py-2 bg-dark-hover hover:bg-dark-border rounded-lg transition-colors text-text-muted hover:text-text"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-sm">Search</span>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs bg-dark-surface border border-dark-border rounded">
            ⌘K
          </kbd>
        </button>
      ) : (
        <div className="w-96 animate-fade-in">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search orders, users, products..."
              className="w-full pl-10 pr-4 py-2 bg-dark-hover border border-dark-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            )}
          </div>

          {/* Results Dropdown */}
          {query.length >= 2 && (
            <div className="absolute top-full mt-2 w-full bg-dark-surface border border-dark-border rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50">
              {totalResults === 0 && !loading ? (
                <div className="p-8 text-center">
                  <svg className="w-12 h-12 text-text-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-text-muted">No results found</p>
                  <p className="text-sm text-text-muted mt-1">Try a different search term</p>
                </div>
              ) : (
                <>
                  {results.orders.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs text-text-muted font-medium uppercase">
                        Orders ({results.orders.length})
                      </div>
                      {results.orders.map((result, index) => (
                        <button
                          key={`order-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                            selectedIndex === index ? 'bg-primary/20 text-primary' : 'hover:bg-dark-hover text-text'
                          }`}
                        >
                          <div className="text-primary">{getResultIcon('order')}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{result.title}</div>
                            <div className="text-xs text-text-muted truncate">{result.subtitle}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.users.length > 0 && (
                    <div className="p-2 border-t border-dark-border">
                      <div className="px-3 py-2 text-xs text-text-muted font-medium uppercase">
                        Users ({results.users.length})
                      </div>
                      {results.users.map((result, index) => {
                        const globalIndex = results.orders.length + index;
                        return (
                          <button
                            key={`user-${result.id}`}
                            onClick={() => handleResultClick(result)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                              selectedIndex === globalIndex ? 'bg-primary/20 text-primary' : 'hover:bg-dark-hover text-text'
                            }`}
                          >
                            <div className="text-success">{getResultIcon('user')}</div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{result.title}</div>
                              <div className="text-xs text-text-muted truncate">{result.subtitle}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {results.products.length > 0 && (
                    <div className="p-2 border-t border-dark-border">
                      <div className="px-3 py-2 text-xs text-text-muted font-medium uppercase">
                        Products ({results.products.length})
                      </div>
                      {results.products.map((result, index) => {
                        const globalIndex = results.orders.length + results.users.length + index;
                        return (
                          <button
                            key={`product-${result.id}`}
                            onClick={() => handleResultClick(result)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                              selectedIndex === globalIndex ? 'bg-primary/20 text-primary' : 'hover:bg-dark-hover text-text'
                            }`}
                          >
                            <div className="text-warning">{getResultIcon('product')}</div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{result.title}</div>
                              <div className="text-xs text-text-muted truncate">{result.subtitle}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
