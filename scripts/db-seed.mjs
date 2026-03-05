import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(connectionString);

try {
  console.log("Seeding database...");

  const existingMembers = await sql`SELECT COUNT(*)::int AS count FROM members`;
  if (existingMembers[0]?.count > 0) {
    console.log("Seed skipped: members table already has data.");
    process.exit(0);
  }

  const [member] = await sql`
    INSERT INTO members (name, nim_nip, type, division, phone, institution, start_date, end_date)
    VALUES ('Budi Santoso', '220001', 'intern', 'Sistem Informasi', '081234567890', 'Universitas Contoh', '2026-01-01', '2026-06-30')
    RETURNING id
  `;

  const [project] = await sql`
    INSERT INTO projects (member_id, name, description, roles, status, start_date, end_date)
    VALUES (${member.id}, 'Dashboard Monitoring PKL', 'Membangun dashboard progres PKL', '["frontend","ui-ux"]', 'active', '2026-02-01', '2026-04-30')
    RETURNING id
  `;

  await sql`
    INSERT INTO tasks (project_id, member_id, title, description, week_start, week_end, status, admin_note)
    VALUES
      (${project.id}, ${member.id}, 'Setup halaman admin', 'Membuat halaman admin utama', '2026-03-02', '2026-03-08', 'terealisasi', 'Bagus, lanjutkan.'),
      (${project.id}, ${member.id}, 'Integrasi chart capaian', 'Integrasi Apache ECharts', '2026-03-09', '2026-03-15', 'pending', NULL)
  `;

  console.log("Seed complete.");
} catch (error) {
  console.error("Failed to seed database:");
  console.error(error);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
