import { DEFAULT_PAGE_SIZE } from "@/hooks/useTableState";
import { DatabaseState } from "@/types/types";
import { create } from "zustand";



export const useDatabaseState = create<DatabaseState>()((set) => ({
    page: 1,
    pageCount: 10,
    total: 100000,
    pageSize: DEFAULT_PAGE_SIZE,
    incrementPage: () => set((state) => ({
        ...state,
        page: state.page < state.pageCount ? state.page + 1 : state.pageCount,
    })),
    decrementPage: () => set((state) => ({
        ...state,
        page: state.page > 1 ? state.page - 1 : 1,
    })),
    setPage: (page: number) => {
        set({ page });
    },
    setTotal: (number: number) => set((state) => {
        state.total = number;
        return state;
    }),
    setPageCount: (number: number) => set((state) => {
        state.pageCount = number;
        return state;
    }),
    setPageSize: (number: number) => set((state) => ({
        ...state,
        pageSize: number,
    }
    ))
}))


type FilterOptions = {
    [key: string]: boolean;
};

type FilterState = {
    filterOptions: FilterOptions;
    setFilterOption: (key: string, value: boolean) => void;
    toggleFilterOption: (key: string) => void;
    searchTerm: string;
    setSearch: (searchTerm: string) => void;
    filteredOptions: {
        [key: string]: string;
    };
    setFilteredOptions: (options: { [key: string]: string }) => void;


    forceUpdate: boolean;
    setForceUpdate: (forceUpdate: boolean) => void;
};

export const useFilterState = create<FilterState>()((set) => ({
    filterOptions: {},
    setFilterOption: (key: string, value: boolean) =>
        set((state) => ({ filterOptions: { ...state.filterOptions, [key]: value } })),
    toggleFilterOption: (key: string) =>
        set((state) => ({
            filterOptions: {
                ...state.filterOptions,
                [key]: !state.filterOptions[key],
            },
        })),
    searchTerm: "",
    setSearch: (searchTerm: string) => set({ searchTerm }),


    filteredOptions: {},
    setFilteredOptions: (options: { [key: string]: string }) => set({ filteredOptions: options }),

    forceUpdate: false,
    setForceUpdate: (forceUpdate: boolean) => set({ forceUpdate })
}));
