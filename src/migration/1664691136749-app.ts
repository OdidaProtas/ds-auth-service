import { MigrationInterface, QueryRunner } from "typeorm";

export class app1664691136749 implements MigrationInterface {
    name = 'app1664691136749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "imageUrl" character varying, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "dateCreated" SET DEFAULT '1664691143515'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "dateCreated" SET DEFAULT '1664472719209'`);
        await queryRunner.query(`DROP TABLE "profile"`);
    }

}
