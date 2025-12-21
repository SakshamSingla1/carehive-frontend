import React, { useEffect, useRef, useMemo } from "react";
import type { ServiceRequest, ServiceResponse } from "../../../services/useServicesService";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "../../atoms/TextField";
import Button from "../../atoms/Button";
import { MODE } from "../../../utils/constant";
import JoditEditor from "jodit-react";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { makeRoute } from "../../../utils/helper";
import CustomRadioGroup from "../../molecules/CustomRadioGroup/CustomRadioGroup";
import { STATUS } from "../../../utils/types";

interface TemplateFormProps {
  onSubmit: (values: ServiceRequest) => void;
  mode: string;
  service?: ServiceResponse | null;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  pricePerHour: Yup.string().required("Price per hour is required"),
  status: Yup.string().required("Status is required"),
});

const TemplateForm: React.FC<TemplateFormProps> = ({
  onSubmit,
  mode,
  service,
}) => {
  const navigate = useNavigate();
  const editor = useRef(null);

  const joditConfig = useMemo(
    () => ({
      readonly: mode === MODE.VIEW,
      placeholder: "Start typing service description...",
      height: 320,
      toolbarAdaptive: false,
      toolbarSticky: true,
      buttons:
        "bold,italic,underline,strikethrough,|,ul,ol,|,outdent,indent,|,font,fontsize,|,align,|,link,|,undo,redo",
    }),
    [mode]
  );

  const formik = useFormik<ServiceRequest>({
    initialValues: {
      name: service?.name ?? "",
      description: service?.description ?? "",
      pricePerHour: service?.pricePerHour?.toString() ?? "",
      status: service?.status ?? "",
    },
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const handleDescriptionChange = (content: string) => {
    formik.setFieldValue("description", content);
  };

  useEffect(() => {
    if (service) {
      formik.setValues(service);
    }
  }, [service]);

  return (
    <div className="w-full mx-auto px-3 sm:px-6 py-6 space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          {mode === MODE.VIEW
            ? "View Service"
            : mode === MODE.EDIT
            ? "Edit Service"
            : "Create New Service"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage service details, pricing, and availability
        </p>
      </div>

      {/* Basic Info */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <TextField
            fullWidth
            label="Service Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            disabled={mode === MODE.VIEW}
          />

          <TextField
            fullWidth
            label="Price per Hour"
            name="pricePerHour"
            value={formik.values.pricePerHour}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            InputProps={{
                startAdornment: <span className="text-gray-500">₹</span>,
                endAdornment: <span className="text-gray-500">/hr</span>,
            }}
            error={
              formik.touched.pricePerHour &&
              Boolean(formik.errors.pricePerHour)
            }
            helperText={
              formik.touched.pricePerHour && formik.errors.pricePerHour
            }
            disabled={mode === MODE.VIEW}
          />
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-3">
        <div className="text-xl font-normal ">
          Service Description
        </div>

        <JoditEditor
          ref={editor}
          value={formik.values.description}
          config={joditConfig}
          onBlur={handleDescriptionChange}
        />

        {formik.touched.description && formik.errors.description && (
          <div className="text-red-600 text-xs mt-1">
            {formik.errors.description}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
        <CustomRadioGroup
          name="status"
          label="Service Status"
          options={Object.values(STATUS).map((status: string) => ({
            value: status,
            label: status,
          }))}
          value={formik.values.status || ""}
          onChange={formik.handleChange}
          disabled={mode === MODE.VIEW}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
        <Button
          onClick={() => navigate(makeRoute(ADMIN_ROUTES.SERVICES, {}))}
          variant="tertiaryContained"
          label="Cancel"
        />

        {mode !== MODE.VIEW && (
          <Button
            label={mode === MODE.ADD ? "Create Service" : "Update Service"}
            onClick={() => formik.handleSubmit()}
            variant="primaryContained"
            disabled={!formik.isValid || formik.isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default TemplateForm;
