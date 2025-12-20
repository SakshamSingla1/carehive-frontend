import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { HTTP_STATUS } from "../../../utils/types";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { makeRoute } from "../../../utils/helper";

import ProgressBar from "../../atoms/ProgressBar";
import ProfileFormTemplate from "../../templates/Profile/ProfileForm.template";
import ReviewProfileTemplate from "../../templates/Profile/ReviewProfile.template";

import {
  useAuthService,
  type UpdateUserProfileDTO,
} from "../../../services/useAuthService";

/* ----------------------------- FORM STATES ----------------------------- */

export const PROFILE_FORM_STATE = {
  BASIC_DETAILS: 1,
  REVIEW: 2,
};

/* -------------------------- VALIDATION SCHEMA -------------------------- */

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    roleCode: Yup.string().required("Role is required"),
});

/* ---------------------------- COMPONENT ---------------------------- */

const UserProfileEditPage: React.FC = () => {
  const navigate = useNavigate();

  const authService = useAuthService();
  const [activeStep, setActiveStep] = useState<number>(
    PROFILE_FORM_STATE.BASIC_DETAILS
  );

  /* ------------------------------ FORMIK ------------------------------ */

  const formik = useFormik<UpdateUserProfileDTO>({
    enableReinitialize: true,
    initialValues: {
      name: "",
      username: "",
      email: "",
      phoneNumber: "",
      roleCode: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload: UpdateUserProfileDTO = {
          name: values.name,
          username: values.username,
          email: values.email,
          phoneNumber: values.phoneNumber,
          roleCode: values.roleCode
        };

        const response = await authService.updateCurrentUser(payload);
        if (response.status === HTTP_STATUS.OK) {
          navigate(makeRoute(ADMIN_ROUTES.USER_PROFILE, {}));
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
  });

  /* ------------------------------ LOAD USER ------------------------------ */

  const loadUser = async () => {
    try {
      const response = await authService.getMe();
      if (response.status === HTTP_STATUS.OK) {
        const user = response.data.data;
        formik.setValues({
          name: user.name ?? "",
          username: user.username ?? "",
          email: user.email ?? "",
          phoneNumber: user.phoneNumber ?? "",
          roleCode: user.roleCode ?? "",
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  /* ------------------------------ UI HELPERS ------------------------------ */

  const onClose = () => {
    navigate(makeRoute(ADMIN_ROUTES.USER_PROFILE, {}));
  };

  const activeFormStep = useMemo(() => {
    const props = {
      onClose,
      formik,
      setUserActiveStep: setActiveStep,
    };

    switch (activeStep) {
      case PROFILE_FORM_STATE.REVIEW:
        return <ReviewProfileTemplate {...props} />;
      default:
        return <ProfileFormTemplate {...props} />;
    }
  }, [activeStep, formik]);

  /* ------------------------------ RENDER ------------------------------ */

  return (
    <div className="grid gap-y-6">
      <div className="text-lg font-semibold">Edit Profile</div>

      <div className="grid gap-y-8">
        <ProgressBar
          steps={["Basic Details","Review"]}
          currentStep={activeStep}
        />
        {activeFormStep}
      </div>
    </div>
  );
};

export default UserProfileEditPage;
