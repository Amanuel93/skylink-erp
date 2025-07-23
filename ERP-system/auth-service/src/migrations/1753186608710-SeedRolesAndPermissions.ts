
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRolesAndPermissions1753212345678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // insert roles
    await queryRunner.query(`
        INSERT INTO "role" (name, description)
        SELECT name, description FROM (VALUES
          ('Admin', 'Full access'),
          ('User',  'Limited access')
        ) AS v(name, description)
        WHERE NOT EXISTS (
          SELECT 1 FROM "role" r WHERE r.name = v.name
        );
      `);
      

    // insert permissions
    await queryRunner.query(`
      INSERT INTO "permission" (name, description)
      VALUES
        ('READ_USERS',   'Can read users'),
        ('MANAGE_USERS', 'Can create/update/delete users')
      ON CONFLICT (name) DO NOTHING;
    `);

    // link roles→permissions
    await queryRunner.query(`
      INSERT INTO "role_permission" ("roleId","permissionId")
      SELECT r.id, p.id
      FROM role r
      JOIN permission p ON p.name = 'READ_USERS'
      WHERE r.name = 'Admin'
      ON CONFLICT DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "role_permission";`);
    await queryRunner.query(`DELETE FROM "permission";`);
    await queryRunner.query(`DELETE FROM "role";`);
  }
}
