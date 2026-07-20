// Use Vite proxy in dev (localhost), production backend URL on Vercel
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const url = isDev ? "/api" : "https://travel-dashboard-backend-2.onrender.com"

export const LoginUser = async (userData) => {

    const response = await fetch(
        `${url}/login`,
        {
            method: 'post',
            headers: {
                "Content-type": "application/json",
            },
                credentials: "include",

            body: JSON.stringify(userData),
        }
    )
    const receivedData = await response.json();
    return receivedData;
}
export const RegisterUser = async (userData) => {
    const response = await fetch(
        `${url}/register`,
        {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
            },
                credentials: "include",

            body: JSON.stringify(userData)
        }
    )
    const receivedData = await response.json();
    return receivedData;
}

export const getTrips = async () => {

    const response = await fetch(`${url}/trips`)
    const receivedData = await response.json();
    return receivedData;
}

export default url;