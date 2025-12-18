import React,{ useState, useEffect } from 'react';
import { useTemplateService , type TemplateRequest, type TemplateResponse } from '../../../services/useTemplateService';
import { useNavigate } from 'react-router-dom';
import { HTTP_STATUS } from '../../../utils/types';
import TemplateFormTemplate from '../../templates/Templates/TemplateForm.template';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { makeRoute } from '../../../utils/helper';
import { useParams } from 'react-router-dom';

const TemplateEditPage: React.FC = () => {
    const navigate = useNavigate();
    const templateService = useTemplateService();
    const params = useParams();
    const name = String(params.name);
    const [templateData, setTemplateData] = useState<TemplateResponse | null>(null);

    const editTemplate = async (values: TemplateRequest) => {
            try {
                const response = await templateService.updateTemplate(name, values);
                if (response?.status === HTTP_STATUS.OK) {
                    navigate(makeRoute(ADMIN_ROUTES.TEMPLATES,{}));
                }
            } catch (error) {
                console.log(error);
            }
    }

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
            <TemplateFormTemplate onSubmit={editTemplate} mode={MODE.EDIT} template={templateData} />
        </div>
    );
};  

export default TemplateEditPage;
