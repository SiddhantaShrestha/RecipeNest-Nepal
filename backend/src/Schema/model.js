import { model } from "mongoose";
import registerSchema from "../Schema/userSchema.js";
import blogSchema from "./blogSchema.js";
import recipeSchema from "./recipeSchema.js";
import categorySchema from "./categorySchema.js";
import orderSchema from "./orderSchema.js";

export let Register = model("Register", registerSchema);
export let Blog = model("Blog", blogSchema);
export let Recipe = model("Recipe", recipeSchema);
export let Category = model("Category", categorySchema);
export let Order = model("Order", orderSchema);
