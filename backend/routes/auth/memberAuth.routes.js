import express from 'express'
import { signup,login,checkAuth } from '../../controllers/auth/memberAuth.controller.js'

const router=express.Router()
router.post('/signup',signup);
router.post('/login',login)
router.get('/checkauth',checkAuth)


export default router