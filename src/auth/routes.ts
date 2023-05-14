import { Router } from "express";

import { singUp, logIn, logOut, getCurrent, refresh } from "./controller";
import validation from "../auth/validation";
import validateField from "../auth/validateField";
import validateToken from "../auth/validateToken";
import auth from "./auth";

const router = Router();

router.post("/register", validation(validateField), singUp);
router.post("/login", validation(validateField), logIn);
router.post("/logout", auth, logOut);
router.post("/refresh", validation(validateToken), refresh);
router.get("/current", auth, getCurrent);

export default router;
