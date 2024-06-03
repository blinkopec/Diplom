import wretch, { Wretch, WretchError } from "wretch";
import { AuthActions } from "@/app/auth/utils";

// Extract necessary functions from the AuthActions utility.
const { handleJWTRefresh, storeToken, getToken } = AuthActions();

const api = () => {
    return (
        wretch("http://localhost:8000")
            // Initialize authentication with the access token.
            .auth(`Bearer ${getToken("access")}`)
            // Catch 401 errors to refresh the token and retry the request.
            .catcher(401, async (error: WretchError, request: Wretch) => {
                try {
                    // Attempt to refresh the JWT token.
                    const { access } = (await handleJWTRefresh().json()) as {
                        access: string;
                    };

                    // Store the new access token.
                    storeToken(access, "access");

                    // Replay the original request with the new access token.
                    return request
                        .auth(`Bearer ${access}`)
                        .fetch()
                        .unauthorized(() => {

                        })
                        .json();
                } catch (err) {
                    // window.location.replace("/");
                }
            })
    );
};

const _delete = (url: string) => {
    return api().delete(url).json();
};

const _get = (url: string)  => {
    return api().get(url).json();
};

const _post = (url: any, body: any) => {
    return api().post(body, url).json();
};

const _put = (url: string, body: any) => {
    return api().put(body, url).json();
};

const _patch = (url: string, body: any)  => {
    return api().patch(body, url).json();
}

export const apiRequests = {
    _delete,
    _get,
    _post,
    _put,
    _patch
}