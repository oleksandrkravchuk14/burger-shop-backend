import express from 'express'
import cors from 'cors'
import { PrismaClient } from './generated-client/index.js' // Ваш шлях до типів

const app = express()
const prisma = new PrismaClient()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/api/products', async (req, res) => {

    const { categoryId, sortBy, order, shopId } = req.query;
  
    try {
      const products = await prisma.product.findMany({
        where: {
          ...(shopId ? { shopId: String(shopId) } : {}),
          
          ...(categoryId ? { categoryId: Number(categoryId) } : {}),
        },
        orderBy: sortBy ? { 
          [String(sortBy)]: order === 'desc' ? 'desc' : 'asc' 
        } : undefined,
        include: {
          category: true, 
        }
      });
  
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Помилка сервера при отриманні товарів" });
    }
  });

app.listen(PORT, () => {
  console.log(`🚀Сервер запущено на http://localhost:${PORT}`)
})

app.post('/api/orders', async (req, res) => {
    const { userName, email, phone, address, items, totalPrice } = req.body;
  
    try {
      const newOrder = await prisma.order.create({
        data: {
          userName,
          email,
          phone,
          address,
          totalPrice,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtTime: item.price,
            })),
          },
        },
      });
      res.json(newOrder);
    } catch (error) {
      res.status(500).json({ error: "Не вдалося зберегти замовлення" });
    }
  });