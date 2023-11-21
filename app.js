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

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  })
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

app.post('/html2pdf', async (req, res) => {
  console.log('Received request for PDF conversion')

  const url = req.body.url
  const format = req.body.format || 'A4'

  if (!url) {
    return res.status(400).send({ error: 'Missing URL' })
  }

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  })
  const page = await browser.newPage()

  try {
    await page.goto(url, { waitUntil: 'networkidle2' })
  } catch (error) {
    await browser.close()
    return res.status(400).send({ error: 'Invalid URL' })
  }

  // 将网页内容渲染为PDF
  const pdf = await page.pdf({
    format: format,
    printBackground: true,
  })

  await browser.close()

  res.setHeader('Content-Type', 'application/pdf')
  res.send(pdf)
})

const port = process.env.PORT || 3000
const ip = '0.0.0.0'
app.listen(port, ip, () => console.log(`Server is running on ${ip}:${port}`))
