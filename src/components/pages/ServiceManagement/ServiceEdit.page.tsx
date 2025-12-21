import React, { useState, useEffect } from 'react';
import { useServicesService ,type ServiceRequest, type ServiceResponse} from '../../../services/useServicesService';
import { HTTP_STATUS } from '../../../utils/types';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { makeRoute } from '../../../utils/helper';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { useParams } from 'react-router-dom';
import ServiceForm from '../../templates/ServiceManagement/ServiceForm.template';

const ServiceEdit: React.FC = () => {
    const servicesService = useServicesService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const params = useParams();
    const id = params.id;

    const [serviceData, setServiceData] = useState<ServiceResponse | null>(null);

    const updateService = async (values: ServiceRequest) => {
        try{
            const response = await servicesService.updateService(id!, values);
            if(response.status === HTTP_STATUS.OK){
                showSnackbar('success','Service updated successfully');
                navigate(makeRoute(ADMIN_ROUTES.SERVICES,{}));
            }
        } catch (error) {
            console.error('Error updating service:', error);
            showSnackbar('error','Failed to update service');
        }
    };

    const loadServiceData = async () => {
        if (!id) return;
        servicesService.getServiceById(id)
            .then((res: any) => {
                if (res.status === HTTP_STATUS.OK) {
                    setServiceData(res.data.data);
                }
            })
    }
    
    useEffect(() => {
        loadServiceData();
    }, [id]);
    
    return (
        <div>
            <ServiceForm onSubmit={updateService} mode={MODE.EDIT} service={serviceData} />
        </div>
    );
};

export default ServiceEdit;