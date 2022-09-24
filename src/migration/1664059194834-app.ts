import { MigrationInterface, QueryRunner } from "typeorm";

export class app1664059194834 implements MigrationInterface {
    name = 'app1664059194834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "app" ADD CONSTRAINT "UQ_f36adbb7b096ceeb6f3e80ad14c" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "app" ALTER COLUMN "imageUrl" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "dateCreated" SET DEFAULT '1664059199623'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "dateCreated" SET DEFAULT '1664058857774'`);
        await queryRunner.query(`ALTER TABLE "app" ALTER COLUMN "imageUrl" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "app" DROP CONSTRAINT "UQ_f36adbb7b096ceeb6f3e80ad14c"`);
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "slug"`);
    }

}
