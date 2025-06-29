import { Schedule } from "../entities/schedule.entity";

// Simbol ini akan digunakan untuk dependency injection
export const IScheduleRepository = Symbol('IScheduleRepository');

export interface IScheduleRepository {
	/**
	 * Menyimpan slot jadwal baru ke database.
	 * @param schedule - Objek schedule yang akan dibuat.
	 * @returns Objek schedule yang telah disimpan.
	 */
	create(schedule: Schedule): Promise<Schedule>;

	/**
	 * Mencari semua jadwal milik seorang psikolog.
	 * @param psychologistId - ID psikolog.
	 * @returns Array dari objek schedule.
	 */
	findByPsychologistId(psychologistId: string): Promise<Schedule[]>;
	/**
	 * Mencari jadwal berdasarkan ID.
	 * @param id - ID dari jadwal yang dicari.
	 * @returns Objek schedule jika ditemukan, atau null jika tidak ditemukan.
	 */
	findById(id: string): Promise<Schedule | null>;
	/**
	 * Menghapus jadwal berdasarkan ID.
	 * @param id - ID dari jadwal yang akan dihapus.
	 * @returns Boolean yang menunjukkan apakah penghapusan berhasil.
	 */
	delete(id: string): Promise<void>;
	/**
	 * Mengupdate jadwal berdasarkan ID.
	 * @param id - ID dari jadwal yang akan diupdate.
	 * @param schedule - Objek schedule yang berisi data baru.
	 * @returns Objek schedule yang telah diupdate.
	 */
	update(schedule: Schedule): Promise<Schedule>;
	/**
	 * Mencari jadwal yang tersedia untuk seorang psikolog.
	 * @param psychologistId - ID psikolog.
	 * @returns Array dari objek schedule yang tersedia.
	 */
	findAvailableByPsychologistId(psychologistId: string): Promise<Schedule[]>;
}