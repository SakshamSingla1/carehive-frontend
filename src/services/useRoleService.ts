import { request } from "."
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";

export const ROLE_URLS = {
    GET_ROLES: "roles",
    GET_ROLE_BY_ID: "roles/:id",
}

export interface RoleRequest {
    id?: string;
    name: string;
    enumCode: string;
}

export interface RoleResponse {
    id?: string;
    name: string;
    enumCode: string;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export const useRoleService = () => {
    const getRoles = async () => {
        return request(API_METHOD.GET, ROLE_URLS.GET_ROLES, null);
    }

    const getRoleById = async (id: string) => {
        return request(API_METHOD.GET, replaceUrlParams(ROLE_URLS.GET_ROLE_BY_ID, { id }), null);
    }

    const createRole = async (role: RoleRequest) => {
        return request(API_METHOD.POST, ROLE_URLS.GET_ROLES, null, role);
    }

    const updateRole = async (id: string, role: RoleRequest) => {
        return request(API_METHOD.PUT, replaceUrlParams(ROLE_URLS.GET_ROLE_BY_ID, { id }), null, role);
    };

    return {
        getRoles,
        getRoleById,
        createRole,
        updateRole,
    }
}