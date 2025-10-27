export const putData = async (url, userData) => {
  const updateUrl = `${url}/${userData.id}`;
  console.log("Sending data...", updateUrl, userData);

  try {
    const response = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        my_key: "my_super_secret_phrase",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log("✅ Server response:", data);
    return data;
  } catch (error) {
    console.error("❌ PUT request failed:", error);
    throw error;
  }
};
