import 'reflect-metadata';
import request from 'supertest';
import { Fixture, IntegrationTestFixture } from '../shared/integration-test.spec';
import { INestApplication } from '@nestjs/common';
import { RegisterUserRequestDto } from '../../src/application/dtos/register-user-request.dto';
import { Role } from '../../src/domain/enums/role.enum';
import { LoginRequestDto } from '../../src/application/dtos/login-user-reques';

describe('Authentication Controller (e2e)', () => {
	let app: INestApplication;
	let fixture: Fixture;
	const testFixture = new IntegrationTestFixture();

	beforeAll(async () => {
		fixture = await testFixture.initialize();
		app = fixture.app;
	});

	afterAll(async () => {
		await testFixture.cleanUp();
	});

	const user: RegisterUserRequestDto = {
		email: 'e2e.user@mail.com',
		full_name: 'E2E User',
		password: 'Password123!',
	};
	let accessToken: string;

	it('POST /auth/register - should register a new user', () => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.send(user)
			.expect(201)
			.then((res) => {
				expect(res.body.email).toEqual(user.email);
				expect(res.body.password).toBeUndefined(); // Pastikan password tidak dikembalikan
			});
	});

	it('POST /auth/login - should log the user in and return tokens', () => {
		const loginDto: LoginRequestDto = {
			email: user.email,
			password: user.password,
		};
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then((res) => {
				expect(res.body.accessToken.token).toBeDefined();
				expect(res.body.refreshToken.token).toBeDefined();
				accessToken = res.body.accessToken.token; // Simpan token untuk tes berikutnya
			});
	});

	it('GET /auth/profile - should get user profile with a valid token', () => {
		return request(app.getHttpServer())
			.get('/auth/profile')
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(200)
			.then((res) => {
				expect(res.body.email).toEqual(user.email);
				expect(res.body.role).toEqual(Role.CLIENT);
			});
	});

	it('GET /auth/profile - should fail without a token', () => {
		return request(app.getHttpServer())
			.get('/auth/profile')
			.expect(401);
	});
});