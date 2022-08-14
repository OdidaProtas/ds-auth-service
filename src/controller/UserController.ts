import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";

import { AppDataSource } from "../data-source";
import trycatch from "../util/trycatch";

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
      response.status = 403;
      return {
        message: "Email and password required for authentication",
      };
    }

    const [user, userErr] = await trycatch(
      this.userRepository.findOneBy({ email: userEmail })
    );

    if (!Boolean(user) || userErr) {
      response.status = 403;
      return {
        message: "Invalid user email submitted",
      };
    }

    const isValid = bcrypt.compareSync(user.password, userPassword);

    if (!isValid) {
      response.status = 403;
      return {
        message: "Invalid password",
      };
    }

    const token = jwt.sign({ ...user, password: "" });
    user.accessToken = token;
    const [, userWithTokenError] = await trycatch(
      this.userRepository.save(user)
    );

    if (userWithTokenError) {
      response.status = 401;
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
      response.status = 401;
      return {
        message: "A valid password is required for signup",
      };
    }
    const hashedPassword = bcrypt.hashSync(rawPassword, 8);
    request.body.password = hashedPassword;
    const [user, err] = await trycatch(this.userRepository.save(request.body));
    if (err) {
      response.status = 401;
      return {
        message: "Could not sign up user",
      };
    }

    const token = jwt.sign({ ...user, password: "" });
    user.accessToken = token;
    const [, userWithTokenError] = await trycatch(
      this.userRepository.save(user)
    );

    if (userWithTokenError) {
      response.status = 401;
      return {
        message: "Could not sign up user",
      };
    }

    return {
      accessToken: token,
    };
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let userToRemove = await this.userRepository.findOneBy({
      id: request.params.id,
    });
    await this.userRepository.remove(userToRemove);
  }
}

// stub utils
var bcrypt = {
  hashSync(password: string, salt: number) {
    return password;
  },
  compareSync(userPassword: string, newPassword: string) {
    return userPassword === newPassword;
  },
};

var jwt = {
  sign(user: User) {
    return JSON.stringify(user);
  },
};
