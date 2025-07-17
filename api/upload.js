import formidable from 'formidable';
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
      const form = formidable();

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error al parsear el form:', err);
          return res.status(500).json({ status: 'error', message: 'Error al parsear archivo' });
        }

        const getField = (f) => Array.isArray(f) ? f[0] : f;
        const uploadUrl = getField(fields.uploadUrl);
        const uploadTags = getField(fields.uploadTags);
        const fileType = getField(fields.fileType);
        const file = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!file || !uploadUrl || !fileType || !uploadTags) {
          return res.status(400).json({ status: 'error', message: 'Faltan datos para la subida' });
        }

        if (!fs.existsSync(file.filepath)) {
          return res.status(400).json({ status: 'error', message: 'El archivo temporal no existe' });
        }

        try {
          const fileStream = fs.createReadStream(file.filepath);

          const uploadRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': fileType,
              'x-amz-tagging': uploadTags,
            },
            body: fileStream,
          });

          if (!uploadRes.ok) {
            const errorText = await uploadRes.text();
            console.error("S3 PUT error:", errorText);
            return res.status(500).json({ status: 'error', message: 'Fallo el PUT a S3', error: errorText });
          }

          return res.status(200).json({ status: 'success', message: 'Archivo subido a S3' });
        } catch (error) {
          console.error("Catch error:", error);
          return res.status(500).json({ status: 'error', message: 'Error al subir archivo a S3', error: error.message });
        }
      });
    } else {
      return res.status(400).json({ status: 'error', message: 'Formato incorrecto. Se esperaba multipart/form-data' });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
