import { MigrationInterface, QueryRunner } from "typeorm";

export class app1664472712366 implements MigrationInterface {
    name = 'app1664472712366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "banner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "imageUrl" character varying NOT NULL, "appId" uuid, CONSTRAINT "PK_6d9e2570b3d85ba37b681cd4256" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "dateCreated" SET DEFAULT '1664472719209'`);
        await queryRunner.query(`ALTER TABLE "banner" ADD CONSTRAINT "FK_0a51623642609eed77798ab3a24" FOREIGN KEY ("appId") REFERENCES "app"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banner" DROP CONSTRAINT "FK_0a51623642609eed77798ab3a24"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "dateCreated" SET DEFAULT '1664247377057'`);
        await queryRunner.query(`DROP TABLE "banner"`);
    }

}
