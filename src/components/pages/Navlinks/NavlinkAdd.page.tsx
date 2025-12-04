import React from 'react';
import { useNavlinkService, type NavlinkRequest } from '../../../services/useNavlinkService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { HTTP_STATUS } from '../../../utils/types';
import NavlinkFormTemplate from '../../templates/Navlinks/NavlinkForm.template';
import { MODE } from '../../../utils/constant';

const validationSchema = Yup.object().shape({
    roleCode: Yup.string().required('Role code is required'),
    index: Yup.string().required('Index is required'),
    name: Yup.string().required('Name is required'),
    path: Yup.string().required('Path is required'),
});

const NavlinkAddPage: React.FC = () => {
    const navigate = useNavigate();
    const navlinkService = useNavlinkService();

    const initialValues: NavlinkRequest = {
        roleCode: '',
        index: '',
        name: '',
        path: '',
    };

    const formik = useFormik<NavlinkRequest>({
        initialValues,
        validationSchema,
        onSubmit: async (values: NavlinkRequest) => {
            try {
                const response = await navlinkService.createNavlink(values);
                if (response?.status === HTTP_STATUS.OK) {
                    navigate('/navlinks');
                }
            } catch (error) {
                console.log(error);
            }
            finally{
                formik.setSubmitting(false);
            }
        },
    });

    return (
        <div>
            <NavlinkFormTemplate formik={formik} mode={MODE.ADD} />
        </div>
    );
};

export default NavlinkAddPage;
