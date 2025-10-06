# Etapa 1: build (com Node)
FROM node:20-alpine AS builder
WORKDIR /app

# Copia package.json e lock primeiro para melhor cache
COPY package*.json ./

# Se tiver package-lock.json, use npm ci. Caso contrário, troque por npm install
RUN npm ci --omit=dev

# Copia o resto do projeto e roda build
COPY . .
RUN npm run build

# Falha o build se não existir o index.html (garantia)
RUN test -f /app/dist/index.html


# Etapa 2: Nginx para servir a aplicação
FROM nginx:1.25-alpine

# Instala wget para o healthcheck
RUN apk add --no-cache wget

# Copia configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build da etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Expondo porta padrão
EXPOSE 80

# Healthcheck para verificar se o container está rodando
HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD \
    wget --spider --retry-connrefused -q http://127.0.0.1/ || exit 1

# Comando final
CMD ["nginx", "-g", "daemon off;"]
