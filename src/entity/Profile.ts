import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "./User";
import { Request, Response, NextFunction } from "express";
import trycatch from "../util/trycatch";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}

export class ProfileController {
  private profileRepository = AppDataSource.getRepository(Profile);

  async save(request: Request, response: Response, next: NextFunction) {
    const [profile, profileError] = await trycatch(
      this.profileRepository.save(request.body)
    );
    if (profileError) {
      response.status(403);
      return {
        msg: "An error occured",
        desc: profileError,
      };
    }

    return profile;
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const [profiles, profileError] = await trycatch(
      this.profileRepository.find({ where: { user: request.params.id } })
    );
    if (profileError) {
      response.status(403);
      return {
        msg: "An error occured",
        desc: profileError,
      };
    }

    return profiles[0];
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const [profiles, profileError] = await trycatch(
      this.profileRepository.find()
    );
    if (profileError) {
      response.status(403);
      return {
        msg: "An error occured",
        desc: profileError,
      };
    }

    return profiles;
  }
}

export const profileRoutes = [
  {
    method: "post",
    route: "/profiles",
    controller: ProfileController,
    action: "save",
  },
  {
    method: "get",
    route: "/profiles/:id",
    controller: ProfileController,
    action: "one",
  },
  {
    method: "get",
    route: "/profiles",
    controller: ProfileController,
    action: "all",
  },
];
