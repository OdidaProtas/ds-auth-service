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
  private userRepository = AppDataSource.getRepository(User);

  async save(request: Request, response: Response, next: NextFunction) {
    if (!Boolean(request.params.id)) {
      response.status(403);
      return {
        msg: "An error occured",
        desc: "User id has not provided",
      };
    }

    const [user, userError] = await trycatch(
      this.userRepository.find(request.params.id)
    );

    const [existingProfile] = await trycatch(
      this.profileRepository.findBy({ user })
    );

    let newProfile: Profile;

    if (!existingProfile) {
      const [prof] = await trycatch(this.profileRepository.save({ user }));
      newProfile = prof;
    } else {
      newProfile = existingProfile;
    }

    if (userError) {
      response.status(403);
      return {
        msg: "An error occured",
        desc: userError,
      };
    }

    if (request.body?.lastName) {
      user.firstName = request.body.firstName;
    }

    if (request.body?.firstName) {
      user.firstName = request.body.lastName;
    }

    if (request.body.imageUrl) {
      newProfile.imageUrl = request.body.imageUrl;
    }

    const [updatedUser, updatedUserError] = await trycatch(
      this.userRepository.save(user)
    );

    if (updatedUserError) {
      response.status(403);
      return {
        msg: "An error occured",
        desc: updatedUser,
      };
    }

    const [updatedProfile, updatedProfileError] = await trycatch(
      this.profileRepository.save({ ...newProfile, updatedUser })
    );
    if (updatedProfileError) {
      response.status(403);
      return {
        msg: "An error occured",
        desc: updatedProfileError,
      };
    }

    return updatedProfile;
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
    route: "/profiles/:id",
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
