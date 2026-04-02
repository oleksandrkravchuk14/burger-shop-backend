import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Очищення
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.category.deleteMany();

  // Категорії
  const burgerCat = await prisma.category.create({ data: { name: 'Burgers' } });
  const drinkCat = await prisma.category.create({ data: { name: 'Drinks' } });
  const dessertCat = await prisma.category.create({ data: { name: 'Desserts' } });

  // Магазини з різним рейтингом
  const shops = [
    { name: 'McBurger', rating: 4.8 },
    { name: 'KFCherry', rating: 3.2 },
    { name: 'Burger Kinga', rating: 4.5 },
    { name: 'Street Food Lviv', rating: 2.5 },
    { name: 'Healthy Buns', rating: 5.0 },
  ];

  for (const s of shops) {
    const shop = await prisma.shop.create({ data: s });

    // Додаємо товари для кожного магазину
    await prisma.product.createMany({
      data: [
        { name: `${s.name} Classic`, price: 120, categoryId: burgerCat.id, shopId: shop.id },
        { name: `${s.name} Double Cheese`, price: 180, categoryId: burgerCat.id, shopId: shop.id },
        { name: 'Cola Zero', price: 45, categoryId: drinkCat.id, shopId: shop.id },
        { name: 'Orange Juice', price: 60, categoryId: drinkCat.id, shopId: shop.id },
        { name: 'Apple Pie', price: 85, categoryId: dessertCat.id, shopId: shop.id },
      ]
    });
  }

  console.log("Seed finished: 5 shops and 25 products created.");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());