// Update the imports
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { HTTP_STATUS } from '../../../utils/types';
import { MODE, ROLES } from '../../../utils/constant'; // Assuming you have ROLES constant
import { ADMIN_ROUTES } from '../../../utils/constant';
import ProgressBar from '../../atoms/ProgressBar';
import ProfileFormTemplate from '../../templates/Profile/ProfileForm.template';
import { useAuthService, type UpdateUserProfileDTO } from '../../../services/useAuthService';
import { makeRoute } from '../../../utils/helper';

interface FormStates {
    BASIC_DETAILS: number;
    CARETAKER_INFORMATION?: number;
    REVIEW: number;
}

const getProfileFormStates = (roleCode?: string): FormStates => {
    const baseStates = {
        BASIC_DETAILS: 1,
        REVIEW: 2
    };

    if (roleCode === ROLES.CARETAKER) {
        return {
            ...baseStates,
            CARETAKER_INFORMATION: 2,
            REVIEW: 3
        };
    }

    return baseStates;
};

// Update the validation schema to be dynamic
const getValidationSchema = (roleCode?: string) => {
    const baseSchema = {
        name: Yup.string().required("Name is required"),
        username: Yup.string().required("Username is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        phoneNumber: Yup.string().required("Phone number is required"),
        roleCode: Yup.string().required("Role is required"),
    };

    if (roleCode === ROLES.CARETAKER) {
        return Yup.object({
            ...baseSchema,
            serviceIds: Yup.array()
                .of(Yup.string())
                .min(1, "Select at least one service")
                .required("Service IDs are required"),
            documentIds: Yup.array()
                .of(Yup.string())
                .min(1, "Attach at least one document")
                .required("Document IDs are required"),
            caretakerStatus: Yup.string().required("Caretaker status is required"),
        });
    }

    return Yup.object(baseSchema);
};

const UserProfileEditPage: React.FC = () => {
    const navigate = useNavigate();
    const authService = useAuthService();
    const [userRole, setUserRole] = useState<string>('');
    const [userActiveStep, setUserActiveStep] = useState<number>(1);

    const PROFILE_FORM_STATE = getProfileFormStates(userRole);
    const validationSchema = getValidationSchema(userRole);

    const formik = useFormik<UpdateUserProfileDTO>({
        initialValues: {
            name: "",
            username: "",
            email: "",
            phoneNumber: "",
            roleCode: "",
            ...(userRole === ROLES.CARETAKER && {
                serviceIds: [],
                documentIds: [],
                caretakerStatus: ""
            })
        },
        validationSchema,
        validateOnChange: true,
        validateOnMount: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            try {
                const data: UpdateUserProfileDTO = {
                    name: values.name,
                    username: values.username,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    roleCode: values.roleCode,
                    ...(values.roleCode === ROLES.CARETAKER && {
                        serviceIds: values.serviceIds,
                        documentIds: values.documentIds,
                        caretakerStatus: values.caretakerStatus
                    })
                };

                const response = await authService.updateCurrentUser(data);
                if (response.status === HTTP_STATUS.OK) {
                    navigate(makeRoute(ADMIN_ROUTES.USER_PROFILE, {}));
                }
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        }
    });

    const loadUser = async () => {
        try {
            const response = await authService.getMe();
            if (response.status === HTTP_STATUS.OK) {
                const userData = response.data.data;
                setUserRole(userData.roleCode);

                formik.setValues({
                    name: userData.name,
                    username: userData.username,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    roleCode: userData.roleCode,
                    ...(userData.roleCode === ROLES.CARETAKER && {
                        serviceIds: userData.serviceIds || [],
                        documentIds: userData.documentIds || [],
                        caretakerStatus: userData.caretakerStatus
                    })
                });
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const onClose = () => {
        navigate(makeRoute(ADMIN_ROUTES.USER_PROFILE, {}));
    };

    const getProgressBarSteps = () => {
        const steps = ['Basic Details'];
        if (userRole === ROLES.CARETAKER) {
            steps.push('Caretaker Information');
        }
        steps.push('Review');
        return steps;
    };

    const getCaretakerActiveFormStep = (props: any, step: number) => {
        switch (step) {
            case PROFILE_FORM_STATE.BASIC_DETAILS:
                return <ProfileFormTemplate {...props} step="basic" />;
            case PROFILE_FORM_STATE.CARETAKER_INFORMATION:
                return <ProfileFormTemplate {...props} step="caretaker" />;
            case PROFILE_FORM_STATE.REVIEW:
                return <ProfileFormTemplate {...props} step="review" />;
            default:
                return <ProfileFormTemplate {...props} step="basic" />;
        }
    };

    const getDefaultActiveFormStep = (props: any, step: number) => {
        switch (step) {
            case PROFILE_FORM_STATE.BASIC_DETAILS:
                return <ProfileFormTemplate {...props} step="basic" />;
            case PROFILE_FORM_STATE.REVIEW:
                return <ProfileFormTemplate {...props} step="review" />;
            default:
                return <ProfileFormTemplate {...props} step="basic" />;
        }
    };

    const activeFormStep = useMemo(() => {
        const props = {
            mode: MODE.EDIT,
            onClose,
            formik,
            setUserActiveStep,
            role: userRole
        };

        return userRole === ROLES.CARETAKER
            ? getCaretakerActiveFormStep(props, userActiveStep)
            : getDefaultActiveFormStep(props, userActiveStep);

    }, [userActiveStep, formik, userRole, onClose]);

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <div>
            <div className="grid gap-y-6">
                <div className="text-lg font-semibold">
                    Edit Profile
                </div>
                <div className="grid gap-y-8">
                    <ProgressBar
                        steps={getProgressBarSteps()}
                        currentStep={userActiveStep}
                    />
                    <div>{activeFormStep}</div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileEditPage;