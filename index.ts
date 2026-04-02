import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/shops', async (req, res) => {
    const { minRating, maxRating } = req.query;
  
    try {
      const shops = await prisma.shop.findMany({
        where: {
          rating: {
            gte: minRating ? parseFloat(String(minRating)) : 0,
            lte: maxRating ? parseFloat(String(maxRating)) : 5,
          },
        },
        include: {
          products: true,
        },
      });
      res.json(shops);
    } catch (error) {
      res.status(500).json({ error: "Помилка при отриманні магазинів" });
    }
  });
  
  app.get('/api/products', async (req, res) => {
    const { categoryId, sortBy, order } = req.query;
  
    try {
      const products = await prisma.product.findMany({
        where: {
          ...(categoryId ? { categoryId: Number(categoryId) } : {}),
        },
        orderBy: sortBy ? { 
          [String(sortBy)]: order === 'desc' ? 'desc' : 'asc' 
        } : undefined,
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Помилка при отриманні товарів" });
    }
  });
  
  app.post('/api/orders', async (req, res) => {
    const { userName, email, phone, address, totalPrice, items } = req.body;
  
    try {
      const order = await prisma.order.create({
        data: {
          userName, email, phone, address, totalPrice,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtTime: item.price,
            })),
          },
        },
      });
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Не вдалося створити замовлення" });
    }
  });

  app.listen(PORT, () => {
    console.log(`🚀Сервер запущено на http://localhost:${PORT}`)
  });