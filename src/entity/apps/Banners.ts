import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { App } from "../App";

@Entity()
export default class Banner {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => App, (a) => a.banners)
  app: App;
}
