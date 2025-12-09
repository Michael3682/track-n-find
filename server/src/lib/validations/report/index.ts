import Joi from "joi";

export const itemSchema = Joi.object({
    itemName: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    category: Joi.string().trim().optional(),

    // Must be a valid ISO date string
    date: Joi.string().isoDate().required(),
    time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),

    location: Joi.string().trim().required(),
    attachments: Joi.array().items(Joi.string()).optional()
});

export const updateItemSchema = Joi.object({
    itemName: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    category: Joi.string().trim().optional(),

    // Must be a valid ISO date string
    date: Joi.string().isoDate().optional(),
    time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),

    location: Joi.string().trim().optional(),
    attachments: Joi.array().items(Joi.string()).optional(),

    status: Joi.string().valid("CLAIMED", "UNCLAIMED").optional()
});

export const claimSchema = Joi.object({
    itemId: Joi.string().required(),
    claimerId: Joi.string(),
    claimerName: Joi.string(),
    credentials: Joi.object({
        yearAndSection: Joi.string().optional(),
        studentId: Joi.string().optional(),
        contactNumber: Joi.string().optional(),
        proofOfClaim: Joi.string()
    }),
    claimedAt: Joi.string().trim().isoDate(),
    reporterId: Joi.string().required(),
    conversationId: Joi.string().optional()
})

export const returnSchema = Joi.object({
    itemId: Joi.string().required(),
    returnerId: Joi.string(),
    returnerName: Joi.string(),
    credentials: Joi.object({
        yearAndSection: Joi.string().optional(),
        studentId: Joi.string().optional(),
        contactNumber: Joi.string().optional(),
        proofOfClaim: Joi.string()
    }),
    returnedAt: Joi.string().trim().isoDate(),
    reporterId: Joi.string().required(),
    conversationId: Joi.string().optional()
})