import React, { useEffect } from 'react';
import { useNavlinkService } from '../../../services/useNavlinkService';
import { useFormik } from 'formik';
import { HTTP_STATUS } from '../../../utils/types';
import NavlinkFormTemplate from '../../templates/Navlinks/NavlinkForm.template';
import { MODE } from '../../../utils/constant';
import { type NavlinkRequest } from '../../../services/useNavlinkService';
import { useParams } from 'react-router-dom';

const NavlinkViewPage: React.FC = () => {
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
        onSubmit: () => { },
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
            <NavlinkFormTemplate formik={formik} mode={MODE.VIEW} />
        </div>
    );
};

export default NavlinkViewPage;