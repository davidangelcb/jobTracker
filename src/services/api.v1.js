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


export const putImg = async (data) => {
  try {
    const res = await fetch("/api/job", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`PUT failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const uploadToS3Blob = async(blob, fileName, fileType, fileSize) => {
  const res = await fetch(`/api/job`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ function: "makeLink", name: fileName, type: fileType,  size: fileSize })
  });

  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message || 'Error al generar URL');

  const { uploadUrl, uploadTags, downloadUrl } = json.data;

  // 2. Enviar el archivo directamente a S3
  const putRes = await fetch(uploadUrl, {
    method: 'PUT',
    body: blob,
    headers: {
      'Content-Type': fileType,
      'x-amz-tagging': uploadTags
    }
  });
  if (!putRes.ok) throw new Error('Error al subir a S3');

  return downloadUrl; // URL pública o firmada
}