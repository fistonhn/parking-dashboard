FROM node:12.4
COPY . /app
WORKDIR /app
RUN npm install && npm run build
RUN apt-get update \
    && apt-get install -y nginx \
    && rm /etc/nginx/sites-enabled/default*
ADD ./apple-app-site-association /var/www/.well-known/
COPY ./nginx.conf /etc/nginx/sites-enabled/default
RUN cp -r /app/build/* /usr/share/nginx/html/
WORKDIR /usr/share/nginx/html
#RUN service nginx reload
EXPOSE 8090

CMD ["nginx", "-g", "daemon off;"]