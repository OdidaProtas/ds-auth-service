import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { App } from "./App";
import { Profile } from "./Profile";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  accessToken: string;

  @Column()
  password: string;

  @Column({
    default: false,
  })
  emailVerified: boolean;

  @Column({
    nullable: true,
  })
  verificationCode: string;

  @Column({
    default: false,
  })
  resetRequested: boolean;

  @Column({
    default: Date.now(),
  })
  dateCreated: string;

  @OneToOne(() => Profile, (p) => p.user)
  profile: Profile;

  @ManyToOne(() => App, (a) => a.users)
  organization: App;

  @OneToMany(() => App, (app) => app.owner)
  apps: App[];
}
