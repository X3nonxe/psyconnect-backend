import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { StartedTestContainer } from 'testcontainers';
import { PostgresContainer } from '../../../building-blocks/test/container/postgres/postgres-container';
// import { RabbitmqContainer } from '../../../building-blocks/test/container/rabbitmq/rabbitmq-container';
import { AppModule } from '../../src/app.module';
import { IScheduleRepository } from '../../src/domain/repositories/ischedule.repository';

/**
 * Class ini berfungsi sebagai container untuk semua komponen
 * yang kita butuhkan selama tes berlangsung.
 */
export class Fixture {
	app: INestApplication;
	commandBus: CommandBus;
	queryBus: QueryBus;
	scheduleRepository: IScheduleRepository;
	postgresContainer: StartedTestContainer;
	// rabbitmqContainer: StartedTestContainer;
}

/**
 * Class utama yang mengelola siklus hidup lingkungan tes.
 */
export class IntegrationTestFixture {
	private readonly fixture: Fixture = new Fixture();

	/**
	 * Metode ini akan dijalankan sekali sebelum semua tes di sebuah file.
	 * Ia akan:
	 * 1. Menjalankan kontainer Postgres & RabbitMQ.
	 * 2. Membuat modul tes NestJS yang menimpa koneksi DB ke kontainer tes.
	 * 3. Menyediakan akses ke provider penting seperti CommandBus dan Repository.
	 */
	public async initialize(): Promise<Fixture> {
		// 1. Menjalankan kontainer Docker untuk dependensi
		const [postgresContainer, postgresOptions] = await new PostgresContainer().start();
		this.fixture.postgresContainer = postgresContainer;

		// const [rabbitmqContainer] = await new RabbitmqContainer().start();
		// this.fixture.rabbitmqContainer = rabbitmqContainer;

		// 2. Membuat modul tes NestJS
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				AppModule,
				// Timpa koneksi database utama dengan koneksi ke kontainer tes
				TypeOrmModule.forRoot(postgresOptions as TypeOrmModuleOptions),
			],
		}).compile();

		this.fixture.app = moduleFixture.createNestApplication();
		await this.fixture.app.init();

		// 3. Mengambil instance provider dari modul tes untuk digunakan di dalam tes
		this.fixture.commandBus = moduleFixture.get<CommandBus>(CommandBus);
		this.fixture.queryBus = moduleFixture.get<QueryBus>(QueryBus);
		this.fixture.scheduleRepository = moduleFixture.get<IScheduleRepository>(IScheduleRepository);

		return this.fixture;
	}

	/**
	 * Metode ini dijalankan setelah semua tes selesai untuk membersihkan
	 * semua proses (mematikan aplikasi dan kontainer).
	 */
	public async cleanUp() {
		if (this.fixture.app) {
			await this.fixture.app.close();
		}
		if (this.fixture.postgresContainer) {
			await this.fixture.postgresContainer.stop();
		}
	}
}