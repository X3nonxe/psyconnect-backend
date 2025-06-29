import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserWithProfileFields1750689426093 implements MigrationInterface {
    name = 'UpdateUserWithProfileFields1750689426093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tokens_type_enum" AS ENUM('access', 'refresh')`);
        await queryRunner.query(`CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "expires" TIMESTAMP NOT NULL, "type" "public"."tokens_type_enum" NOT NULL, "blacklisted" boolean NOT NULL DEFAULT false, "userId" integer NOT NULL, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "specialization"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "full_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone_number" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "specializations" text array`);
        await queryRunner.query(`ALTER TABLE "users" ADD "license_number" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "education" jsonb DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "consultation_fee" integer`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "consultation_fee"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "education"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "license_number"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "specializations"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "full_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "specialization" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`DROP TYPE "public"."tokens_type_enum"`);
    }

}
