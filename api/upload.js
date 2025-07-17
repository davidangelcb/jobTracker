import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // necesario para manejar archivos con formidable
  },
};
export default async function handler(req, res) {
  if (req.method === "PUT") {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
      const form = new formidable.IncomingForm();
    
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error al parsear el form:', err);
          return res.status(500).json({ status: 'error', message: 'Error al parsear archivo' });
        }
      
        const { uploadUrl, uploadTags, fileType } = fields;
        const file = files.file;
      
        if (!file || !uploadUrl || !fileType || !uploadTags) {
          return res.status(400).json({ status: 'error', message: 'Faltan datos para la subida' });
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
            return res.status(500).json({ status: 'error', message: 'Fallo el PUT a S3', error: errorText });
          }
      
          return res.status(200).json({ status: 'success', message: 'Archivo subido a S3' });
        } catch (error) {
          return res.status(500).json({ status: 'error', message: 'Error al subir archivo a S3', error });
        }
      });
      
    }
    return res;
  }

  // Otros métodos no soportados
  res.setHeader("Allow", ["PUT"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
