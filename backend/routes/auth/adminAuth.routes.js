import express from 'express'
import { login,checkAuth } from '../../controllers/auth/adminAuth.controller.js'

const router=express.Router()
router.post('/login',login)
router.get('/checkauth', checkAuth);

export default router