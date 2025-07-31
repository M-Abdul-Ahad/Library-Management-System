import express from 'express'
import memberAuthRoutes from './routes/auth/memberAuth.routes.js'
import adminAuthRoutes from './routes/auth/adminAuth.routes.js'
import adminBookRoutes from './routes/admin/book.routes.js'
import memberRoutes from './routes/admin/member.routes.js'
import transactionRoutes from './routes/admin/transaction.routes.js'
import memberBookRoutes from './routes/member/book.routes.js'
import bookRequestRoutes from './routes/member/bookRequest.routes.js'
import accountRoutes from './routes/member/account.routes.js'

const app = express();
app.use(express.json());
app.use('/api/auth/member',memberAuthRoutes)
app.use('/api/auth/admin',adminAuthRoutes)
app.use('/api/admin/book',adminBookRoutes)
app.use('/api/admin/member',memberRoutes)
app.use('/api/admin/transaction',transactionRoutes)
app.use('/api/member/book',memberBookRoutes)
app.use('/api/member/request',bookRequestRoutes)
app.use('/api/member/account',accountRoutes)


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
