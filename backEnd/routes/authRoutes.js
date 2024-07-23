import express from 'express';
import Author from '../models/Authors.js';
import { generateJWT } from '../utils/Jwt.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';


const router = express.Router();

// Definisci l'URL del frontend usando una variabile d'ambiente
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';



router.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;


    const author = await Author.findOne({ email });
    if (!author) {

      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const isMatch = await author.comparePassword(password);
    if (!isMatch) {
      // Se la password non corrisponde, restituisce un errore 401
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    // Se le credenziali sono corrette, genera un token JWT
    const token = await generateJWT({ id: author._id });

    // Restituisce il token e un messaggio di successo
    res.json({ token, message: "Login effettuato con successo" });
  } catch (error) {
    // Gestisce eventuali errori del server
    console.error('Errore nel login:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
});


router.get('/me', authMiddleware, (req, res) => {

  const authorData = req.author.toObject();

  delete authorData.password;

  res.json(authorData);
});





router.get('/google/callback', 

  

  
  async (req, res) => {
    try {
      const token = await generateJWT({ id: req.user._id });
      res.redirect(`${FRONTEND_URL}/login?token=${token}`);
    } catch (error) {

      console.error('Errore nella generazione del token:', error);
      res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);



async function handleAuthCallback(req, res) {
  try {
    const token = await generateJWT({ id: req.user._id });
    const userData = {
      id: req.user._id,
      nome: req.user.nome,
      cognome: req.user.cognome,
      email: req.user.email,
      avatar: req.user.avatar
    };
    
    // Codifica i dati dell'utente per passarli in modo sicuro nell'URL
    const userDataParam = encodeURIComponent(JSON.stringify(userData));
    
    res.redirect(`${FRONTEND_URL}/login?token=${token}&userData=${userDataParam}`);
  } catch (error) {
    console.error('Errore nella generazione del token:', error);
    res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }
}

export default router;