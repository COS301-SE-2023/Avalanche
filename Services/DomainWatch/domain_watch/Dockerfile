FROM eclipse-temurin:8

WORKDIR /domain_watch

EXPOSE 4004

# COPY .mvn/ .mvn
# COPY mvnw pom.xml ./
# RUN ./mvnw dependency:resolve

COPY src ./src
COPY target ./target
COPY data ./data

CMD ["java","-jar","target/domain_watch-1.0-SNAPSHOT-jar-with-dependencies.jar"]