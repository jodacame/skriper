import Logger from '../utils/logger.js';

const LOG = {
    logRequest(req, res, next) {
        const url = req.originalUrl
        const method = req.method
        const user = req.user
        if (!req.startTime) {
            Logger.info(`[Start] - Request: ${method} ${url} from user ${user}`)
        } else {
            const endTime = new Date().getTime()
            const duration = endTime - req.startTime
            Logger.info(`[End] - Request: ${method} ${url} from user ${user} - ${duration}ms`)
        }

        next()
    }
}

export default LOG
