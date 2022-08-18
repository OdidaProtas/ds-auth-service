import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";

import { AppDataSource } from "../data-source";
import trycatch from "../util/trycatch";

import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import "dotenv/config";
import generateVerificationCode from "../util/verificationCode";

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
        message: "Email and password required for authentication",
      };
    }

    const [user, userErr] = await trycatch(
      this.userRepository.findOneBy({ email: userEmail })
    );

    if (!Boolean(user) || userErr) {
      response.status(403);
      return {
        message: "Invalid user email submitted",
      };
    }

    const isValid = bcrypt.compareSync(userPassword, user.password);

    if (!isValid) {
      response.status(403);
      return {
        message: "Invalid password",
        userPassword,
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

    const transporter = request["mailTransporter"];
    const verificationCode = generateVerificationCode();

    const hashedCode = bcrypt.hashSync(verificationCode, 8);

    const [userWithCode, userWithCodeError] = await trycatch(
      this.userRepository.save({ ...user, verificationCode: hashedCode })
    );

    if (userWithCodeError) {
      response.status(400);
      return {
        err: "An error occured during signup",
      };
    }

    transporter.sendMail({
      from: '"DREAMERCODES SCHOOL" <dreamercodes.school@gmail.com>', // sender address
      to: user.email, // list of receivers
      subject: "Verification code", // Subject line
      text: `Your verification code is ${verificationCode}`, // plain text body
      html: `
      <div>
        <p>Your verification code is ${verificationCode}</p>
        <small>If you didn't sign up on dreamercodes, please ignore this email</small>
        </br>
        <b>Do not share this email.</b>
      </div>
      `, // html body
    });

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

    if (!Boolean(user.verificationCode || userError)) {
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

    const [verifiedUser, verifiedUserError] = await trycatch(
      this.userRepository.save({ ...user, emailVerified: true })
    );

    if (verifiedUserError) {
      response.status(403);

      return {
        error: "Could not verify user.",
      };
    }

    const newToken = jwt.sign({
      ...user,
      password: "******",
      verificationCode: "******",
      accessToken: "******",
    });

    const [userWithToken, userWithTokenError] = await trycatch(
      this.userRepository.save({ ...verifiedUser, acessToken: newToken })
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
}
