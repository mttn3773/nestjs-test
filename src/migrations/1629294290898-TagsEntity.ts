import {MigrationInterface, QueryRunner} from "typeorm";

export class TagsEntity1629294290898 implements MigrationInterface {
    name = 'TagsEntity1629294290898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "creatorUid" uuid, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_1d9e7c347d02fb20f42d68a23cf" FOREIGN KEY ("creatorUid") REFERENCES "user"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_1d9e7c347d02fb20f42d68a23cf"`);
        await queryRunner.query(`DROP TABLE "tag"`);
    }

}
