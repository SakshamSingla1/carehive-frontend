import type { IPagination } from "./types"

export const API_METHOD = {
    POST: "POST",
    GET: "GET",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH"
}

export const initialPaginationValues: IPagination = {
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0
}

export const MODE = {
    ADD: "add",
    EDIT: "edit",
    VIEW: "view"
}