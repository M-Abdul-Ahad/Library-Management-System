import express from 'express'
import { addMember,updateMember,deleteMember,getAllMembers,searchMembersByName } from '../../controllers/admin/member.controller.js'
import { authenticateToken,authorizeAdmin } from '../../middleware/auth.middleware.js';

const router=express.Router();

router.use(authenticateToken,authorizeAdmin)

router.post('/add',addMember)
router.put('/update/:id',updateMember)
router.delete('/delete/:id',deleteMember)
router.get('/',getAllMembers)
router.get('/search',searchMembersByName)

export default router
