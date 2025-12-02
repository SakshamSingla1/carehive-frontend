import TextField from "../atoms/TextField";
import { useAuthenticatedUser } from "../../hooks/useAuthenticatedUser";
import { type AuthLoginDTO, useAuthService } from "../../services/useAuthService";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
})

const Login: React.FC = () => {
    const authService = useAuthService();
    const navigate = useNavigate();
    const { setAuthenticatedUser, setDefaultTheme, setThemes} = useAuthenticatedUser();

    const formik = useFormik<AuthLoginDTO>({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await authService.login({
                    email: values.email,
                    password: values.password
                });
                setAuthenticatedUser({
                    id: response.data.data.id,
                    email: response.data.data.email,
                    role: response.data.data.role,
                    name: response.data.data.name,
                    username: response.data.data.username,
                    phone: response.data.data.phone,
                    token: response.data.data.token,
                });
                setDefaultTheme(response.data.data.defaultTheme);
                setThemes(response.data.data.themes);
                navigate("/");
            } catch (error) {
                console.error("Login failed:", error);
            }
        }
    })

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    name="password"
                    label="Password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
export default Login;