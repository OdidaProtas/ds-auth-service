import { Request, Response, NextFunction } from "express";

export default function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const accessToken: string = request.headers.access_token;

  if (!Boolean(accessToken)) {
    response.status = 403;

    response.sendStatus({
      message: "Please provide a valid access token",
    });
  } else {
    const token = accessToken.split(" ")[1];

    if (!Boolean(token)) {
      response.status = 403;

      response.sendStatus({
        message: "Please provide a valid access token",
      });
    } else {
      const isValid = jwt.verify(token, JWT_SECRET);
      if (isValid) {
        next();
      } else {
        response.status = 403;

        response.sendStatus({
          message: "Invalid access token",
        });
      }
    }
  }
}

var jwt = {
  verify(token: string, secret: string) {
    return true;
  },
};

var JWT_SECRET = "";
