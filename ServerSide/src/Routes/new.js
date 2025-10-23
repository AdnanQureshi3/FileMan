import express from 'express';
import { PrismaClient } from '@prisma/client';  


const router = express.Router();

const prisma = new PrismaClient();

router.post('/new-route', async (req, res) => {
    console.log("New route accessed");
    try{
        const { email, name } = req.body;
      

        const user = await prisma.user.create({
            data: {
                email,
                name
            }
        });
        console.log(user);      

        res.json(user);
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});

router.get('/show', async (req, res) => {
    console.log("Show route accessed");
    try{
        const users = await prisma.user.deleteMany();
        res.json(users); 
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});


export default router;