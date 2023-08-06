# 使用官方Node.js作为基础镜像
FROM --platform=linux/amd64 node:latest

# 创建应用目录
WORKDIR /usr/src/app

# 安装chrome依赖
RUN apt-get update && apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装应用依赖
RUN npm install

# 复制应用的源代码到工作目录
COPY . .

# 暴露端口，与你的应用程序的端口相同
EXPOSE 3000

# 定义Docker容器启动时运行的命令
CMD [ "node", "app.js" ]