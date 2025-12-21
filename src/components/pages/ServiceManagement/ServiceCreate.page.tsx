import React from 'react';
import { useServicesService ,type ServiceRequest} from '../../../services/useServicesService';
import { HTTP_STATUS } from '../../../utils/types';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { makeRoute } from '../../../utils/helper';
import { useSnackbar } from '../../../hooks/useSnackbar';
import ServiceForm from '../../templates/ServiceManagement/ServiceForm.template';

const ServiceCreate: React.FC = () => {
    const servicesService = useServicesService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const createService = async (values: ServiceRequest) => {
        try{
            const response = await servicesService.createService(values);
            if(response.status === HTTP_STATUS.OK){
                showSnackbar('success','Service created successfully');
                navigate(makeRoute(ADMIN_ROUTES.SERVICES,{}));
            }
        } catch (error) {
            console.error('Error creating service:', error);
            showSnackbar('error','Failed to create service');
        }
    };
    
    return (
        <div>
            <ServiceForm onSubmit={createService} mode={MODE.ADD} />
        </div>
    );
};

export default ServiceCreate;