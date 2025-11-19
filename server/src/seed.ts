import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.documentRead.deleteMany();
  await prisma.photoMarker.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.floorplan.deleteMany();
  await prisma.document.deleteMany();
  await prisma.user.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.department.deleteMany();
  await prisma.property.deleteMany();

  const property = await prisma.property.create({ data: { name: 'Slotsgade 12' } });
  const department = await prisma.department.create({ data: { name: 'Afdeling A', propertyId: property.id } });
  const unit = await prisma.unit.create({ data: { unitNumber: '1. tv.', departmentId: department.id } });

  const siteManagerPassword = await bcrypt.hash('Test1234!', 10);
  const tenantPassword = await bcrypt.hash('Test1234!', 10);
  const advisorPassword = await bcrypt.hash('Test1234!', 10);

  const siteManager = await prisma.user.create({
    data: {
      email: 'byggeleder@example.dk',
      fullName: 'Bent Byggeleder',
      role: 'SITE_MANAGER',
      passwordHash: siteManagerPassword,
    },
  });

  const tenant = await prisma.user.create({
    data: {
      email: 'beboer@example.dk',
      fullName: 'Anna Andelsbeboer',
      role: 'TENANT',
      unitId: unit.id,
      passwordHash: tenantPassword,
    },
  });

  const advisor = await prisma.user.create({
    data: {
      email: 'raadgiver@example.dk',
      fullName: 'Rasmus Rådgiver',
      role: 'ADVISOR',
      passwordHash: advisorPassword,
    },
  });

  await prisma.document.create({
    data: {
      title: 'Velkomstbrev',
      content: 'Kære beboer, her er information om projektet.',
      scope: 'UNIT',
      unitId: unit.id,
      createdById: siteManager.id,
    },
  });

  await prisma.document.create({
    data: {
      title: 'Varsling af arbejde',
      content: 'Der udføres facadeudbedring i uge 32.',
      scope: 'DEPARTMENT',
      departmentId: department.id,
      createdById: siteManager.id,
    },
  });

  console.log('Seed data oprettet');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
