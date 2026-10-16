import {Router} from 'express'
import { getme, LoginUser, registerUser } from '../Controllers/authController.js';
import { protect } from '../Middleware/Auth.js';



const authRouter = Router();

authRouter.post('/register', registerUser)
authRouter.post('/login', LoginUser)
authRouter.get('/getme', protect, getme)

export default authRouter;
