const CorsPolicy = require('../models/CorsPolicy');

const dynamicCorsMiddleware = async (req, res, next) => {
    const origin = req.headers.origin;

    if (!origin) {
        return next();
    }

    try {
        // Search for the policy in MongoDB
        const policy = await CorsPolicy.findOne({ origin: origin.toLowerCase() });

        if (policy) {
            // Set CORS headers based on the stored policy
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Methods', policy.allowedMethods.join(', '));
            res.setHeader('Access-Control-Allow-Headers', policy.allowedHeaders.join(', '));
            res.setHeader('Access-Control-Max-Age', policy.maxAge);

            if (policy.allowCredentials) {
                res.setHeader('Access-Control-Allow-Credentials', 'true');
            }

            // Handle Preflight requests
            if (req.method === 'OPTIONS') {
                return res.status(204).end();
            }
        } else {
            // Default behavior or strict denial if no policy found
            // For this demo, we'll just not set any CORS headers which implies denial by browser
            if (req.method === 'OPTIONS') {
                return res.status(403).json({ message: 'CORS policy not found for this origin' });
            }
        }
    } catch (error) {
        console.error('Error fetching CORS policy:', error);
    }

    next();
};

module.exports = dynamicCorsMiddleware;
