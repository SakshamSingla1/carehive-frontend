import React, { useState, useEffect } from 'react';
import { type FormikProps } from 'formik';
import {
  Button,
  Select,
  MenuItem,
  CircularProgress,
  InputLabel,
  FormControl,
  FormHelperText,
  Divider
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { type NavlinkRequest } from '../../../services/useNavlinkService';
import { useRoleService, type RoleResponse } from '../../../services/useRoleService';
import { HTTP_STATUS } from '../../../utils/types';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { useNavigate } from 'react-router-dom';
import TextField from '../../atoms/TextField';
import { makeRoute } from '../../../utils/helper';

interface NavlinkFormTemplateProps {
  formik: FormikProps<NavlinkRequest>;
  mode: string;
}

const NavlinkFormTemplate: React.FC<NavlinkFormTemplateProps> = ({ formik, mode }) => {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const roleService = useRoleService();
  const navigate = useNavigate();

  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const response = await roleService.getRoles();
      if (response?.status === HTTP_STATUS.OK) {
        setRoles(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const isViewMode = mode === MODE.VIEW;
  const isSubmitting = formik.isSubmitting;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(makeRoute(ADMIN_ROUTES.NAVLINKS,{}))}
        className="group flex items-center text-blue-600 hover:text-blue-800 transition mb-6"
      >
        <ArrowBackIcon className="mr-1 group-hover:-translate-x-1 transition" />
        Back
      </button>

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

        <Divider className="mb-8" />

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Name */}
          <div className="space-y-1">
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps('name')}
              disabled={isViewMode || isSubmitting}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              InputLabelProps={{ shrink: true }}
            />
          </div>

          {/* Path */}
          <div className="space-y-1">
            <TextField
              label="Path"
              placeholder="/dashboard, /users"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps('path')}
              disabled={isViewMode || isSubmitting}
              error={formik.touched.path && Boolean(formik.errors.path)}
              helperText={formik.touched.path && formik.errors.path}
              InputLabelProps={{ shrink: true }}
            />
          </div>

          {/* Index */}
          <div className="space-y-1">
            <TextField
              label="Index"
              placeholder="e.g., 1, 2, 3"
              variant="outlined"
              fullWidth
              type="number"
              {...formik.getFieldProps('index')}
              disabled={isViewMode || isSubmitting}
              error={formik.touched.index && Boolean(formik.errors.index)}
              helperText={formik.touched.index && formik.errors.index}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: 0 }}
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <FormControl fullWidth error={formik.touched.roleCode && Boolean(formik.errors.roleCode)}>
              <InputLabel id="role-select-label">Role</InputLabel>

              <Select
                labelId="role-select-label"
                value={formik.values.roleCode || ''}
                label="Role"
                onChange={(e) => formik.setFieldValue('roleCode', e.target.value)}
                disabled={isViewMode || isLoading || isSubmitting}
              >
                <MenuItem value="" disabled>
                  {isLoading ? 'Loading roles...' : 'Select Role'}
                </MenuItem>

                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.enumCode}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>

              <FormHelperText>
                {formik.touched.roleCode && formik.errors.roleCode}
              </FormHelperText>
            </FormControl>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-10">
          <Button
            variant="outlined"
            onClick={() => navigate(makeRoute(ADMIN_ROUTES.NAVLINKS,{}))}
            disabled={isSubmitting}
            className="px-6 py-2"
          >
            Cancel
          </Button>

          {!isViewMode && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => formik.handleSubmit()}
              disabled={isSubmitting || !formik.isValid}
              className="px-6 py-2 min-w-28 shadow-md hover:shadow-lg transition"
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} className="mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavlinkFormTemplate;
