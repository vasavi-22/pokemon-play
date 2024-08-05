import { Router } from "express";
import { addUser, getUsers } from '../controllers/user.controller.js';

const router = Router();

router.get('/all',getUsers);
router.post('/adduser',addUser);


export default router;