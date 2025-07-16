/*export default function handler(req, res) {
    const { id } = req.query;
   let aca =  `Bearer ${process.env.API_KEY_PRIVADA}`;
    res.status(200).json({ menu: aca, idJob: id });
  }  */
  
  // /api/job.js
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const jobId = req.query.id;

    // Supongamos que haces un fetch externo usando tu clave secreta
 
    const apiKey = process.env.API_KEY_PRIVADA;
    const urlApi = "https://xnq1m085i6.execute-api.us-east-1.amazonaws.com/uat/api/";

    if (req.method === 'GET') {
      console.log(urlApi+jobId);
      const response = await fetch(urlApi+jobId, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        }
      });
  
      const data = await response.json();
      return res.status(200).json(data);
    }    
  }

  if (req.method === 'POST') {
    const body = req.body;
    const apiKey = process.env.API_KEY_PRIVADA;
    // Puedes procesar el body o enviarlo a otra API externa
    console.log(' Datos recibidos en POST:', apiKey);

    return res.status(200).json({ message: 'Datos guardados correctamente:'+apiKey, received: body });
  }

  // Otros métodos no soportados
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
