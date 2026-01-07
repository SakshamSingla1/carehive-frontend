import React from "react";
import { type FormikProps } from "formik";
import { type UpdateUserProfileDTO } from "../../../services/useAuthService";

import TextField from "../../atoms/TextField";
import Button from "../../atoms/Button";
import { PROFILE_FORM_STATE } from "../../pages/Profile/UserProfileEdit.page";

import { FiMail, FiUser, FiPhone } from "react-icons/fi";

interface ProfileFormTemplateProps {
  onClose: () => void;
  formik: FormikProps<UpdateUserProfileDTO>;
  setUserActiveStep: (step: number) => void;
}

const ProfileFormTemplate: React.FC<ProfileFormTemplateProps> = ({
  onClose,
  formik,
  setUserActiveStep,
}) => {
  return (
    <div>
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-8 space-y-8">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-gray-900">
            Basic Information
          </h3>
          <p className="text-sm text-gray-500">
            Update your personal details below
          </p>
        </div>
        <div className="h-px bg-gray-200" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Full Name"
            placeholder="Enter your full name"
            InputProps={{ startAdornment: <FiUser size={16} /> }}
            {...formik.getFieldProps("name")}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            label="Username"
            placeholder="Choose a username"
            InputProps={{ startAdornment: <FiUser size={16} /> }}
            {...formik.getFieldProps("username")}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            label="Phone Number"
            placeholder="+91 XXXXX XXXXX"
            InputProps={{ startAdornment: <FiPhone size={16} /> }}
            {...formik.getFieldProps("phone")}
            error={
              formik.touched.phone &&
              Boolean(formik.errors.phone)
            }
            helperText={
              formik.touched.phone &&
              formik.errors.phone
            }
          />
          <TextField
            label="Email Address"
            InputProps={{ startAdornment: <FiMail size={16} /> }}
            disabled
            {...formik.getFieldProps("email")}
            helperText="Email address cannot be changed"
          />
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button
            variant="tertiaryContained"
            label="Cancel"
            onClick={onClose}
          />
          <Button
            variant="primaryContained"
            label="Continue"
            onClick={() =>
              setUserActiveStep(PROFILE_FORM_STATE.REVIEW)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileFormTemplate;
