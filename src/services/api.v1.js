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

export const uploadToS3Blob = async(blob, fileNameLocal, fileType, fileSize) => {
  let data = {
    url : '',
    fileNameS3: ''
  };
  const res = await fetch(`/api/job`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ function: "makeLink", name: fileNameLocal, type: fileType,  size: fileSize })
  });

  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message || 'Error al generar URL');

  const { uploadUrl, uploadTags, downloadUrl, fileName } = json.data;

  // 2. Enviar el archivo directamente a S3
  const arrayBuffer = await blob.arrayBuffer();
  const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

  const res2 = await fetch(`/api/job`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ function: "upload", uploadUrl: uploadUrl, blob: base64Data,  fileType: fileType, uploadTags: uploadTags })
  });

  const json2 = await res2.json();
  if (json2.status !== 'success') throw new Error(json2.message || 'Error al generar URL');
  data.url = downloadUrl;
  data.fileNameS3 = fileName;
  data.res =json2.values;

  return  data;  
}