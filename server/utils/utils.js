import crypto from 'crypto';
const UTILS = {
    string: {
        sha256: (str) => {
            return crypto.createHash('sha256').update(str).digest('hex');
        }
    }
}

export default UTILS;