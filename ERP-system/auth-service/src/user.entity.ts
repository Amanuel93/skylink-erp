import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Tenant } from './tenant.entity';
import { UserRole } from './userRole.entity';
import { AuthToken } from './authToken.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  full_name: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  tenant: Tenant;

  @OneToMany(() => UserRole, (userRole: UserRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => AuthToken, (authToken: AuthToken) => authToken.user)
  authTokens: AuthToken[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 