import AppsController from "./controller/AppsController";
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
    method: "post",
    route: "/reset-password",
    controller: UserController,
    action: "resetPassword",
  },
  {
    method: "get",
    route: "/resend-code/:email",
    controller: UserController,
    action: "resendCode",
  },
  {
    method: "get",
    route: "/verify-access-token",
    controller: UserController,
    action: "verifyAccessToken",
  },
  {
    method: "get",
    route: "/apps",
    controller: AppsController,
    action: "all",
  },
  {
    method: "post",
    route: "/banners",
    controller: AppsController,
    action: "saveBanner",
  },
  {
    method: "get",
    route: "/banners",
    controller: AppsController,
    action: "allBanners",
  },
  {
    method: "get",
    route: "/apps/:id",
    controller: AppsController,
    action: "one",
  },
  {
    method: "get",
    route: "/apps-byslug/:slug",
    controller: AppsController,
    action: "bySlug",
  },
  {
    method: "post",
    route: "/apps",
    controller: AppsController,
    action: "save",
  },
  {
    method: "get",
    route: "/apps-owner/:id",
    controller: AppsController,
    action: "all",
  },
];
