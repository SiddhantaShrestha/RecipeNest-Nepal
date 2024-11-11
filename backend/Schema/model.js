import { model } from "mongoose";
import UserSchema from "./userSchema";

export let Register = model("Users", UserSchema);
