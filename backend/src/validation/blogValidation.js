import Joi from "joi";

// Blog creation validation schema
export const blogCreationValidation = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Title is required.",
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title cannot exceed 100 characters.",
  }),
  description: Joi.string().min(10).required().messages({
    "string.empty": "Description is required.",
    "string.min": "Description must be at least 10 characters long.",
  }),
  category: Joi.string()
    .valid("Beginner", "Cuisine", "Health", "Dessert", "Tips", "Low Carb")
    .required()
    .messages({
      "string.empty": "Category is required.",
      "any.only": "Category must be one of the predefined values.",
    }),
});

// Blog update validation schema
export const blogUpdateValidation = Joi.object({
  title: Joi.string().min(3).max(100).optional().messages({
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title cannot exceed 100 characters.",
  }),
  description: Joi.string().min(10).optional().messages({
    "string.min": "Description must be at least 10 characters long.",
  }),
  category: Joi.string()
    .valid("Beginner", "Cuisine", "Health", "Dessert", "Tips")
    .optional()
    .messages({
      "any.only": "Category must be one of the predefined values.",
    }),
  tags: Joi.array().items(Joi.string().max(30)).max(10).optional().messages({
    "array.max": "You can specify up to 10 tags.",
    "string.max": "Each tag cannot exceed 30 characters.",
  }),
  user: Joi.string()
    .optional()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "User ID must be a valid MongoDB ObjectId.",
    }),
});
