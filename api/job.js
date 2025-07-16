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
    const urlApi = " https://xnq1m085i6.execute-api.us-east-1.amazonaws.com/uat/api/job/4d27ce6e-f83f-4d5b-9801-1cbfc8e53582";

    if (req.method === 'AA') {
      console.log(urlApi+jobId);
      const response = await fetch(urlApi, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        }
      });
  
      const data = await response.json();
      return res.status(200).json(data);
    }
    return res.status(200).json({ message: 'get correctamente:'+jobId, received: req.params });
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
