import { model } from "mongoose";
import registerSchema from "../Schema/userSchema.js";
import blogSchema from "./blogSchema.js";
import recipeSchema from "./recipeSchema.js";

export let Register = model("Register", registerSchema);
export let Blog = model("Blog", blogSchema);
export let Recipe = model("Recipe", recipeSchema);
