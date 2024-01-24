// Middleware for API key authentication
import { Request, Response, NextFunction } from 'express'
const authenticateAPIKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
       return res.status(401).json({ error: "Unauthorized API key missing" });
    }

    const isValidKey = validateApiKey(apiKey)

    if (!isValidKey) {
        return res.status(401).json({ error: 'Unauthorized: Invalid API Key' })
    }

    next()
}

function validateApiKey(apiKey: string | string[] | undefined) {
    const validKey = process.env.SECRET_API_KEY;
    return apiKey === validKey
}

export default authenticateAPIKey