const url = import.meta.env.VITE_API_URL || "/api"

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