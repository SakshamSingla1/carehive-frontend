import React from "react";
import { type FormikProps } from "formik";
import { type UpdateUserProfileDTO } from "../../../services/useAuthService";
import TextField from "../../atoms/TextField";

interface ProfileFormTemplateProps {
    formik: FormikProps<UpdateUserProfileDTO>;
}

const ProfileFormTemplate : React.FC<ProfileFormTemplateProps> = ({formik}) => {
    return (
        <div className="">
            <TextField
                label="Name"
                {...formik.getFieldProps("name")}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
                label="Username"
                {...formik.getFieldProps("username")}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
            />
            <TextField
                label="Phone Number"
                {...formik.getFieldProps("phoneNumber")}
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            />
            <TextField
                label="Email"
                {...formik.getFieldProps("email")}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
            />
        </div>
    )
}

export default ProfileFormTemplate;