import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/prisma';
import config from '../src/config';

async function main() {
  const adminEmail = 'admin@gmail.com'; // using the exact email requested

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash(
      'admin123',
      Number(config.bcrypt_salt_rounds) || 12
    );

    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
      },
    });

    console.log('✅ Admin user created successfully.');
  } else {
    console.log('⚠️ Admin user already exists. Skipping creation.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Failed to seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
