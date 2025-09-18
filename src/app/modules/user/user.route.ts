import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
// router.get("/:id", checkAuth(...Object.values(Role)), UserControllers.getMe);

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

router.get("/all-users", checkAuth(Role.ADMIN), UserControllers.getAllUsers);
router.patch("/:id", checkAuth(Role.ADMIN), UserControllers.UpdateUser);
router.patch(
  "/profile/:id",
  checkAuth(Role.USER, Role.AGENT, Role.ADMIN),
  UserControllers.updateUserProfile
);
export const UserRoutes = router;
