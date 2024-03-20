import { HttpRequest } from "@/helper/request";

const upload = async (file, { filename, pathname }) => {
    const data = {
        file: new File([file], filename || file.name, {
            type: file.type,
        }),
        pathname: pathname,
    };

    const { file_url: url } = await HttpRequest.form("/file/upload", {
        data,
    });

    return url;
};

export { upload };
