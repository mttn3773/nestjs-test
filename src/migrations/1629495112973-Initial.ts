import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1629495112973 implements MigrationInterface {
    name = 'Initial1629495112973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_tag" ("targetId" uuid NOT NULL, "tagId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_e59c46eff61a24a52e73b0001d8" PRIMARY KEY ("targetId", "tagId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "nickname" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0" UNIQUE ("nickname"), CONSTRAINT "PK_df955cae05f17b2bcf5045cc021" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "creatorId" uuid NOT NULL, "name" character varying NOT NULL, "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_tag" ADD CONSTRAINT "FK_a32003d97e329cf9e6ca04e4724" FOREIGN KEY ("targetId") REFERENCES "user"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_tag" ADD CONSTRAINT "FK_d1c8261be4e02dc1df64636250c" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_07caa6f5e5a4ebf9a46c65669eb" FOREIGN KEY ("creatorId") REFERENCES "user"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_07caa6f5e5a4ebf9a46c65669eb"`);
        await queryRunner.query(`ALTER TABLE "user_tag" DROP CONSTRAINT "FK_d1c8261be4e02dc1df64636250c"`);
        await queryRunner.query(`ALTER TABLE "user_tag" DROP CONSTRAINT "FK_a32003d97e329cf9e6ca04e4724"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_tag"`);
    }

}
