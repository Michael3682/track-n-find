import Joi from "joi";

export const signupSchema = Joi.object({
    studentId: 
        Joi.string()
            .length(8)
            .regex(/^[0-9]+$/)
            .required()
            .messages({
                "string.empty": "Student ID cannot be empty",
                "any.required": "Student ID is required.",
                "string.pattern.base": "Student ID must be numeric",
                "string.length": "Student ID must be a valid id"
            }),
    name:
        Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                "string.empty": "Name cannot be empty",
                "any.required": "Name is required",
                "string.min": "Name must be at least 2 characters long",
                "string.max": "Name must not exceed 50 characters long"
            }),
    password:
        Joi.string()
            .required()
            .min(8)
            .regex(/(?=.*[a-z])/).message("Password must contain at least one lowercase letter.")
            .regex(/(?=.*[A-Z])/).message("Password must contain at least one uppercase letter.")
            .regex(/(?=.*\d)/).message("Password must contain at least one number.")
            .regex(/(?=.*[!@#$%^&*])/).message("Password must contain at least one special character (!@#$%^&*).")
            .messages({
                "string.empty": "Password cannot be empty",
                "any.required": "Password is required.",
                "string.min": "Password must be at least 8 characters long.",
            }),

})