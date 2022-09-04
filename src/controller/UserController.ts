import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";

import { AppDataSource } from "../data-source";
import trycatch from "../util/trycatch";

import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import "dotenv/config";
import generateVerificationCode from "../util/verificationCode";
import createVerificationMail from "../util/createVerificationMail";
import createResetEmail from "../util/createResetEmail";
import createPasswordResetSuccessEmail from "../util/createPasswordResetSuccessEmail";

const JWT_SECRET = process.env.DREAMER_CODES_API_JWT_SECRET;

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.findOne(request.params.id);
  }

  async generateToken(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const userEmail = request.body.email;
    const userPassword = request.body.password;

    if (!Boolean(userEmail) || !Boolean(userPassword)) {
      response.status(403);
      return {
        msg: "Authentication failed",
        desc: "Email and password required for authentication",
      };
    }

    const [user, userErr] = await trycatch(
      this.userRepository.findOneBy({ email: userEmail })
    );

    if (!Boolean(user) || userErr) {
      response.status(404);
      return {
        msg: "Authentication failed",
        desc: userErr ?? "User account not found",
      };
    }

    const isValid = bcrypt.compareSync(userPassword, user.password);

    if (!isValid) {
      response.status(403);
      return {
        msg: "User authentication failed",
        desc: "Password is incorrect",
      };
    }

    const token = jwt.sign(
      { ...user, password: "", accessToken: "" },
      JWT_SECRET
    );
    user.accessToken = token;
    const [, userWithTokenError] = await trycatch(
      this.userRepository.save(user)
    );

    if (userWithTokenError) {
      response.status(401);
      return {
        message: "Could not sign up user",
      };
    }

    return {
      accessToken: token,
    };
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const rawPassword = request.body.password;
    if (!Boolean(rawPassword)) {
      response.status(401);
      return {
        message: "A valid password is required for signup",
      };
    }

    const hashedPassword = bcrypt.hashSync(rawPassword, 8);
    request.body.password = hashedPassword;
    const [user, err] = await trycatch(this.userRepository.save(request.body));
    if (err) {
      response.status(401);
      return {
        message: "Could not sign up user",
        desc: err,
      };
    }

    const verificationCode = generateVerificationCode();

    const hashedCode = bcrypt.hashSync(verificationCode, 8);
    user.verificationCode = hashedCode;
    const [userWithCode, userWithCodeError] = await trycatch(
      this.userRepository.save(user)
    );

    if (userWithCodeError) {
      response.status(400);
      return {
        err: "An error occured during signup",
      };
    }

    request["mailer"].sendMail(
      createVerificationMail(verificationCode, user.email)
    );

    const token = jwt.sign(
      {
        ...user,
        password: "******",
        verificationCode: "******",
        confirmPassword: "*******",
        accessToken: "******",
      },
      JWT_SECRET
    );

    const [userWithToken, userWithTokenError] = await trycatch(
      this.userRepository.save({ ...user, accessToken: token })
    );

    if (userWithTokenError) {
      response.status(401);
      return {
        err: "An error occured during registration",
      };
    }

    return {
      accessToken: token,
    };
  }

  async verificationCode(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const userID = request.params.id;
    const verificationCode = request.body.verificationCode;

    const [user, userError] = await trycatch(
      this.userRepository.findOneBy({ id: userID })
    );

    if (Boolean(userError) || !Boolean(user?.verificationCode)) {
      response.status(401);

      return {
        error: "Could not verify user.",
      };
    }

    const isValid = bcrypt.compareSync(verificationCode, user.verificationCode);

    if (!isValid) {
      response.status(400);

      return {
        error: "Could not verify user.",
      };
    }

    user.emailVerified = true;
    const [verifiedUser, verifiedUserError] = await trycatch(
      this.userRepository.save(user)
    );

    if (verifiedUserError) {
      response.status(403);

      return {
        error: "Could not verify user.",
      };
    }

    const newToken = jwt.sign(
      {
        ...user,
        password: "******",
        verificationCode: "******",
        accessToken: "******",
      },
      JWT_SECRET
    );

    verifiedUser.accessToken = newToken;
    const [userWithToken, userWithTokenError] = await trycatch(
      this.userRepository.save(verifiedUser)
    );

    if (userWithTokenError) {
      response.status(403);

      return {
        error: "Could not verify user.",
      };
    }

    return {
      accessToken: newToken,
    };
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let userToRemove = await this.userRepository.findOneBy({
      id: request.params.id,
    });
    await this.userRepository.remove(userToRemove);
  }

  async requestReset(request: Request, response: Response, next: NextFunction) {
    const email = request.body.email;

    const [user, userError] = await trycatch(
      this.userRepository.findOneBy({ email })
    );

    if (!Boolean(user) || userError) {
      response.status(403);
      return {
        msg: "Requested user not found!",
        desc: userError,
      };
    }

    const verificationCode = generateVerificationCode();

    request["mailer"].sendMail(createResetEmail(verificationCode, user.email));

    const hashedCode = bcrypt.hashSync(verificationCode, 8);

    user.verificationCode = hashedCode;
    user.resetRequested = true;
    const [, userWithCodeError] = await this.userRepository.save(user);

    if (userWithCodeError) {
      response.status(403);
      return {
        msg: "An error occured",
        desc: userWithCodeError,
      };
    }

    return {
      msg: "Reset request successful",
    };
  }

  async resetPassword(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const email = request.body.email;
    const verificationCode = request.body.verificationCode;
    const newPassword = request.body.password;

    const [user, userErr] = await trycatch(
      this.userRepository.findOneBy({ email })
    );

    if (userErr || !Boolean(user)) {
      response.status(403);
      return {
        msg: "User not found",
        desc: userErr,
      };
    }

    const hasRequested = user.resetRequested;

    if (!hasRequested) {
      response.status(403);
      return {
        msg: "User hasn't requested password reset",
      };
    }

    const isValid = bcrypt.compareSync(verificationCode, user.verificationCode);

    if (!isValid) {
      response.status(403);
      return {
        msg: "Invalid verification code submitted",
      };
    }

    const password = bcrypt.hashSync(newPassword, 8);
    user.password = password;
    user.resetRequested = false;
    const [, updatedUserError] = await trycatch(this.userRepository.save(user));

    if (updatedUserError) {
      response.status(403);
      return {
        msg: "Password reset request unsuccessful",
      };
    }

    request["mailer"].sendMail(createPasswordResetSuccessEmail(user.email));

    return {
      msg: "Password has been reset",
    };
  }

  async resendCode(request: Request, response: Response, next: NextFunction) {
    const email = request.params.email;
    if (!Boolean(email)) {
      response.status(403);
      return {
        msg: "Email address error",
        desc: "User not foud",
      };
    }

    const [user, userError] = await trycatch(
      this.userRepository.findOneBy({ email })
    );

    if (!Boolean(user) || Boolean(userError)) {
      response.status(403);
      return {
        msg: "Email address error",
        desc: "User not foud",
      };
    }

    const verificationCode = generateVerificationCode();
    const hashedCode = bcrypt.hashSync(verificationCode, 8);
    request["mailer"].sendMail(createVerificationMail(verificationCode, email));

    user.verificationCode = hashedCode;

    const [, userWithCodeError] = await trycatch(
      this.userRepository.save(user)
    );

    if (userWithCodeError) {
      response.status(403);
      return {
        msg: "Error",
        desc: userWithCodeError,
      };
    }

    return {
      msg: "Verification code resent!",
    };
  }

  async verifyAccessToken(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const accessToken: string = request.headers.access_token;
    if (!Boolean(accessToken)) {
      response.status(403);
      return {
        msg: "Failed to authenticate user",
        desc: "Request missing access token",
      };
    }

    const correctFormat = accessToken.startsWith("Bearer");
    if (!correctFormat) {
      response.status(403);
      return {
        msg: "Failed to authenticate user",
        desc: "Invalid access token provided",
      };
    }

    const token = accessToken.split(" ")[1];

    if (!Boolean(token)) {
      response.status(403);
      return {
        msg: "Failed to authenticate user",
        desc: "Invalid access token provided",
      };
    }

    try {
      const decodedUser = jwt.decode(token);

      const [user, userError] = await trycatch(
        this.userRepository.findOne(decodedUser.id)
      );

      if (!Boolean(user) || userError) {
        response.status(404);
        return {
          msg: "An error occuered",
          desc: userError ?? "User not found",
        };
      }

      const isSavedToken = user.accessToken === token;

      if (!isSavedToken) {
        response.status(403);
        return {
          msg: "Authentication failed",
          desc: "Access token provided is invalid or expired",
        };
      }

      return {
        user: {
          ...user,
          accessToken: "******",
          password: "******",
          verificationCode: "******",
          resetRequested: "*****",
        },
      };
    } catch (e) {
      response.status(500);
      return {
        msg: "An error occured",
        desc: e,
      };
    }
  }
}
