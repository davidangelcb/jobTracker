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
    const urlDemo = "https://fakestoreapi.com/products/1";
    const demo = `https://example.com/job/${jobId}`
    const response = await fetch(urlDemo, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const body = req.body;

    // Puedes procesar el body o enviarlo a otra API externa
    console.log(' Datos recibidos en POST:', body);

    return res.status(200).json({ message: 'Datos guardados correctamente', received: body });
  }

  // Otros métodos no soportados
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
