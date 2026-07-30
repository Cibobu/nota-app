import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const existingStats = await prisma.stats.findFirst()
  if (!existingStats) {
    await prisma.stats.create({
      data: { visitorCount: 0, downloadCount: 0 },
    })
    console.log('Stats seeded')
  }

  const existingProfile = await prisma.businessProfile.findFirst()
  if (!existingProfile) {
    await prisma.businessProfile.create({
      data: {
        businessName: 'Toko Saya',
        address: 'Jl. Contoh No. 123',
        phone: '0812-3456-7890',
        ownerName: 'Nama Pemilik',
      },
    })
    console.log('Profile seeded')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
