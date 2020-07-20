 FROM nginx:1.14.1-alpine

 RUN rm -rf /etc/nginx/nginx.conf.default && rm -rf /etc/nginx/conf.d/default.conf
 COPY nginx/nginx.conf /etc/nginx/nginx.conf
 COPY nginx/nginx.conf /etc/nginx/conf.d/nginx.conf

 ## Remove default nginx index page
 RUN rm -rf /usr/share/nginx/html/*

 COPY dist/uiService /usr/share/nginx/html

 EXPOSE 4200 80

 RUN chgrp -R 0 /var/cache/ /var/log/ /var/run/ && \
     chmod -R g=u /var/cache/ /var/log/ /var/run/

 LABEL io.openshift.expose-services="4200:http"

 USER 1001
 ENTRYPOINT ["nginx", "-g", "daemon off;"]
