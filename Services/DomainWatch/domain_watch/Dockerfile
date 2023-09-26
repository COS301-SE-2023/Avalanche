FROM eclipse-temurin:8

WORKDIR /domain_watch

EXPOSE 4100

# COPY .mvn/ .mvn
# COPY mvnw pom.xml ./
# RUN ./mvnw dependency:resolve

RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

COPY src ./src
COPY target ./target
COPY data ./data
COPY domainWatch.conf ./domainWatch.conf

CMD ["java","-jar","target/domain_watch-1.0-jar-with-dependencies.jar"]