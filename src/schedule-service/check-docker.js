// eslint-disable-next-line @typescript-eslint/no-require-imports
const { GenericContainer } = require('testcontainers');

async function main() {
  console.log('Memulai pengecekan koneksi Docker dengan Testcontainers...');
  try {
    const container = await new GenericContainer('hello-world').start();
    console.log("Kontainer 'hello-world' berhasil dimulai!");

    const logs = await container.logs();
    process.stdout.write('Log dari kontainer:\n' + logs);

    await container.stop();
    console.log('\nKontainer berhasil dihentikan.');
    console.log(
      '\n✅ Selamat! Lingkungan Docker Anda tampaknya terkonfigurasi dengan benar untuk Testcontainers.'
    );
  } catch (err) {
    console.error('\n❌ Gagal! Testcontainers tidak dapat terhubung dengan Docker.');
    console.error('Pastikan Docker Desktop/Engine berjalan dan coba restart Docker Anda.');
    console.error('Detail Error:', err);
  }
}

main();
