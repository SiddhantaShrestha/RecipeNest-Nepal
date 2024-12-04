import Joi from "joi";

// Validation schema for creating a blog
export const blogCreationValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  category: Joi.string()
    .valid("Beginner", "Cuisine", "Health", "Dessert", "Tips")
    .required(),
  image: Joi.string().uri().required(),
});

// Validation schema for updating a blog
export const blogUpdateValidation = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(10),
  category: Joi.string().valid(
    "Beginner",
    "Cuisine",
    "Health",
    "Dessert",
    "Tips"
  ),
  image: Joi.string().uri(),
});

// Middleware to validate data against the given Joi schema
export const validateJoi = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};
