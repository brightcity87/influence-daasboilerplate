import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { VisibilityState } from '@tanstack/react-table';

interface TableState {
  columnVisibility: VisibilityState;
  columnSizing: Record<string, number>;
}

const TABLE_STATE_KEY = 'tableState';

// Update persistent params to include page
type PersistentParams = 'pageSize' | 'page';
const PERSISTENT_PARAMS: PersistentParams[] = ['pageSize', 'page'];

export const DEFAULT_PAGE_SIZE = 20;

export const useTableState = (tableId: string) => {
  const router = useRouter();
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Load persisted state from localStorage
  const loadPersistedState = useCallback((): TableState => {
    if (typeof window === 'undefined') return { columnVisibility: {}, columnSizing: {} };

    const stored = localStorage.getItem(`${TABLE_STATE_KEY}_${tableId}`);
    if (!stored) return { columnVisibility: {}, columnSizing: {} };

    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored table state:', e);
      return { columnVisibility: {}, columnSizing: {} };
    }
  }, [tableId]);

  // Save state to localStorage
  const persistState = useCallback((state: TableState) => {
    localStorage.setItem(`${TABLE_STATE_KEY}_${tableId}`, JSON.stringify(state));
  }, [tableId]);

  // Debounced URL update with better parameter handling
  const updateQueryParams = useCallback((params: Record<string, string>, immediate = false) => {
    // Clear any pending updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    const updateURL = () => {
      const currentQuery = { ...router.query };
      const newQuery: Record<string, string> = {};

      // Preserve demo param if set
      if (currentQuery.demo) {
        newQuery.demo = currentQuery.demo as string;
      }


      // First, preserve persistent params from current URL
      PERSISTENT_PARAMS.forEach(key => {
        // Handle default values
        if (key === 'page' && (!currentQuery[key] || currentQuery[key] === '1')) {
          return; // Don't add page=1 to URL
        }
        if (key === 'pageSize' && (!currentQuery[key])) {
          return; // Don't add default pageSize to URL
        }
        if (currentQuery[key] && !(key in params)) {
          newQuery[key] = currentQuery[key] as string;
        }
      });

      // Then apply new params, skipping defaults
      Object.entries(params).forEach(([key, value]) => {
        if (!value ||
          (key === 'page' && value === '1')) {
          return;
        }
        newQuery[key] = value;
      });

      // Check if we actually have changes
      const hasChanges = JSON.stringify(currentQuery) !== JSON.stringify(newQuery);

      if (!hasChanges) return;

      // Update URL without reload
      router.push(
        {
          pathname: router.pathname,
          query: Object.keys(newQuery).length ? newQuery : undefined,
        },
        undefined,
        { shallow: true }
      );
    };

    if (immediate) {
      updateURL();
    } else {
      updateTimeoutRef.current = setTimeout(updateURL, 500);
    }

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [router]);

  // Parse query params
  const getQueryParams = useCallback(() => {
    const urlParams = new URLSearchParams(location.search);
    const pageSize = urlParams.get('pageSize');
    const page = urlParams.get('page');
    const search = urlParams.get('search');
    const sort = urlParams.get('sort');
    // get all the other url parms
    /// exclude those from above
    let filters: Record<string, string> = {};
    const otherParams = Object.fromEntries(urlParams.entries());
    Object.keys(otherParams).forEach(key => {
      if (!['pageSize', 'page', 'search', 'sort', 'demo', 'token'].includes(key)) {
        filters[key] = otherParams[key];
      }
    });

    return {
      searchTerm: search as string || '',
      page: Number(page) || 1,
      pageSize: parseInt(pageSize as string, 10) || DEFAULT_PAGE_SIZE,
      sorting: sort ? JSON.parse(decodeURIComponent(sort as string)) : [],
      filters: Object.entries(filters).reduce((acc, [key, value]) => {
        // Skip demo query param
        if (key === 'demo') return acc;
        if (value) acc[key] = value as string;
        return acc;
      }, {} as Record<string, string>),
    };
  }, [router.query]);

  return {
    loadPersistedState,
    persistState,
    updateQueryParams,
    getQueryParams,
  };
}; 