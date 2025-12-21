import { request } from "."
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";

export const SERVICES_URLS = {
    GET_SERVICES: "services",
    GET_SERVICE_BY_ID: "services/:id",
    ASSIGN_SERVICE: "services/assign/:caretakerId",
}

export interface ServiceFilterRequest {
    page: string;
    size: string;
    sort?: string;
    search?: string;
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

export interface AssignServiceRequest {
    serviceIds: string[];
    status: string;
}

export const useServicesService = () => {
    const getAllServices = async (filters: ServiceFilterRequest) => {
        return request(API_METHOD.GET, SERVICES_URLS.GET_SERVICES, null, null, { params: filters });
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

    const assignService = async (caretakerId: string, data: AssignServiceRequest) => {
        return request(API_METHOD.PUT, replaceUrlParams(SERVICES_URLS.ASSIGN_SERVICE, { caretakerId }), null, data);
    };

    return {
        getAllServices,
        getServiceById,
        createService,
        updateService,
        deleteService,
        assignService,
    }
}