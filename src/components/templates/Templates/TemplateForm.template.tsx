import React, { useEffect, useRef, useMemo } from "react";
import type { TemplateRequest, TemplateResponse } from "../../../services/useTemplateService";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "../../atoms/TextField";
import Button from "../../atoms/Button";
import { MODE } from "../../../utils/constant";
import JoditEditor from "jodit-react";
import { useNavigate } from "react-router-dom";
import Select from "../../molecules/Select";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { makeRoute } from "../../../utils/helper";
import CustomRadioGroup from "../../molecules/CustomRadioGroup/CustomRadioGroup";
import { STATUS } from "../../../utils/types";

interface TemplateFormProps {
  onSubmit: (values: TemplateRequest) => void;
  mode: string;
  template?: TemplateResponse | null;
  loading?: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  subject: Yup.string().required("Subject is required"),
  body: Yup.string().required("Body is required"),
  type: Yup.string().required("Type is required"),
  active: Yup.string().required("Active status is required"),
});

const templateTypes = [
  { value: "EMAIL", label: "Email" },
  { value: "SMS", label: "SMS" },
  { value: "NOTIFICATION", label: "Notification" },
];

const TemplateForm: React.FC<TemplateFormProps> = ({
  onSubmit,
  mode,
  template,
  loading = false,
}) => {
  const navigate = useNavigate();
  const editor = useRef(null);

  const joditConfig = useMemo(
    () => ({
      readonly: mode === MODE.VIEW,
      placeholder: "Start typing template content...",
      height: 320,
      toolbarAdaptive: false,
      toolbarSticky: true,
      buttons:
        "bold,italic,underline,strikethrough,|,ul,ol,|,outdent,indent,|,font,fontsize,|,align,|,link,|,undo,redo",
    }),
    [mode]
  );

  const formik = useFormik<TemplateRequest>({
    initialValues: {
      name: template?.name ?? "",
      subject: template?.subject ?? "",
      body: template?.body ?? "",
      type: template?.type ?? "",
      active: template?.active ?? STATUS.ACTIVE,
    },
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const handleBodyChange = (content: string) => {
    formik.setFieldValue("body", content);
  };

  useEffect(() => {
    if (template) {
      formik.setValues(template);
    }
  }, [template]);

  return (
    <div className="w-full mx-auto px-3 sm:px-6 py-6 space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          {mode === MODE.VIEW
            ? "View Template"
            : mode === MODE.EDIT
            ? "Edit Template"
            : "Create New Template"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage email, SMS, and notification templates
        </p>
      </div>

      {/* Basic Details */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-6">
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
        />

        <Select
          label="Template Type"
          name="type"
          value={formik.values.type}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.type && Boolean(formik.errors.type)}
          helperText={
            formik.touched.type && formik.errors.type
              ? formik.errors.type
              : ""
          }
          disabled={mode === MODE.VIEW}
          options={templateTypes}
          fullWidth
          required
        />

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
        />
      </div>

      {/* Body */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-3">
        <div className="text-sm font-medium text-gray-700">
          Template Body
        </div>

        <JoditEditor
          ref={editor}
          value={formik.values.body}
          config={joditConfig}
          onBlur={handleBodyChange}
        />

        {formik.touched.body && formik.errors.body && (
          <div className="text-red-600 text-xs mt-1">
            {formik.errors.body}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
        <CustomRadioGroup
          label="Template Status"
          name="active"
          value={formik.values.active}
          onChange={(e) =>
            formik.setFieldValue("active", e.target.value)
          }
          options={Object.values(STATUS).map((status: string) => ({
            value: status,
            label: status,
          }))}
          disabled={mode === MODE.VIEW}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
        <Button
          onClick={() => navigate(makeRoute(ADMIN_ROUTES.TEMPLATES, {}))}
          variant="tertiaryContained"
          label="Cancel"
          disabled={loading}
          className="w-full sm:w-auto"
        />

        {mode !== MODE.VIEW && (
          <Button
            label={mode === MODE.ADD ? "Create Template" : "Update Template"}
            onClick={() => formik.handleSubmit()}
            variant="primaryContained"
            disabled={loading}
            className="w-full sm:w-auto"
          />
        )}
      </div>
    </div>
  );
};

export default TemplateForm;
