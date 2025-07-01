export default async function handler(req, res) {
    try {
      const { id } = req.query;
  
      // Validación mínima
      if (!id) {
        return res.status(400).json({ error: 'Missing id parameter' });
      }
  
      const data = { menu: id };
      res.status(200).json(data);
    } catch (error) {
      console.error('❌ Error en la API:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  