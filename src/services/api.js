const url = "http://localhost:3000"

export const LoginUser = async (userData) =>{

    const response = await fetch(
        `${url}/login`,
        {
            method :'post',
            headers: {
                "Content-type":"application/json",        
            },
            body:JSON.stringify(userData),
        }
    )
    const receivedData = await response.json();
     return receivedData;
}
export const RegisterUser  = async (userData) =>{
    const response = await fetch(
    `${url}/register`,
    {
        method:'post',
        headers:{
            'Content-type':'application/json',
        },
        body:JSON.stringify(userData)
    }
)
const receivedData = await response.json();
return receivedData;
}

export const getTrips = async () =>{

    const response = await fetch(
        `${url}/trips`,
    )
    const receivedData = await response.json();
    return receivedData;
}