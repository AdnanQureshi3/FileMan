import express from "express";
import {register} from '../Controllers/user_controller.js'
import isAuthanticated from "../middlewares/Auth.js";
const router = express.Router();

// router.post('/register' , register);
router.get('/test', (req, res) => {
  res.send('Backend working fine');
});

router.route('/register').post(register)
export default router;