import 'reflect-metadata';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import configs from '../../../building-blocks/configs/configs';
import { Role } from '../../src/domain/enums/role.enum';
import { CreateScheduleSlotRequestDto } from '../../src/application/dtos/create-schedule-slot-request.dto';
import { Fixture, IntegrationTestFixture } from '../../test/shared/integration-test.fixture';

// Helper untuk membuat token tes
const generateTestToken = (userId: string, role: Role): string => {
	return jwt.sign({ sub: userId, role }, configs.jwt.secret, { expiresIn: '1h' });
};

describe('Schedules Controller (e2e)', () => {
	let app: INestApplication;
	let fixture: Fixture;
	const testFixture = new IntegrationTestFixture();

	const psychologistId = uuidv4();
	const psychologistToken = generateTestToken(psychologistId, Role.PSYCHOLOGIST);
	const clientToken = generateTestToken(uuidv4(), Role.CLIENT);

	let createdScheduleId: string;

	beforeAll(async () => {
		fixture = await testFixture.initialize();
		app = fixture.app;
	});

	afterAll(async () => {
		await testFixture.cleanUp();
	});

	describe('POST /schedules', () => {
		it('should create a schedule for a psychologist (201)', () => {
			const dto: CreateScheduleSlotRequestDto = {
				startTime: new Date('2025-02-01T09:00:00Z'),
				endTime: new Date('2025-02-01T10:00:00Z'),
			};
			return request(app.getHttpServer())
				.post('/schedules')
				.set('Authorization', `Bearer ${psychologistToken}`)
				.send(dto)
				.expect(201)
				.then(res => {
					expect(res.body.psychologistId).toEqual(psychologistId);
					createdScheduleId = res.body.id;
				});
		});

		it('should fail to create a schedule for a client (403 Forbidden)', () => {
			const dto: CreateScheduleSlotRequestDto = {
				startTime: new Date(),
				endTime: new Date(),
			};
			return request(app.getHttpServer())
				.post('/schedules')
				.set('Authorization', `Bearer ${clientToken}`)
				.send(dto)
				.expect(403);
		});
	});

	describe('GET /schedules/my-schedules', () => {
		it('should return all schedules for the logged-in psychologist (200)', () => {
			return request(app.getHttpServer())
				.get('/schedules/my-schedules')
				.set('Authorization', `Bearer ${psychologistToken}`)
				.expect(200)
				.then(res => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body.length).toBeGreaterThan(0);
					expect(res.body[0].id).toEqual(createdScheduleId);
				});
		});
	});

	describe('DELETE /schedules/:id', () => {
		it('should delete the specified schedule (204)', () => {
			return request(app.getHttpServer())
				.delete(`/schedules/${createdScheduleId}`)
				.set('Authorization', `Bearer ${psychologistToken}`)
				.expect(204);
		});

		it('should fail to delete if schedule not found (404)', () => {
			return request(app.getHttpServer())
				.delete(`/schedules/${createdScheduleId}`) // Coba hapus lagi
				.set('Authorization', `Bearer ${psychologistToken}`)
				.expect(404);
		});
	});
});