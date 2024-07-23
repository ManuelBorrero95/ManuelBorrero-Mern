import express from 'express';
import Authors from '../models/Authors.js';
import BlogPosts from '../models/BlogPosts.js';
const router = express.Router();

router.get('/mail/:email', async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({ message: "L'email è richiesta per la ricerca" });
        }

        const author = await Authors.findOne({ email: email });

        if (!author) {
            return res.status(404).json({ message: "Autore non trovato con questa email" });
        }

        res.json(author);
    } catch (error) {
        console.error("Errore durante la ricerca dell'autore:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
});

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const sort = req.query.sort || 'nome';
        const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
        const skip = (page -1) * limit;
        const authors = await Authors.find({})
         .sort({[sort]: sortDirection})
         .skip(skip)
         .limit(limit)

         const total = await Authors.countDocuments();

         res.json({
            authors,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalAuthors: total
         })

    } catch (error) {
        res.status(500).json({message: error.message});
    }});

router.get('/:id', async (req,res) => {
    try {
        const author = await Authors.findById(req.params.id);
        if(!author) {
            return res.status(404).json({message: 'Autore non trovato'})
        } else {
            res.json(author);
        }
    } catch(err){
        res.status(500).json({message: err.message});
    }})



router.post("/", async (req, res) => {
    try {

      const author = new Authors(req.body);
  
      const newAuthor = await author.save();
  
      const authorResponse = newAuthor.toObject();
      delete authorResponse.password;

      res.status(201).json(authorResponse);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });


router.put('/:id', async (req,res) => {
    try{
        const updateAuthor = await Authors.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )
        if(!updateAuthor) {
            return res.status(404).json({message: 'Autore non trovato'})
        } else {
            res.json(updateAuthor);
        }
    } catch(err){
        res.status(400).json({message: err.message});
    }
});

router.delete('/:id', async (req,res) => {
    try{
        const deletedAuthor = await Authors.findByIdAndDelete(req.params.id);
        if(!deletedAuthor) {
            return res.status(404).json({message: 'Autore non trovato'})
        } else {
            res.json({message: 'Autore cancellato'});
        }
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});


router.get('/:id/blogPosts', async (req,res) => {
    try {
        const author = await Authors.findById(req.params.id);
        if(!author) {
            return res.status(404).json({message: 'Autore non trovato'})
        }
        const blogPosts = await BlogPosts.find({
            author: author.email
        })
        res.json(blogPosts);
    } catch(err){
        res.status(500).json({message: err.message});
}})


export default router;

