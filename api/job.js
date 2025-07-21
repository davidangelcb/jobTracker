/*export default function handler(req, res) {
    const { id } = req.query;
   let aca =  `Bearer ${process.env.API_KEY_PRIVADA}`;
    res.status(200).json({ menu: aca, idJob: id });
  }  */
  
  // /api/job.js

export default async function handler(req, res) {
  const apiKey = process.env.API_KEY_PRIVADA;
  const apiURL = "https://xnq1m085i6.execute-api.us-east-1.amazonaws.com/uat/";//process.env.API_URL;
  /*
  PROD
  GET - https://ulg5nshq2f.execute-api.us-east-1.amazonaws.com/prod/api/job/{uid}
  POST - https://ulg5nshq2f.execute-api.us-east-1.amazonaws.com/prod/api/job/tracker
  POST - https://ulg5nshq2f.execute-api.us-east-1.amazonaws.com/prod/api/job/uploadUrl

  UAT
       https://xnq1m085i6.execute-api.us-east-1.amazonaws.com/uat/api/job/
       https://xnq1m085i6.execute-api.us-east-1.amazonaws.com/uat/api/job/tracker
       https://xnq1m085i6.execute-api.us-east-1.amazonaws.com/uat/api/job/uploadUrl
  */

  if (req.method === 'GET') {
    const jobId = req.query.id;
     const urlApi = apiURL+"api/job/"+jobId;

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
     const urlApi = apiURL+"api/job/tracker";
  
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
         const urlApi = apiURL+"api/job/uploadUrl";
      
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
