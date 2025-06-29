import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum TokenType {
	ACCESS = 'access',
	REFRESH = 'refresh',
}

@Entity('tokens')
export class Token {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	token: string;

	@Column()
	expires: Date;

	@Column({
		type: 'enum',
		enum: TokenType,
	})
	type: TokenType;

	@Column({ default: false })
	blacklisted: boolean;

	@ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user: User;

	@Column({type: 'uuid'})
	userId: string;

	constructor(partial?: Partial<Token>) {
		Object.assign(this, partial);
	}
}