FROM node:22-alpine AS build-stage

# Enable Corepack to use pnpm (since the repo uses pnpm-lock.yaml)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first
# Performance reasoning: Copying only package.json and lockfiles before the rest of the code
# allows Docker to cache the install layer. If source code changes but dependencies
# do not, Docker will skip reinstalling dependencies, speeding up the build process.
COPY package.json pnpm-lock.yaml* ./

# Install project dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code and configuration files
# This includes the .env.production file which Vite needs to inject environment variables
# during the build process.
COPY . .

# Build the application for production
# This creates a 'dist/' directory containing the minified and optimized HTML, JS, and CSS files.
RUN pnpm build

# ==========================================
# Stage 2: Production stage
# Purpose: Serves the static files generated in the build stage using a lightweight web server.
# Security/Performance: We use the Nginx alpine image as it is highly optimized for serving 
# static content and has a minimal OS footprint.
# ==========================================
FROM nginx:alpine AS production-stage

# Copy the custom global Nginx configuration
# Purpose: Replaces the default Nginx config to enable features like Gzip compression.
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the custom server block configuration
# Purpose: Configures Nginx to handle SPA routing, port binding, and specific cache control rules.
COPY default.conf /etc/nginx/conf.d/default.conf

# Remove the default HTML files provided by Nginx
# Security reasoning: It prevents exposing default Nginx welcome pages which can leak server info.
RUN rm -rf /usr/share/nginx/html/*

# Copy the compiled static assets from the build stage
# Performance reasoning: The final image only contains Nginx and the static files, making it 
# very small (typically < 30MB) and fast to deploy.
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 for incoming HTTP traffic
EXPOSE 80

# Start Nginx in the foreground
# Purpose: Docker containers exit when their primary process finishes. 'daemon off;' keeps Nginx
# running in the foreground so the container stays alive.
CMD ["nginx", "-g", "daemon off;"]
