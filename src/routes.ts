import { UserController } from "./controller/UserController";

export const Routes = [
  {
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
  },
  {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one",
  },
  {
    method: "post",
    route: "/signup",
    controller: UserController,
    action: "save",
  },
  {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove",
  },
  {
    method: "post",
    route: "/generate-token",
    controller: UserController,
    action: "generateToken",
  },
  {
    method: "post",
    route: "/verify/:id",
    controller: UserController,
    action: "verificationCode",
  },
  {
    method: "post",
    route: "/request-reset",
    controller: UserController,
    action: "requestReset",
  },
  {
    method: "/post",
    route: "reset-password",
    controller: UserController,
    action: "resetPassword",
  },
];
