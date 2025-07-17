import { IncomingForm } from 'formidable';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3Client({ region: process.env.S3_REGION });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const form = new IncomingForm({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw err;

      const uploadedFile = files.file;
      const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
      const filePath = file?.filepath || file?.path;
      const fileStream = fs.createReadStream(filePath);

      const filename = file.originalFilename || 'uploaded-file';

      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: filename,
        Body: fileStream,
        ContentType: file.mimetype,
      }));

      res.status(200).json({ status: 'success', message: 'Archivo subido correctamente' });
    } catch (error) {
      console.error('Error real:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al subir archivo a S3',
        error: error.message || error,
      });
    }
  });
}
