export type MakeRouteParams = {
    params?: { [key: string]: any } | null;
    query?: { [key: string]: any } | null;
};

export interface IPagination {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
};

export const HTTP_STATUS = {
    OK: 200,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    SERVER_ERROR: 500
}

export const SORT_ENUM = {
   NAME_ASC: "name_asc",
   NAME_DESC: "name_desc",
   CREATED_AT_ASC: "created_at_asc",
   CREATED_AT_DESC: "created_at_desc"
}