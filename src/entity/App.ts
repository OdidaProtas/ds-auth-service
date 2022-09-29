import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Banner from "./apps/Banners";
import { User } from "./User";

@Entity()
export class App {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  slug: string;

  @Column({
    default: false,
  })
  isDeactivated: boolean;

  @Column({
    nullable: true,
  })
  deactivationDate: string;

  @ManyToMany(() => User, (u) => u.apps)
  owner: User;

  @OneToMany(() => User, (u) => u.organization)
  users: User[];

  @OneToMany(() => Banner, (u) => u.app)
  banners: Banner[];
}
