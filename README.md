# 🚀 Guia para Rodar a API

## 🐳 Rodando com Docker

Para rodar a API em um ambiente containerizado, siga os passos abaixo:

### **1️⃣ Construir a imagem e subir os containers**
```sh
docker compose up --build -d
```

### **2️⃣ Verificar se os containers estão rodando**
```sh
docker ps
```

### **3️⃣ Parar os containers**
```sh
docker compose down
```

A API estará disponível por padrão em: **http://localhost:3333**

---

## 💻 Rodando para Desenvolvimento

Se você deseja rodar a API localmente sem Docker, com hot reload ativado, siga os passos:

### **1️⃣ Instalar as dependências**
Caso ainda não tenha instalado, rode:
```sh
pnpm install
```

### **2️⃣ Subir o banco de dados com Docker**
```sh
docker compose up -d db
```

### **3️⃣ Executar a API em modo desenvolvimento**
```sh
pnpm run dev
```

A API estará rodando com hot reload ativado em: **http://localhost:3333**

---

## 📄 Documentação da API (Swagger)

A documentação da API está disponível no Swagger e pode ser acessada através do seguinte link:

🔗 **[Swagger UI](http://localhost:3333/api)**

---



## 🛢️ Gerenciando o Banco de Dados com Prisma

### **Rodar as migrations**
```sh
pnpm prisma migrate dev
```

### **Executar SEED**
```sh
pnpm prisma db seed
```


### **Ver o banco de dados com Prisma Studio**
```sh
pnpm prisma studio
```