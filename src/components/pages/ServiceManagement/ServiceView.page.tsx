import React, { useState, useEffect } from 'react';
import { useServicesService ,type ServiceResponse} from '../../../services/useServicesService';
import { HTTP_STATUS } from '../../../utils/types';
import { MODE } from '../../../utils/constant';
import { useParams } from 'react-router-dom';
import ServiceForm from '../../templates/ServiceManagement/ServiceForm.template';

const ServiceView: React.FC = () => {
    const servicesService = useServicesService();
    const params = useParams();
    const id = params.id;

    const [serviceData, setServiceData] = useState<ServiceResponse | null>(null);

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
            <ServiceForm onSubmit={() => {}} mode={MODE.VIEW} service={serviceData} />
        </div>
    );
};

export default ServiceView;