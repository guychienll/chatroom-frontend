import CONFIG from "@/config";

const COMMON_HEADERS = {
    "Content-Type": "application/json",
};
const COMMON_CONFIG = {
    headers: {
        ...COMMON_HEADERS,
    },
    credentials: "include",
};

class HttpRequest {
    static async #errorHandler(response) {
        if (response.status >= 500) {
            alert("server error");
            return;
        } else if (response.status >= 400 && response.status < 500) {
            const { code } = await response.json();
            if (!response.ok) {
                throw new Error(code);
            }
        } else {
            return response.json();
        }
    }

    static async get(path, { queryParams = {}, options = {} } = {}) {
        const hasQueryParams = !!Object.keys(queryParams).length;
        const response = await fetch(
            `${CONFIG.API_HOST}${path}${hasQueryParams ? `?${new URLSearchParams(queryParams)}` : ""}`,
            {
                method: "GET",
                ...COMMON_CONFIG,
                ...options,
            },
        );

        return this.#errorHandler(response);
    }

    static async post(path, { data, options = {} } = {}) {
        const response = await fetch(`${CONFIG.API_HOST}${path}`, {
            method: "POST",
            ...COMMON_CONFIG,
            body: JSON.stringify(data),
            ...options,
        });

        return this.#errorHandler(response);
    }

    static async put(path, { data, options = {} } = {}) {
        const response = await fetch(`${CONFIG.API_HOST}${path}`, {
            method: "PUT",
            ...COMMON_CONFIG,
            body: JSON.stringify(data),
            ...options,
        });

        return this.#errorHandler(response);
    }

    static async delete(path, { options = {} } = {}) {
        const response = await fetch(`${CONFIG.API_HOST}${path}`, {
            method: "DELETE",
            ...COMMON_CONFIG,
            ...options,
        });

        return this.#errorHandler(response);
    }

    static async form(path, { data, options = {} } = {}) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        const response = await fetch(`${CONFIG.API_HOST}${path}`, {
            method: "POST",
            body: formData,
            ...COMMON_CONFIG,
            ...options,
        });

        return this.#errorHandler(response);
    }
}

export { HttpRequest };
