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

export const ROLES = {
    ADMIN: "ADMIN",
    CARETAKER: "CARETAKER",
    ELDER: "ELDER",
    FAMILY_MEMBER: "FAMILY_MEMBER"
}

export const ADMIN_ROUTES = {
    USER_PROFILE: "admin/user-profile",
    USER_PROFILE_EDIT: "admin/user-profile/edit",
    TEMPLATES: "admin/templates",
    TEMPLATES_ADD: "admin/templates/add",
    TEMPLATES_EDIT: "admin/templates/:name/edit",
    TEMPLATES_VIEW: "admin/templates/:name",
    COLOR_THEME: "admin/color-theme",
    COLOR_THEME_ADD: "admin/color-theme/add",
    COLOR_THEME_EDIT: "admin/color-theme/:role/:themeName/edit",
    COLOR_THEME_VIEW: "admin/color-theme/:role/:themeName",
    NAVLINKS: "admin/navlinks",
    NAVLINKS_ADD: "admin/navlinks/add",
    NAVLINKS_EDIT: "admin/navlinks/:role/:index/edit",
    NAVLINKS_VIEW: "admin/navlinks/:role/:index"
}