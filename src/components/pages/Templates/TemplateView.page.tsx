import React,{ useState, useEffect } from 'react';
import { useTemplateService, type TemplateResponse } from '../../../services/useTemplateService';
import { HTTP_STATUS } from '../../../utils/types';
import TemplateFormTemplate from '../../templates/Templates/TemplateForm.template';
import { MODE } from '../../../utils/constant';
import { useParams } from 'react-router-dom';

const TemplateViewPage: React.FC = () => {
    const templateService = useTemplateService();
    const params = useParams();
    const name = String(params.name);
    const [templateData, setTemplateData] = useState<TemplateResponse | null>(null);

    const loadTemplateData = async () => {
        templateService.getTemplateByName(name)
            .then(res => {
                if (res.status === HTTP_STATUS.OK) {
                    setTemplateData(res.data.data);
                }
            })
    }

    useEffect(() => {
        loadTemplateData();
    }, [name]);

    return (
        <div>
            <TemplateFormTemplate onSubmit={()=>{}} mode={MODE.VIEW} template={templateData} />
        </div>
    );
};  

export default TemplateViewPage;
