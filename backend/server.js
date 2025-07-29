import express from 'express'
import memberAuthRoutes from './routes/auth/memberAuth.routes.js'
import adminAuthRoutes from './routes/auth/adminAuth.routes.js'
import bookRoutes from './routes/admin/book.routes.js'
import memberRoutes from './routes/admin/member.routes.js'
import transactionRoutes from './routes/admin/transaction.routes.js'


const app = express();
app.use(express.json());
app.use('/api/auth/member',memberAuthRoutes)
app.use('/api/auth/admin',adminAuthRoutes)
app.use('/api/admin/book',bookRoutes)
app.use('/api/admin/member',memberRoutes)
app.use('/api/admin/transaction',transactionRoutes)


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
