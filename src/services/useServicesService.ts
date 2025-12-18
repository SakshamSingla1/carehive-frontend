import { request } from "."
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";

export const SERVICES_URLS = {
    GET_SERVICES: "services",
    GET_SERVICE_BY_ID: "services/:id",
    ASSIGN_SERVICE: "services/assign/:caretakerId",
}

export interface ServiceRequest {
    id?: string;
    name?: string;
    description?: string;
    pricePerHour?: string;
    status?: string;
}

export interface ServiceResponse {
    id?: string;
    name?: string;
    description?: string;
    pricePerHour?: string;
    status?: string;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export const useServicesService = () => {
    const getServices = async () => {
        return request(API_METHOD.GET, SERVICES_URLS.GET_SERVICES, null);
    }

    const getServiceById = async (id: string) => {
        return request(API_METHOD.GET, replaceUrlParams(SERVICES_URLS.GET_SERVICE_BY_ID, { id }), null);
    }

    const createService = async (service: ServiceRequest) => {
        return request(API_METHOD.POST, SERVICES_URLS.GET_SERVICES, null, service);
    }

    const updateService = async (id: string, service: ServiceRequest) => {
        return request(API_METHOD.PUT, replaceUrlParams(SERVICES_URLS.GET_SERVICE_BY_ID, { id }), null, service);
    };

    const deleteService = async (id: string) => {
        return request(API_METHOD.DELETE, replaceUrlParams(SERVICES_URLS.GET_SERVICE_BY_ID, { id }), null);
    };

    return {
        getServices,
        getServiceById,
        createService,
        updateService,
        deleteService,
    }
}