const CorsPolicy = require('../models/CorsPolicy');
const Log = require('../models/Log');
const Api = require('../models/Api');

exports.getPolicyByApiId = async (req, res) => {
    try {
        const policy = await CorsPolicy.findOne({ apiId: req.params.apiId });
        if (!policy) {
            return res.json({
                allowedOrigins: [],
                allowedMethods: ['GET', 'POST'],
                allowCredentials: false,
                isNew: true
            });
        }
        res.json(policy);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePolicy = async (req, res) => {
    try {
        const { apiId, allowedOrigins, blacklistedOrigins, allowedMethods, allowCredentials, isDeploying } = req.body;

        if (!apiId) return res.status(400).json({ message: 'apiId is required' });

        // Fetch API - handle cases where API discovery hasn't fully synced
        const api = await Api.findById(apiId);
        const apiName = api ? api.name : 'Unknown API';
        const orgId = req.user ? req.user.organization : (api ? api.organization : null);

        // Upsert policy
        const policy = await CorsPolicy.findOneAndUpdate(
            { apiId }, // Search by API ID
            {
                organization: orgId,
                apiId,
                name: `${apiName} Policy`,
                allowedOrigins: allowedOrigins || [],
                blacklistedOrigins: blacklistedOrigins || [],
                allowedMethods: allowedMethods || ['GET', 'POST'],
                allowCredentials: !!allowCredentials,
                status: 'Active'
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (isDeploying) {
            await Log.create({
                organization: orgId,
                eventType: 'Policy Update',
                apiEndpoint: apiName,
                origin: 'INTERNAL_ADMIN',
                status: 'Allowed',
                severity: 'Low',
                details: `CORS policy deployed. Allowed Origins: ${allowedOrigins?.length || 0}, Methods: ${allowedMethods?.join(', ') || 'Default'}`
            });
        }

        // Invalidate global policy cache
        if (global.policyCache) {
            global.policyCache.data = null;
            global.policyCache.lastFetch = 0;
        }

        res.json(policy);
    } catch (err) {
        console.error('Update Policy Error:', err);
        res.status(400).json({ message: err.message });
    }
};
