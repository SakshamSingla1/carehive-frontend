import React from "react";
import { type FormikProps } from "formik";
import { type UpdateUserProfileDTO } from "../../../services/useAuthService";
import Button from "../../atoms/Button";
import { PROFILE_FORM_STATE } from "../../pages/Profile/UserProfileEdit.page";

interface ReviewProfileTemplateProps {
  formik: FormikProps<UpdateUserProfileDTO>;
  onClose: () => void;
  setUserActiveStep: (step: number) => void;
}

const ReviewProfileTemplate: React.FC<ReviewProfileTemplateProps> = ({
  formik,
  onClose,
  setUserActiveStep,
}) => {
  const { values, handleSubmit, isSubmitting } = formik;

  return (
    <div>
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-8 space-y-8">

        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-gray-900">
            Review Your Profile
          </h3>
          <p className="text-sm text-gray-500">
            Please verify the details below before saving changes
          </p>
        </div>

        <div className="h-px bg-gray-200" />

        {/* Review Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{values.name || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500">Username</p>
            <p className="font-medium text-gray-900">
              {values.username || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Phone Number</p>
            <p className="font-medium text-gray-900">
              {values.phoneNumber || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium text-gray-900">
              {values.email || "-"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">

          <div className="flex gap-3">
            <Button
              variant="tertiaryContained"
              label="Cancel"
              onClick={onClose}
            />

            <Button
              variant="secondaryContained"
              label="Back"
              onClick={() =>
                setUserActiveStep(PROFILE_FORM_STATE.BASIC_DETAILS)
              }
            />
          </div>

          <Button
            variant="primaryContained"
            label={isSubmitting ? "Saving..." : "Confirm & Save"}
            disabled={isSubmitting}
            onClick={() => handleSubmit()}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewProfileTemplate;
