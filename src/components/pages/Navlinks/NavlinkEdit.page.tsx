import React, { useEffect } from 'react';
import { useNavlinkService } from '../../../services/useNavlinkService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { HTTP_STATUS } from '../../../utils/types';
import NavlinkFormTemplate from '../../templates/Navlinks/NavlinkForm.template';
import { MODE } from '../../../utils/constant';
import { type NavlinkRequest } from '../../../services/useNavlinkService';
import { useParams } from 'react-router-dom';

const validationSchema = Yup.object().shape({
    roleCode: Yup.string().required('Role code is required'),
    index: Yup.string().required('Index is required'),
    name: Yup.string().required('Name is required'),
    path: Yup.string().required('Path is required'),
});

const NavlinkEditPage: React.FC = () => {
    const navigate = useNavigate();
    const navlinkService = useNavlinkService();
    const params = useParams();
    const role = String(params.role);
    const index = String(params.index);

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
                const response = await navlinkService.updateNavlink(role, index, values);
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

    const loadNavlink = async (role: string, index: string) => {
        try {
            const response = await navlinkService.getNavlinkByRoleIndex(role, index);
            if (response?.status === HTTP_STATUS.OK) {
                formik.setValues(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadNavlink(role, index);
    }, [role, index]);

    return (
        <div>
            <NavlinkFormTemplate formik={formik} mode={MODE.EDIT} />
        </div>
    );
};

export default NavlinkEditPage;