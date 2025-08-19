import express from "express";
import {register , login , deleteUser} from '../Controllers/user_controller.js'
import isAuthanticated from "../middlewares/Auth.js";
const router = express.Router();


// router.get('/test', (req, res) => {
//   res.send('Backend working fine');
// });

router.route('/register').post(register)
router.post('/login' , login);
router.delete('/delete', isAuthanticated, deleteUser);

export default router;