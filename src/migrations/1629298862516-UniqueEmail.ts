import {MigrationInterface, QueryRunner} from "typeorm";

export class UniqueEmail1629298862516 implements MigrationInterface {
    name = 'UniqueEmail1629298862516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."tag" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."tag" ADD "sortOrder" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "public"."tag" DROP COLUMN "sortOrder"`);
        await queryRunner.query(`ALTER TABLE "public"."tag" DROP COLUMN "name"`);
    }

}
