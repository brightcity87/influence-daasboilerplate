import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import { immer } from "zustand/middleware/immer";


type PaginationMeta = {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    }
  }


type PageState = {
    page: number; //current page
    total: number; //total assets
    pageCount: number; //amount of pages
    pageSize: number; //assets per page
    categoryId: number;

    setPage: (number: number) => void,
    setTotal: (number: number) => void,
    setPageCount: (number: number) => void,
    setPageSize: (number: number) => void,

    decrementPage: () => void,
    incrementPage: () => void,
    setMetaData: (meta: PaginationMeta) => void,

    setCategoryId: (number: number) => void,

}


export let usePageState = create<PageState>()(immer((set) => ({
    page: 1,
    total: 1,
    pageCount: 1,
    pageSize: 3,
    categoryId: 5,
    setCategoryId: (number: number) => set((state) => {
        state.categoryId = number;
    }
    ),
    setMetaData: (meta: PaginationMeta) => set((state) => {
        state.page = meta.pagination.page;
        state.pageCount = meta.pagination.pageCount;
        state.total = meta.pagination.total;
        state.pageSize = meta.pagination.pageSize;
    }
    ),
    decrementPage: () => set((state) => {
        state.page = state.page - 1;
        if (state.page < 0) { state.page = 0 }
    }
    ),
    incrementPage: () => set((state) => {
        state.page = state.page + 1;
        if (state.page > state.pageCount) { state.page = state.pageCount }
    }
    ),
    setPage: (number: number) => set((state) => {
        state.page = number;
    }
    ),
    setTotal: (number: number) => set((state) => {
        state.total = number;
    }
    ),
    setPageCount: (number: number) => set((state) => {
        state.pageCount = number;
    }
    ),
    setPageSize: (number: number) => set((state) => {
        state.pageSize = number;
    }
    ),
})));

