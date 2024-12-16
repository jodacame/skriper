import DB from '../utils/db/sqlite.js';
import Utils from '../utils/utils.js';
import OpenAI from '../utils/openai.js';
import Logger from '../utils/logger.js';
const Chat = {
    async models(req, res, next) {
        const models = await OpenAI.models.list();
        // 5 minutes cache
        if (models.length) {
            res.setHeader('Cache-Control', 'public, max-age=300');
        }
        res.json(models);
    },
    async history(req, res, next) {
        const user = req.user
        const body = req.body
        if (!body.agent_id || !body.thread_id) {
            return {
                error: "Assistant_id and thread_id are required"
            }
        }
        const messages = await OpenAI.message.all({
            thread_id: body.thread_id,
        });
        res.json(messages);
    },
    async delete(req, res, next) {
        const user = req.user
        const message_id = req.params.id
        const project_id = req.params.project_id
        const project = await DB.query("SELECT * FROM projects WHERE id = ? AND user_id = ?", [project_id, user]);
        if (project.length === 0) {
            return res.status(404).json({
                error: "Project not found"
            })
        }
        const message = await OpenAI.message.delete({
            message_id,
            thread_id: project[0].thread_id,
        });
        res.json({
            success: true,
            message: {
                type: 'success',
                text: 'Message deleted successfully',
            },
            message
        })
    },
    async message(req, res, next) {
        try {
            const user = req.user
            const body = req.body
            if (!body.message || !body.agent_id || !body.thread_id) {
                return res.status(400).json({
                    error: "Message, assistant_id and thread_id are required"
                })
            }

            const project = await DB.query("SELECT * FROM projects WHERE thread_id = ? AND user_id = ?", [body.thread_id, user]);
            if (project.length === 0) {
                return res.status(404).json({
                    error: "Project not found"
                })
            }

            await DB.query("UPDATE projects SET last_used = ? WHERE id = ?", [new Date().getTime() / 1000, project[0].id]);

            const stream = await OpenAI.message.send({
                thread_id: body.thread_id,
                assistant_id: body.agent_id,
                text: body.message,
                attachtment: body.attachment || null
            });

            res.header('Content-Type', 'application/json');
            for await (const run of stream) {
                Logger.info(`Received message from OpenAI`, run.event);
                if (run.event === 'thread.message.delta') {
                    res.write(run.data.delta.content[0].text.value);
                }
                if (run.event === 'done') {
                    Logger.info(`Done`, run);
                    res.end();
                    break;
                }
            }
            res.end();

        } catch (error) {
            res.status(500).json({
                error: error.message
            })
        }


    }
}

export default Chat;