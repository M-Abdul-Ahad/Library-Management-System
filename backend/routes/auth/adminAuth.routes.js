import express from 'express'
import { login } from '../../controllers/auth/adminAuth.controller.js'

const router=express.Router()
router.post('/login',login)

export default router