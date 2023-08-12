import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import loginRoutes from './routes/loginRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js'

import path from 'path';
import { fileURLToPath } from 'url';
import flash from 'connect-flash';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'coopconnect',
  resave: false,
  saveUninitialized: false,
  cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 1 day by default
  }
}));

app.use(flash());


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

app.use('/', loginRoutes);
app.use('/company', companyRoutes);
app.use('/admin', adminRoutes);
app.use('/api', userRoutes);


// Connect to MongoDB Atlas
mongoose
.connect('mongodb+srv://dilpreetbrar:74QfzhxEZs5IsfcR@pmapi.r3dbwo3.mongodb.net/PmAPI?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("connected to mongo db");

    app.listen(port, () => {
        console.log(`App running on http://localhost:${port}`);
    });
})
.catch((error) => {
    console.log(error)
});
