import JWT from '../utils/jwt.js'

const AUTH = {
    isAuthenticated(req, res, next) {
        // Ignore path /login
        if (req.path.endsWith('/login')) {
            return next()
        }
        const headers = req.headers
        const token = headers['x-access-token']
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        const user = JWT.validate(token)
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        req.user = user.id
        next()
    }
}

export default AUTH