import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSchedulesTable1750772922914 implements MigrationInterface {
    name = 'CreateSchedulesTable1750772922914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."schedules_status_enum" AS ENUM('available', 'booked', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "psychologistId" uuid NOT NULL, "startTime" TIMESTAMP WITH TIME ZONE NOT NULL, "endTime" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."schedules_status_enum" NOT NULL DEFAULT 'available', "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, CONSTRAINT "PK_7e33fc2ea755a5765e3564e66dd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "schedules"`);
        await queryRunner.query(`DROP TYPE "public"."schedules_status_enum"`);
    }

}
