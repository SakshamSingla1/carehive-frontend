import React from 'react';
import { useTemplateService , type TemplateRequest } from '../../../services/useTemplateService';
import { useNavigate } from 'react-router-dom';
import { HTTP_STATUS } from '../../../utils/types';
import TemplateFormTemplate from '../../templates/Templates/TemplateForm.template';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { makeRoute } from '../../../utils/helper';
import { useSnackbar } from '../../../hooks/useSnackbar';

const TemplateAddPage: React.FC = () => {
    const navigate = useNavigate();
    const templateService = useTemplateService();
    const { showSnackbar } = useSnackbar();

    const createTemplate = async (values: TemplateRequest) => {
            try {
                const response = await templateService.createTemplate(values);
                if (response?.status === HTTP_STATUS.OK) {
                    navigate(makeRoute(ADMIN_ROUTES.TEMPLATES,{}));
                    showSnackbar('success', 'Template created successfully');
                }
            } catch (error) {
                console.log(error);
                showSnackbar('error', 'Failed to create template');
            }
    }

    return (
        <div>
            <TemplateFormTemplate onSubmit={createTemplate} mode={MODE.ADD} />
        </div>
    );
};

export default TemplateAddPage;
