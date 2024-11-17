import { model } from "mongoose";
import registerSchema from "../Schema/userSchema.js";

export let Register = model("Register", registerSchema);
