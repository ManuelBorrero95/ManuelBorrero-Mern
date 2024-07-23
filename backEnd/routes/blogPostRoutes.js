import express from 'express';
import BlogPosts from '../models/BlogPosts.js';
import { sendEmail } from "../services/emailServices.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();


router.use(authMiddleware);

router.get('/', async (req,res) => {
    try {
        let query = {};
        if(req.query.title) {
            query.title = {$regex: req.query.title, $options: 'i'}
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const sort = req.query.sort || 'name';
        const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
        const skip = (page -1) * limit;

        const blogPosts = await BlogPosts.find(query)
         .sort({[sort]: sortDirection})
         .skip(skip)
         .limit(limit);

        const total = await BlogPosts.countDocuments(query);

        res.json({
            posts: blogPosts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        });
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

router.get('/:id', async (req,res) => {
    try {
        const post = await BlogPosts.findById(req.params.id);
        if(!post) {
            return res.status(404).json({message: 'Post non trovato'})
        } else {
            res.json(post);
        }
    } catch(err){
        res.status(500).json({message: err.message});
    }})


router.get('/author/:author', async (req, res) => {
    try {
        const { author } = req.params;
        
        if (!author) {
            return res.status(400).json({ message: "L'email dell'autore è richiesta per la ricerca" });
        }

        const posts = await BlogPosts.find({ author: author });

        if (posts.length === 0) {
            return res.status(404).json({ message: "Nessun post trovato per questo autore" });
        }

        res.json(posts);
    } catch (error) {
        console.error("Errore durante la ricerca dei post dell'autore:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
});





router.put('/:id', async (req,res) => {
    try{
        const updatePost = await BlogPosts.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )
        if(!updatePost) {
            return res.status(404).json({message: 'Post non trovato'})
        } else {
            res.json(updatePost);
        }
    } catch(err){
        res.status(400).json({message: err.message});
    }
});

router.delete('/:id', async (req,res) => {
    try{
        const deletedPost = await BlogPosts.findByIdAndDelete(req.params.id);
        if(!deletedPost) {
            return res.status(404).json({message: 'Post non trovato'})
        } else {
            res.json({message: 'Post cancellato'});
        }
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});


router.get("/:id/comments", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      res.json(post.comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get("/:id/comments/:commentId", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Commento non trovato" });
      }
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  router.post("/:id/comments", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      const newComment = {
        name: req.body.name,
        email: req.body.email,
        content: req.body.content,
        avatar: req.body.avatar
      };
      post.comments.push(newComment);
      await post.save();
      res.status(201).json(newComment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.put("/:id/comments/:commentId", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Commento non trovato" });
      }
      comment.content = req.body.content;
      await post.save();
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.delete("/:id/comments/:commentId", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      

      post.comments.pull({ _id: req.params.commentId });
      

      await post.save();
      
      res.json({ message: "Commento eliminato con successo" });
    } catch (error) {
      console.error("Errore durante l'eliminazione del commento:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
export default router;