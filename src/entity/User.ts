import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}
