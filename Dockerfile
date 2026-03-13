# Imagen base
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Exponemos el puerto de Admin (5174)
EXPOSE 5174

# Comando para iniciar Vite en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host"]
