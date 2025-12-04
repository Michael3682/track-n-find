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