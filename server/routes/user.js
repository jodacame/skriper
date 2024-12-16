import DB from '../utils/db/sqlite.js';
import Utils from '../utils/utils.js';

const USER = {
    get: {
        async me(req, res, next) {
            const user = req.user;
            const fields = req.query.fields || "id,email";
            const data = await DB.query(`SELECT ${fields} FROM users WHERE id = ?`, [user]);
            return res.status(200).json({ user: data[0] });
        }
    },
    update: {
        async password(req, res, next) {
            const body = req.body;
            if (!body.password) {
                return res.status(400).json({
                    error: "Password is required"
                });
            }
            const user = req.user;
            const password = Utils.string.sha256(body.password);
            await DB.query("UPDATE users SET password = ? WHERE id = ?", [password, user]);
            return res.status(200).json({
                success: true,
                message: {
                    type: "success",
                    text: "Password updated",
                    title: "Success"
                }
            });
        }
    }
}

export default USER;
