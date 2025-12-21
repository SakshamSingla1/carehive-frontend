import React, { useState, useEffect } from 'react';
import Button from '../../atoms/Button';
import Select from '../../molecules/Select';
import { type NavlinkRequest, type NavlinkResponse } from '../../../services/useNavlinkService';
import { useRoleService, type RoleResponse } from '../../../services/useRoleService';
import { HTTP_STATUS } from '../../../utils/types';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { useNavigate } from 'react-router-dom';
import TextField from '../../atoms/TextField';
import { makeRoute } from '../../../utils/helper';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface NavlinkFormTemplateProps {
  onSubmit: (values: NavlinkRequest) => void;
  mode: string;
  navlink?: NavlinkResponse | null;
}

const validationSchema = Yup.object().shape({
  roleCode: Yup.string().required('Role code is required'),
  index: Yup.string().required('Index is required'),
  name: Yup.string().required('Name is required'),
  path: Yup.string().required('Path is required'),
});

const NavlinkFormTemplate: React.FC<NavlinkFormTemplateProps> = ({ onSubmit, mode, navlink }) => {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const roleService = useRoleService();
  const navigate = useNavigate();

  const formik = useFormik<NavlinkRequest>({
    initialValues: {
      roleCode: navlink?.roleCode || '',
      index: navlink?.index?.toString() || '',
      name: navlink?.name || '',
      path: navlink?.path || '',
    },
    validationSchema,
    onSubmit: (values) => onSubmit(values),
  });

  const loadRoles = async () => {
    try {
      const response = await roleService.getRoles();
      if (response?.status === HTTP_STATUS.OK) {
        setRoles(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    if (navlink) {
      formik.setValues({
        roleCode: navlink.roleCode || '',
        index: navlink.index?.toString() || '',
        name: navlink.name || '',
        path: navlink.path || '',
      });
    }
  }, [navlink]);

  return (
    <div className="mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">
          {mode === MODE.ADD
            ? 'Add New Navlink'
            : mode === MODE.EDIT
              ? 'Edit Navlink'
              : 'Navlink Details'}
        </h2>

        <p className="text-gray-500 mb-6">
          {mode === MODE.VIEW
            ? 'View details of this navlink.'
            : 'Fill in the details below to proceed.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Name */}
          <div className="space-y-1">
            <TextField
              label="Name"
              variant="outlined"
              placeholder='Enter navlink name'
              fullWidth
              {...formik.getFieldProps('name')}
              disabled={mode === MODE.VIEW}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </div>

          {/* Path */}
          <div className="space-y-1">
            <TextField
              label="Path"
              placeholder="Enter path (e.g., dashboard, users)"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps('path')}
              disabled={mode === MODE.VIEW}
              error={formik.touched.path && Boolean(formik.errors.path)}
              helperText={formik.touched.path && formik.errors.path}
            />
          </div>

          {/* Index */}
          <div className="space-y-1">
            <TextField
              label="Index"
              placeholder="Enter index value"
              variant="outlined"
              fullWidth
              type="number"
              {...formik.getFieldProps('index')}
              disabled={mode === MODE.VIEW}
              error={formik.touched.index && Boolean(formik.errors.index)}
              helperText={formik.touched.index && formik.errors.index}
              inputProps={{ min: 0 }}
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <Select
              label="Role"
              placeholder='Select Role'
              options={roles.map(role => ({ label: role.name, value: role.enumCode }))}
              value={formik.values.roleCode || ''}
              onChange={(e) => formik.setFieldValue('roleCode', e.target.value)}
              disabled={mode === MODE.VIEW}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-10">
          <Button
            label="Cancel"
            variant="tertiaryContained"
            onClick={() => navigate(makeRoute(ADMIN_ROUTES.NAVLINKS, {}))}
          />

          {mode !== MODE.VIEW && (
            <Button
              label="Save Changes"
              variant="primaryContained"
              onClick={() => formik.handleSubmit()}
              disabled={formik.isSubmitting || !formik.isValid}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NavlinkFormTemplate;
