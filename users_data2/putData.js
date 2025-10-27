export const putData = async (url, userData) => {
    const updateUrl = `${url}/${userData.id}`;
    try {
        const response = await fetch(updateUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                my_key: "my_super_secret_phrase",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data; // returns the server response
    } catch (error) {
        console.error("PUT request failed:", error);
        throw error;
    }
};
