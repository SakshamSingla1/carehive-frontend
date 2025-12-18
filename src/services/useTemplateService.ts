import { request } from "."
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";

export const TEMPLATE_URLS = {
    GET_TEMPLATES: "templates",
    GET_TEMPLATE_BY_NAME: "templates/:name",
}

export interface TemplateFilterRequest {
    search?: string;
    sort: string;
    page: string;
    size: string;
}

export interface TemplateRequest {
    name: string;
    subject: string;
    body: string;
    type: string;
    active: boolean;
}

export interface TemplateResponse {
    id: string;
    name: string;
    subject: string;
    body: string;
    type: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export const useTemplateService = () => {
    const getAllTemplates = (params: TemplateFilterRequest) =>
        request(API_METHOD.GET, TEMPLATE_URLS.GET_TEMPLATES, null, null, { params });

    const getTemplateByName = async (name: string) => {
        return request(API_METHOD.GET, 
            replaceUrlParams(TEMPLATE_URLS.GET_TEMPLATE_BY_NAME, { name }), 
            null, 
            null
        );
    };

    const createTemplate = async (template: TemplateRequest) => {
        return request(API_METHOD.POST, 
            TEMPLATE_URLS.GET_TEMPLATES, 
            null, 
            template
        );
    };

    const updateTemplate = async (name: string, template: TemplateRequest) => {
        return request(API_METHOD.PUT, 
            replaceUrlParams(TEMPLATE_URLS.GET_TEMPLATE_BY_NAME, { name }), 
            null, 
            template
        );
    };

    const deleteTemplate = async (name: string) => {
        return request(API_METHOD.DELETE, 
            replaceUrlParams(TEMPLATE_URLS.GET_TEMPLATE_BY_NAME, { name }), 
            null, 
            null
        );
    };

    return {
        getAllTemplates,
        getTemplateByName,
        createTemplate,
        updateTemplate,
        deleteTemplate,
    };
};