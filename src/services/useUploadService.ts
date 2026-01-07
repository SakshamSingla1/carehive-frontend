import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const UPLOAD_URLS = {
    UPLOAD_FILE_BY_USERID: "upload/:userId",
};

export const useUploadService = () => {

    const { user } = useAuthenticatedUser();

    const uploadFiles = async (files: File[]) => {
        const formData = new FormData();

        files.forEach(file => {
            formData.append("files", file);
        });

        return request(
            API_METHOD.POST,
            replaceUrlParams(UPLOAD_URLS.UPLOAD_FILE_BY_USERID, { userId: user?.id }),
            null,
            formData
        );
    };

    return { uploadFiles };
};
