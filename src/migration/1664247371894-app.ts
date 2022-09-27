import { MigrationInterface, QueryRunner } from "typeorm";

export class app1664247371894 implements MigrationInterface {
    name = 'app1664247371894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" ADD "isDeactivated" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "app" ADD "deactivationDate" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "dateCreated" SET DEFAULT '1664247377057'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "dateCreated" SET DEFAULT '1664059199623'`);
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "deactivationDate"`);
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "isDeactivated"`);
    }

}
