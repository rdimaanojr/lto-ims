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

export const parseDate = (val) => {
    if (!val) return val;
    const iso = String(val).slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
    const date = new Date(val);
    if (isNaN(date.getTime())) return val;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};