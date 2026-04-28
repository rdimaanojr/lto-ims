export const request = async (url, method, body = null) => {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(url, options);
    const data = await res.json();

    return { status: res.status, data };
}

export const buildQuery = (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "" && value !== "undefined" && value !== "null") {
            searchParams.append(key, value);
        }
    });
    return searchParams.toString();
};