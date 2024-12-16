import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import DB from './utils/db/sqlite.js';
import Logger from './utils/logger.js';
import cors from 'cors';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());



// Middleware
import Auth from './middleware/auth.js';
import Log from './middleware/log.js';

// Routes
import rAuth from './routes/auth.js';
import rUser from './routes/user.js';
import rProjects from './routes/projects.js';
import rChat from './routes/chat.js';



app.use(Auth.isAuthenticated);
app.use(Log.logRequest);
app.use((req, res, next) => {
    req.$logger = Logger;
    req.startTime = new Date().getTime();
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/login', rAuth.login);

// User
app.get('/user/me', rUser.get.me);
app.put('/user/password', rUser.update.password);
app.put('/user/apikey', rUser.update.apikey);

// Projects
app.get('/projects', rProjects.all);
app.post('/projects', rProjects.create);
app.get('/projects/:id', rProjects.get);
app.put('/projects/:id', rProjects.update);
app.delete('/projects/:id', rProjects.delete);
app.put('/projects/:id/files', rProjects.files.add);
app.get('/projects/:id/files', rProjects.files.all);
app.delete('/projects/:id/files/:file_id', rProjects.files.delete);

// Chat
app.post('/chat/message', rChat.message);
app.post('/chat/history', rChat.history);
app.delete('/chat/message/:project_id/:id', rChat.delete);
app.get('/chat/models', rChat.models);

app.use(Log.logRequest);

app.use((req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
    });
});


app.listen(process.env.SERVER_PORT || 3001, async () => {
    await DB.init();
    Logger.success(`Server started on port ${process.env.PORT || 3001}`);
});