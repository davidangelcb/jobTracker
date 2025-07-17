/*export default function handler(req, res) {
    const { id } = req.query;
   let aca =  `Bearer ${process.env.API_KEY_PRIVADA}`;
    res.status(200).json({ menu: aca, idJob: id });
  }  */
  
  // /api/job.js

export default async function handler(req, res) {
  const apiKey = process.env.API_KEY_PRIVADA;

  if (req.method === 'GET') {
    const jobId = req.query.id;
     const urlApi = "https://xnq1m085i6.execute-api.us-east-1.amazonaws.com/uat/api/job/"+jobId;

      const response = await fetch(urlApi, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        }
      });
  
      const data = await response.json();
      return res.status(200).json(data);
  }


  if (req.method === 'POST') {
     const urlApi = "https://xnq1m085i6.execute-api.us-east-1.amazonaws.com/uat/api/job/tracker";
  
    try {
      const response = await fetch(urlApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify(req.body)
      });
  
      const data = await response.json();
  
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Error al enviar la solicitud POST' });
    }
  }
  

  if (req.method === 'PUT') {
    switch(req.body.function){
      case "makeLink":
         const urlApi = "https://xnq1m085i6.execute-api.us-east-1.amazonaws.com/uat/api/job/uploadUrl";
      
        try {
          const response = await fetch(urlApi, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey
            },
            body: JSON.stringify(req.body)
          });      
          const data = await response.json();
      
          res.status(200).json(data);
        } catch (error) {
          res.status(500).json({ error: 'Error al enviar la solicitud POST' });
        }
      break;
      case "upload":
        ///            
      break;
    }
    return res;
  }

  // Otros métodos no soportados
  res.setHeader('Allow', ['GET', 'POST', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
