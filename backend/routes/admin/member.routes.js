import express from 'express'
import { addMember,updateMember,deleteMember,getAllMembers,searchMembersByName,getMemberDetailsWithBorrowedBooks } from '../../controllers/admin/member.controller.js'


const router=express.Router();

router.post('/add',addMember)
router.put('/update/:id',updateMember)
router.delete('/delete/:id',deleteMember)
router.get('/',getAllMembers)
router.get('/search',searchMembersByName)
router.get('/borrowed-books/:id',getMemberDetailsWithBorrowedBooks)

export default router
