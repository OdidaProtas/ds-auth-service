import { MigrationInterface, QueryRunner } from "typeorm";

export class app1663247933355 implements MigrationInterface {
    name = 'app1663247933355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "accessToken" character varying, "password" character varying NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, "verificationCode" character varying, "resetRequested" boolean NOT NULL DEFAULT false, "dateCreated" character varying NOT NULL DEFAULT '1663247937731', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
