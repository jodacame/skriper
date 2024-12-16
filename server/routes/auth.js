import DB from '../utils/db/sqlite.js';
import JWT from '../utils/jwt.js';
import Utils from '../utils/utils.js';

const Auth = {
    async login(req, res, next) {
        const body = req.body;
        if (!body.email || !body.password) {
            return {
                error: "Email and password are required"
            }
        }
        const email = body.email;
        const password = Utils.string.sha256(body.password);

        // Check if is valid email
        if (!email || !email.includes("@")) {
            return res.status(400).json({
                error: "Invalid email"
            });
        }

        const user = await DB.query("SELECT count(*) as count FROM users");
        if (user[0].count == 0) {
            // Create the first user
            const now = new Date().getTime() / 1000;
            await DB.query("INSERT INTO users (email, password,created_at, updated_at) VALUES (?,?,?,?)", [email, password, now, now]);
        }

        const users = await DB.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password]);
        if (users.length == 0) {
            return res.status(400).json({
                error: "Invalid email or password"
            });
        }
        return res.json({
            user: {
                id: users[0].id,
                email: users[0].email
            },
            token: JWT.create(users[0].id)
        });
    }
}

export default Auth;