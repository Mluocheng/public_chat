# Stage 1: 构建环境
FROM node:18.17.0 as builder

# 创建工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建应用程序
RUN npm run build

# Stage 2: 运行环境
FROM node:alpine

# 创建工作目录
WORKDIR /app

# 从构建者阶段复制构建好的文件
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 暴露端口（Next.js 默认端口是3000）
EXPOSE 3000

# 启动 Next.js 服务器
CMD ["npm", "start"]
