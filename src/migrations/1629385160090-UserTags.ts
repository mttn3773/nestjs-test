import {MigrationInterface, QueryRunner} from "typeorm";

export class UserTags1629385160090 implements MigrationInterface {
    name = 'UserTags1629385160090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_tag" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "ownerUid" uuid, "originalId" integer, CONSTRAINT "PK_ca37acfc991123d4cba963e75bf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0" UNIQUE ("nickname")`);
        await queryRunner.query(`ALTER TABLE "user_tag" ADD CONSTRAINT "FK_b04fe15c5112dd4fd730ed75ecf" FOREIGN KEY ("ownerUid") REFERENCES "user"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_tag" ADD CONSTRAINT "FK_7b803b15c8558832ffbfde0ece0" FOREIGN KEY ("originalId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_tag" DROP CONSTRAINT "FK_7b803b15c8558832ffbfde0ece0"`);
        await queryRunner.query(`ALTER TABLE "user_tag" DROP CONSTRAINT "FK_b04fe15c5112dd4fd730ed75ecf"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0"`);
        await queryRunner.query(`DROP TABLE "user_tag"`);
    }

}
