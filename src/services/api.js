export const apiUrl = import.meta.env.VITE_API_URL || "https://travel-dashboard-backend-2.onrender.com";

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON response from ${response.url}: ${text}`);
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, options);
  const data = await parseJsonResponse(response);

  if (!response.ok) {
    if (data && data.message) {
      throw new Error(data.message);
    }
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return data;
}

export async function loginUser(data) {

    const response = await fetch(
        "https://travel-dashboard-backend-2.onrender.com/login",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify(data)
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Login failed"
        );
    }

    return result;
}

export const faceLogin = async (faceData) => {
  return request("/face-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(faceData),
  });
};

export const registerUser = async (userData) => {
  return request("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });
};

export const getProfile = async () => {
  return request("/profile", {
    credentials: "include",
  });
};

export const updateProfile = async (profileData) => {
  return request("/profile", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });
};

export const logoutUser = async () => {
  return request("/logout", {
    method: "POST",
    credentials: "include",
  });
};

export const getTrips = async () => {
  return request("/trips");
};

export const createTrip = async (tripData) => {
  return request("/trips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  });
};

export const getDestinations = async () => {
  return request("/destinations");
};

export const getDestinationById = async (id) => {
  return request(`/destinations/${id}`);
};

export const createOrder = async (amount) => {
  return request("/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });
};

export default apiUrl;
