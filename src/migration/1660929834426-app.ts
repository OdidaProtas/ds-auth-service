import { MigrationInterface, QueryRunner } from "typeorm";

export class app1660929834426 implements MigrationInterface {
    name = 'app1660929834426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "email" varchar NOT NULL, "accessToken" varchar, "password" varchar NOT NULL, "emailVerified" boolean NOT NULL DEFAULT (0), "verificationCode" varchar, "resetRequested" boolean NOT NULL DEFAULT (0), "dateCreated" varchar NOT NULL DEFAULT (1660929841816), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
