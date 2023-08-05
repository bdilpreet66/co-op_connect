import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import loginRoutes from './routes/loginRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'coopconnect',
  resave: false,
  saveUninitialized: false
}));


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', loginRoutes);


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
