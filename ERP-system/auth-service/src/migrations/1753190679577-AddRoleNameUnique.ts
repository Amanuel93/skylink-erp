import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleNameUnique1753190679577 implements MigrationInterface {

    public async up(q: QueryRunner): Promise<void> {
        await q.query(`
          ALTER TABLE "role"
          ADD CONSTRAINT "UQ_role_name" UNIQUE ("name");
        `);
      }
      
      public async down(q: QueryRunner): Promise<void> {
        await q.query(`
          ALTER TABLE "role"
          DROP CONSTRAINT "UQ_role_name";
        `);
      }

}
