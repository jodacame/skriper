import DB from '../utils/db/sqlite.js';
import Utils from '../utils/utils.js';
import OpenAI from '../utils/openai.js';

const Projects = {
    async create(req, res, next) {
        const user = req.user;
        const body = req.body;
        if (!body.name || !body.description || !body.model || !body.instructions) {
            return res.status(400).json({
                error: "Name, description, model, and instructions are required"
            })
        }
        const model = body.model;
        const name = body.name;
        const description = body.description;
        const instructions = `${body.instructions}`;
        const assistant = await OpenAI.assistant.create({
            name,
            description,
            instructions: instructions + `\n\n*IMPORTANT: Only answer questions, related to this topic*"`,
            model,
        })
        const thread = await OpenAI.thread.create();

        const now = new Date().getTime() / 1000;
        const project = await DB.query(
            `INSERT INTO projects (agent_id,thread_id,name,description,created_at,updated_at,user_id,instructions ) VALUES (?,?,?,?,?,?,?,?)`,
            [assistant.id, thread.id, name, description, now, now, user, instructions]
        );
        return res.json({
            success: true,
            message: {
                type: 'success',
                text: 'Project created successfully',
            },
            project: {
                id: project.id,
            }
        })
    },
    async update(req, res, next) {
        const user = req.user;
        const id = req.params.id;
        const body = req.body;
        if (!body.name || !body.description || !body.model || !body.instructions) {
            return res.status(400).json({
                error: "Name, description, model, and instructions are required"
            })
        }
        const model = body.model;
        const name = body.name;
        const icon = body.icon || 'mdi-folder-outline';
        const icon_color = body.icon_color || 'primary';
        const description = body.description;
        const instructions = `${body.instructions}`;
        const project = await DB.query("SELECT * FROM projects WHERE id = ? AND user_id = ?", [id, user]);
        if (project.length === 0) {
            return res.status(404).json({
                error: "Project not found"
            })
        }
        await DB.query("UPDATE projects SET name = ?, description = ?, updated_at = ?, instructions = ? , icon = ?, icon_color = ? WHERE id = ?", [name, description, new Date().getTime() / 1000, instructions, icon, icon_color, id]);
        const assistant = await OpenAI.assistant.update({
            assistant_id: project[0].agent_id,
            name,
            description,
            instructions: instructions + `\n\n*IMPORTANT: Only answer questions, related to this topic*"`,
            model,
        });
        return res.json({
            success: true,
            message: {
                type: 'success',
                text: 'Project updated successfully',
            },
            project: {
                id,
                name,
                description,
                created_at: project[0].created_at,
                updated_at: project[0].updated_at,
            }
        })
    },
    async delete(req, res, next) {
        const user = req.user;
        const id = req.params.id;
        const project = await DB.query("SELECT * FROM projects WHERE id = ? AND user_id = ?", [id, user]);
        if (project.length === 0) {
            return res.status(404).json({
                error: "Project not found"
            })
        }
        await DB.query("DELETE FROM projects WHERE id = ? AND user_id = ?", [id, user]);
        await OpenAI.assistant.delete({
            assistant_id: project[0].agent_id,
        });
        await OpenAI.thread.delete({
            thread_id: project[0].thread_id,
        });
        return res.json({
            success: true,
            message: {
                type: 'success',
                text: 'Project deleted successfully',
            },
        })
    },

    files: {
        async all(req, res, next) {
            const user = req.user;
            const id = req.params.id;
            const project = await DB.query("SELECT * FROM projects WHERE id = ? AND user_id = ? ", [id, user]);
            if (project.length === 0) {
                return res.status(404).json({
                    error: "Project not found"
                })
            }
            const files = await OpenAI.assistant.file.list({
                assistant_id: project[0].agent_id,
            });
            return res.json(files);
        },
        async delete(req, res, next) {
            const user = req.user;
            const id = req.params.id;
            const fileId = req.params.file_id;
            const project = await DB.query("SELECT * FROM projects WHERE id = ? AND user_id = ?", [id, user]);
            if (project.length === 0) {
                return res.status(404).json({
                    error: "Project not found"
                })
            }
            await OpenAI.assistant.file.delete({
                assistant_id: project[0].agent_id,
                file_id: fileId,
            });
            return res.json({
                success: true,
                message: {
                    type: 'success',
                    text: 'File deleted successfully',
                },
            })
        },
        async add(req, res, next) {
            const user = req.user;
            const id = req.params.id;
            const body = req.body;
            if (!body.content || !body.name) {
                return res.status(400).json({
                    error: "Name and content are required"
                })
            }
            const project = await DB.query("SELECT * FROM projects WHERE id = ? AND user_id = ?", [id, user]);
            if (project.length === 0) {
                return res.status(404).json({
                    error: "Project not found"
                })
            }
            // content: base64
            const { name, content } = body;

            const response = await OpenAI.assistant.file.upload({
                assistant_id: project[0].agent_id,
                name,
                content,
            });

            return res.json({
                success: true,
                message: {
                    type: 'success',
                    text: 'File uploaded successfully',
                },
                file: response,
            })



        },
    },
    async all(req, res, next) {
        const user = req.user;
        const projects = await DB.query("SELECT * FROM projects WHERE user_id = ? ORDER BY last_used DESC", [user]);
        const userData = await DB.query("SELECT * FROM users WHERE id = ?", [user]);
        if (userData.length === 0) {
            return res.status(404).json({
                error: "User not found"
            })
        }
        const userRecord = userData[0];
        OpenAI.init(userRecord.openai_api_key);
        res.json(projects);
    },
    async get(req, res, next) {
        const user = req.user;
        const id = req.params.id;
        const project = await DB.query("SELECT id,icon, icon_color, agent_id,thread_id,name,description,instructions,created_at,updated_at FROM projects WHERE id = ? AND user_id = ?", [id, user]);
        if (project.length === 0) {
            return res.status(404).json({
                error: "Project not found"
            })
        }
        const assistant = await OpenAI.assistant.get(project[0].agent_id);
        // 30 seconds cache
        res.setHeader('Cache-Control', 'public, max-age=30');
        res.json({
            ...project[0],
            assistant,
        })
    }
}

export default Projects;