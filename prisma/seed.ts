import { PrismaClient } from '../generated-client/index.js'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed... 🍔')

  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.shop.deleteMany({})

  const catBurgers = await prisma.category.create({ data: { name: 'Бургери' } })
  const catDrinks = await prisma.category.create({ data: { name: 'Напої' } })

  await prisma.shop.create({
    data: {
      name: 'Burger Queen',
      rating: 4.8,
      products: {
        create: [
          { 
            name: 'Cheeseburger', 
            price: 120, 
            categoryId: catBurgers.id 
          },
          { 
            name: 'Coca-Cola', 
            price: 40, 
            categoryId: catDrinks.id 
          },
        ],
      },
    },
  })

  console.log('Seed successful! 🌱 Таблиці заповнені.')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })