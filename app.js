const express = require('express')
const puppeteer = require('puppeteer')
const app = express()

// 允许解析POST请求中的JSON数据
app.use(express.json())

app.post('/html2png', async (req, res) => {
  console.log('Received request')

  const url = req.body.url
  const width = req.body.width || 800
  const height = req.body.height || 600

  if (!url) {
    return res.status(400).send({ error: 'Missing URL' })
  }

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // 设置视口大小
  await page.setViewport({
    width: parseInt(width, 10),
    height: parseInt(height, 10),
  })

  try {
    await page.goto(url, { waitUntil: 'networkidle2' })
  } catch (error) {
    return res.status(400).send({ error: 'Invalid URL' })
  }
  // 打开URL

  // 截屏并保存为PNG
  const screenshot = await page.screenshot({
    encoding: 'binary',
    fullPage: true,
  })

  // 关闭浏览器
  await browser.close()

  res.setHeader('Content-Type', 'image/png')
  res.send(screenshot)
})

const port = process.env.PORT || 3000
const ip = '0.0.0.0'
app.listen(port, ip, () => console.log(`Server is running on ${ip}:${port}`))
