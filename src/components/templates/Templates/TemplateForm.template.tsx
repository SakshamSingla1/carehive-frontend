import React, { useEffect, useRef, useMemo } from 'react';
import type { TemplateRequest, TemplateResponse } from '../../../services/useTemplateService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from "../../atoms/TextField";
import Button from '../../atoms/Button';
import { MODE } from '../../../utils/constant';
import JoditEditor from "jodit-react";
import { useNavigate } from 'react-router-dom';
import Select from '../../molecules/Select';
import { ADMIN_ROUTES } from '../../../utils/constant';
import { makeRoute } from '../../../utils/helper';

interface TemplateFormProps {
    onSubmit: (values: TemplateRequest) => void;
    mode: string;
    template?: TemplateResponse | null;
    loading?: boolean;
}

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    subject: Yup.string().required('Subject is required'),
    body: Yup.string().required('Body is required'),
    type: Yup.string().required('Type is required'),
    active: Yup.boolean().default(true)
});

const templateTypes = [
    { value: 'EMAIL', label: 'Email' },
    { value: 'SMS', label: 'SMS' },
    { value: 'NOTIFICATION', label: 'Notification' },
];

const TemplateForm: React.FC<TemplateFormProps> = ({ onSubmit, mode, template, loading = false }) => {
    const navigate = useNavigate();
    const editor = useRef(null);

    const joditConfig = useMemo(() => ({
        readonly: mode === MODE.VIEW,
        placeholder: 'Start typing template content...',
        height: 400,
        toolbarAdaptive: false,
        toolbarSticky: true,
        buttons: 'bold,italic,underline,strikethrough,|,ul,ol,|,outdent,indent,|,font,fontsize,|,align,|,link,|,undo,redo',
    }), [mode]);

    const formik = useFormik<TemplateRequest>({
        initialValues: {
            name: template?.name ?? '',
            subject: template?.subject ?? '',
            body: template?.body ?? '',
            type: template?.type ?? '',
            active: template?.active ?? true
        },
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
        enableReinitialize: true
    });

    const handleBodyChange = (content: string) => {
        formik.setFieldValue('body', content);
    };

    useEffect(() => {
        if (template) {
            formik.setValues(template);
        }
    }, [template]);

    return (
        <div style={{ marginTop: '16px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 16px 0' }}>
                    {mode === MODE.VIEW ? 'View Template' : mode === MODE.EDIT ? 'Edit Template' : 'Create New Template'}
                </h2>
            </div>

            <div>
                <div style={{ marginBottom: '24px' }}>
                    <TextField
                        fullWidth
                        label="Template Name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        disabled={mode === MODE.VIEW}
                        margin="normal"
                    />
                </div>
                <div style={{ marginBottom: '24px' }}>
                    <Select
                        label="Type"
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.type && Boolean(formik.errors.type)}
                        helperText={Boolean(formik.touched.type && formik.errors.type) ? formik.errors.type : ''}
                        disabled={mode === MODE.VIEW}
                        options={templateTypes}
                        fullWidth
                        required
                    />
                </div>
                <div style={{ marginBottom: '24px' }}>
                    <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formik.values.subject}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.subject && Boolean(formik.errors.subject)}
                        helperText={formik.touched.subject && formik.errors.subject}
                        disabled={mode === MODE.VIEW}
                        margin="normal"
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <div style={{ marginBottom: '8px' }}>Body</div>
                    <JoditEditor
                        ref={editor}
                        value={formik.values.body}
                        config={joditConfig}
                        onBlur={handleBodyChange}
                    />
                    {formik.touched.body && formik.errors.body && (
                        <div style={{ color: '#f44336', fontSize: '0.75rem', marginTop: '4px' }}>
                            {formik.errors.body}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            name="active"
                            checked={formik.values.active}
                            onChange={formik.handleChange}
                            disabled={mode === MODE.VIEW}
                            style={{ marginRight: '8px' }}
                        />
                        Active
                    </label>
                </div>
                <div className='flex justify-between'>
                    <Button
                        onClick={() => navigate(makeRoute(ADMIN_ROUTES.TEMPLATES, {}))}
                        variant="tertiaryContained"
                        label="Cancel"
                        color="primary"
                        disabled={loading}
                    />
                    {mode !== MODE.VIEW && (
                        <Button
                            label={mode === MODE.ADD ? 'Create' : 'Update'}
                            onClick={() => formik.handleSubmit()}
                            variant="primaryContained"
                            color="primary"
                            disabled={loading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TemplateForm;