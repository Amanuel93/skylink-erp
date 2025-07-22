import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Tenant } from './tenant.entity';
import { UserRole } from './userRole.entity';
import { RolePermission } from './rolePermission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.roles)
  tenant: Tenant;

  @OneToMany(() => UserRole, (userRole: UserRole) => userRole.role)
  userRoles: UserRole[];

  @OneToMany(() => RolePermission, (rolePermission: RolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
} 