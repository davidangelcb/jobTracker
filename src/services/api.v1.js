// GET con query string
export const getJobData = async (id) => {
  try {
    const res = await fetch(`/api/job?id=${id}`);
    if (!res.ok) throw new Error(`GET failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

// POST con datos JSON
export const postJobData = async (data) => {
  try {
    const res = await fetch("/api/job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`POST failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
