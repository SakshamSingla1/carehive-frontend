import React, { useState,useEffect } from "react";
import { type FormikProps } from "formik";
import { type UpdateUserProfileDTO } from "../../../services/useAuthService";
import TextField from "../../atoms/TextField";
import FilterChipV2 from "../../atoms/FilterChip";
import { useServicesService, type ServiceResponse } from "../../../services/useServicesService";
import { HTTP_STATUS } from "../../../utils/types";
import DocumentUpload from "../../molecules/DocumentUpload/DocumentUpload";

interface ProfileFormTemplateProps {
    formik: FormikProps<UpdateUserProfileDTO>;
}

const ProfileFormTemplate : React.FC<ProfileFormTemplateProps> = ({formik}) => {

    const servicesService = useServicesService();
    const [services , setServices] = useState<{label: string, value: string}[]>([]);

    const loadServices = async () => {
        try {
            const response = await servicesService.getServices();
            if(response.status === HTTP_STATUS.OK){
                setServices(response.data.data.content.map((service: ServiceResponse) => ({
                    label: service.name,
                    value: service.id
                })));
            }
        } catch (error) {
            console.error("Failed to load services", error);
        }
    }
    
    useEffect(() => {
        loadServices();
    }, []);

    return (
        <div className="">
            <TextField
                label="Name"
                {...formik.getFieldProps("name")}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
                label="Username"
                {...formik.getFieldProps("username")}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
            />
            <TextField
                label="Phone Number"
                {...formik.getFieldProps("phoneNumber")}
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            />
            <TextField
                label="Email"
                {...formik.getFieldProps("email")}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
            />
            <FilterChipV2
                label="Services"
                options={services}
                value={(formik.values.serviceIds || []).map(id => ({ label: services.find(s => s.value === id)?.label || id, value: id }))}
                onChange={(selected) => formik.setFieldValue("serviceIds", selected.map(item => item.value))}
            />
            <DocumentUpload
                label="Profile Documents"
                multiple
                onUploadSuccess={(files) => {
                    formik.setFieldValue(
                        "documents",
                        files.map((f) => f.documentId)
                    );
                }}
            />
        </div>
    )
}

export default ProfileFormTemplate;