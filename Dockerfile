# Etapa 1: build da aplicação React
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copia o restante do código
COPY . .

# Executa o build de produção
# Aqui o Coolify já vai injetar a variável REACT_APP_API_URL
RUN npm run build

# Etapa 2: servidor nginx para servir o build
FROM nginx:alpine

# Remove config padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos buildados para a pasta do nginx
# Vite builds to dist/ directory, not build/
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia uma config simples do nginx (para SPA React funcionar com rotas)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
