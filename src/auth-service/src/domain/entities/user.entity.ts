import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../enums/role.enum';

// Menambahkan interface untuk type-safety pada data 'education'
export interface EducationDetail {
  degree: string;
  university: string;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  // Mengganti 'name' menjadi 'full_name' agar lebih deskriptif
  @Column()
  full_name: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  role: Role;

  @Column({ default: false })
  isEmailVerified: boolean;

  // --- FIELD SPESIFIK KLIEN ---
  @Column({ type: 'varchar', nullable: true })
  phone_number: string | null;

  // --- FIELD SPESIFIK PSIKOLOG ---
  @Column('text', { array: true, nullable: true })
  specializations: string[] | null;

  @Column({ type: 'varchar', nullable: true })
  license_number: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  education: EducationDetail[] | null;

  @Column({ type: 'integer', nullable: true })
  consultation_fee: number | null;

  // --- Timestamps ---
  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt?: Date | null;

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
    if (partial) {
      this.createdAt = partial.createdAt ?? new Date();
    }
  }
}