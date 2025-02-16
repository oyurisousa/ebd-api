# Usa uma imagem base do Node.js
FROM node:18

# Instala o pnpm globalmente
RUN npm install -g pnpm

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências
COPY package.json pnpm-lock.yaml ./

# Instala as dependências com pnpm
RUN pnpm install --frozen-lockfile --strict-peer-dependencies=false

# Copia o restante da aplicação
COPY . .

# Compila o código TypeScript
RUN pnpm run build

# Expõe a porta usada pela API
EXPOSE 3333

# Comando para rodar a aplicação
CMD ["pnpm", "run", "start:prod"]
