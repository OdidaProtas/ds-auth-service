import { MigrationInterface, QueryRunner } from "typeorm";

export class app1664698946508 implements MigrationInterface {
    name = 'app1664698946508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "dateCreated" SET DEFAULT '1664698952071'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "dateCreated" SET DEFAULT '1664691143515'`);
    }

}
