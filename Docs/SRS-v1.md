[go back](readme.md)

# Avalanche
## DNS Business
> A Capstone project by The Skunkworks 

## Table of Contents
* [Overview](#overview)
* [Objectives](#objectives)
* [Scope](#scope)
* [User Stories](#user-stories)
* [Functional Requirements](#functional-requirements)
* [Sub Systems](#subsystems)
* [Use Case Diagrams](#use-case-diagrams)
* [Non Functional Requirements](#non-functional-requirements)
* [System Overview](#system-overview)
* [Addressing Quality Attributes](#addressing-quality-attributes)
* [Service Contracts](#service-contracts)
* [Project Management](#project-management)

## Overview
> The Avalanche project aims to implement a powerful Business Intelligence Tool (BIT) capable of analyzing and providing statistical insights on the domain spaces managed by DNS Business. By leveraging the latest data analytics technologies and techniques, the tool will enable DNS Business and other interested parties to gain a deeper understanding of the above-mentioned domain space, identify trends and patterns, and make informed decisions to improve their operations.

## Objectives
The high-level objectives for the Avalanche project are:
- Develop a robust and scalable Business Intelligence Tool (BIT) capable of analyzing and providing statistical insights on domain spaces managed by DNS Business.
- Enable clients (registrars) to access relevant and up-to-date statistics on their domains, and to drill down into demographic information to drive advertising strategies.
- Present statistical data in a user-friendly, graphical manner, using a dynamic and powerful visualization language, that is easy to understand and interpret.
- Provide clients with daily updates on their domain statistics to facilitate proactive decision-making.
- Ensure plug-and-play compatibility with different domain zones conforming to the DNS Snowflake® schema, including popular zones such as .co.za, .africa, .jozi.
- Offer a public-facing API that clients can use to incorporate Avalanche data into their own processes in a secure and token-based manner.
- Conduct industry-specific trend analysis on localized areas to enable academics, economists, and government officials to monitor and assess domain growth and activity in their countries.

## Scope
Using Snowflake®'s data warehouse technology to extract valuable information is a beneficial opportunity for DNS Business. Registrars around the country do not have a comprehensive understanding of their market. This understanding is imperative in developing business strategies. Having and utilizing a reliable and powerful data warehouse tool like Snowflake® could be instrumental in gaining these insights. 

The scope of the Avalanche project is extensive and includes multiple aspects that are vital for the successful implementation of the Business Intelligence Tool (BIT). One of the critical components of the project is data wrangling, which involves transforming, cleaning, and aggregating the data stored in the warehouse to provide relevant statistics and insights to clients.

The scope of the project includes, but is not limited to, data wrangling what is currently in the warehouse and to extract from that to provide statistics and information to the clients on the portal. The team will be using NestJS as the main API and languages such as Java and Python to implement microservices which will be plugged into the API. The frontend for the portal will be NextJS

## User Stories:
### User Characteristics:
The users of the software system can be classified into the following groups:
- Third-Party Users
- Registrar Users 
- Registry Users

### User Descriptions:
- **Third-Party Users**, such as academic institutions, economists and independent researchers. They will be interested in overall trends, possible correlations with external factors (eg. JSE, Load Shedding Schedules) and specialised data points relevant to their research. This is open to any individual who registers an account and is approved.
- **Registrar Users** are Registrars, including Afrihost, domains.co.za, XNeelo etc. They will be interested in their customer base (including retention, renewals and transfers), their growth relative to market growth and market share etc.
- **Registry Users** are Registry Operators or Registry Service Providers, including ZA Registry Consortium (ZARC) and ZADNA (ZA Domain Name Authority). They will be interested in overall domain name space health, as well as Registrar performance and growth.

### User Stories:
#### As a Third-Party User:
- I can register an account with the system, with a one time pin to verify my email address
- I can log into the system with my existing account email and password
- I can add sub-users to my organization into different user groups with different permissions per user group
- I can choose which registry I want to view (ZACR, AFRICA, RyCE, etc)
- I can view default dashboards that display aggregated data
- I can create custom dashboards by selecting graphs to be displayed
- I can view demographic information about a specific registry
- I can filter data to better suit my personal interests/needs on a graph
- I can receive weekly reports on trends I have watchlisted
- I can request a report (to get the daily changes)
- I can report inconsistencies using …ask Michael/Dave…
- I can access FAQ, reported inconsistencies and see fixes
- I can create an API key to access the external API
- I can make requests with my external api key (with a limit)
- I can add the prediction integration
- I can add the sqlBuilder integration
- I can add the Natural Language to SQL integration - search for custom analytics

#### As a Registrar User:
- I can do anything a Third-Party User can do
- I can integrate as a Registrar into Registries for which I am registered using my Registrar credentials
- I can view detailed data within my own domain space after adding Registry Integrations as a Registrar
- I can view my growth in relation to market growth
- I can view my market share
- I can view customer related information
- I can export data in CSV or JSON format

#### As a Registry User:
- I can do anything a Registrar User can do
- I can view unanonymised Registrar Data (eg. Registrar Ranking)

## Functional Requirements:
### Requirements

1. Provide a secure authentication process
    1.  Allow users to register onto the application after going through the onboarding of a one time pin, that expires after 24 hours
    2.  Allow users to log into the system with their credentials
    3.  Allow users to forget their password
    4. Join via invite link

2. Provide integration methods to our data products
(For context “data products” are the packages provided by the business, thus for Avalanche it is registrar integration into ZACR, AFRICA and RyCE as well as domain watch, sqlCreater, natural language to sql)
    1.  Users must be able to subscribe to a “data product” for a period of time
    2. Users must be able to subscribe to multiple “data products”
    3. Users must be able authenticate with existing accounts with DNS for registrar   - specific integrations

3. Provide users the ability to create and manage organisations
    1. Users must be able to create an organisation
    2. Users in the organisation owner user group must be able to create user groups within an organisation
    3. Users in the admin user group must be able to assign users to existing user groups
    4. Inviting an existing Avalanche Analytics User
    5. Inviting an unregistered Avalanche Analytics User 
    6. Existing users must be able to accept invites to an organisation user group
    7. Users must be able to exit user groups
    8. Admin must be able to remove users from user groups but not other admins
    9. Admin Users must be able to add data products to user groups

4. Provide a personalised experience for individual users:
    1. Users must be able to manage their preferences:
    2. Dark/Light mode
    3. Default Warehouses
    4. Allow users to select dashboards of interest as favourites
    5. Allow users to unselect favourites
    6. Allow users to watchlist trends
    7. Suggest analytics based on preferences

5. Provide Dashboard Functionality
    1. Allow users to filter graphs on the dashboard
    2. Allow users to select the warehouse on which the dashboard is based (Currently we are only provided with access to the ZARC warehouse, however, provision should be made to enable the client to “plug-and-play” other warehouses)
    3. Allows users to choose the graph type
    4. Allow users to view graphs individually
    5. Allow users to download the data as CSV or JSON format
    6. Allow users to view data in graphical or tabular format

6. Custom Dashboards
    1. Allow users/user groups to create their own dashboards where they place their own graphs
    2. Allow users to select the warehouse on which the graph is based (Currently we are only provided with access to the ZARC warehouse, however, provision should be made to enable the client to “plug-and-play” other warehouses)
    3. Allow users to undo actions on their dashboard
    4. Allow users to save their dashboard

1. Provide a default dashboards 
    1. Registrar data to Registry
        1. Trends per Registrar
        2. Top-performing Registrar based on various metrics:
            1. Retention
            2. Creates
            3. Net Income
            4. Growth Rate
    2. Market share statistics to Users integrated as Registrars
        1. Provide market share of registrar
        2. Predict projected market share based on current trends
        3. Analyse retention rates of registrars
        4. Analyse overall trajectory of market with predictions
        5. Analyse market share within industry based on statistically significant sampling 
    3. Customer base analysis to Users integrated as Registrars 
        1. Differentiate between resellers and individual customers
        2. Differentiate between e-commerce and informational customers
        3. Classify customers base based on industry using statistically significant sampling methods
        4. Predict future customer base based on current registrar and registry trends
        5. Analyse customer loyalty scores
    4. Overall market statistics to All Users
        1. Overall trend of domain registration
        2. Link domain registration to external factors where correlation may be significant
        3. Trend prediction based on current trend and external variables
        4. Analyse density of domain creations in geographical areas
        5. Analyse density of domain creations by industry

8. Viewing graphs individually
    1. Users should be able to view an individual graph full screen 
    2. Users must be able to filter the individual graph
    3. Users must be able to see comments of other users in their organisation
    4. User should be able to filter comments by user group for the graph
    5. Users must be able to comment on the graph and it must be visible to the other users

9. Communicate and share results within an Organisation
    1. Wishlist: all data products share function
    (Any additional data product’s sharing functionalities goes here)

10. Provide users with an aggregated weekly report
    1. Report contains tabular data of interest
    2. Report contains graphical data of interest
    3. Analyses of the data
    4. Allow users to download the weekly report

11. Provide an external API:
    1. Users can generate keys on the website
    2. Users can view documentation regarding API endpoints
    3. User can make calls to the API using their API key
    4. Provide means to filter data in API calls
    5. Support JSON format response

## Subsystems

1. Onboarding and Authentication
2. User/ Organisation Management
3. Data Product Permission
4. Dashboard Subsystem
5. Intra-Organisation Communication
6. Reporting subsystem
7. Public facing API subsystem

## Use Case Diagrams
To see use case diagrams and traceability matrix please follow [this link](https://drive.google.com/file/d/1zrd5cTrA9RHIBrwi-0oQs0wnceg8_nHe/view?usp=share_link)

## Non-Functional Requirements
### Quality Attributes
1. **Security:**
The security of the system is the most important quality requirement of the project.  The data in the Snowflake Warehouse contains the personal information of individuals that are protected by the POPI Act. Furthermore, it contains important record-keeping information of the client that is needed for annual auditing and thus cannot be corrupted or lost.  
2. **Extensibility:**
The product should be designed in such a way that additional data products can be added with ease. The client has identified this project as one with the potential to grow and expand into different areas besides only data analytics in the domain name space. The system should allow for additional products/services to be added with a limited effect on current system functionality
The project provides an external API, enabling external developers to access and utilize the data for additional applications.
    1. Scalability: 
The project provides a scalable onboarding process for registrars and third parties, ensuring it can handle growing numbers of users.
    2. Maintainability: 
The system supports JSON format responses, which is a widely used standard for data interchange, making it easier to maintain and update. In order for other developers to extend the product the code base should be understandable and maintainable. 
3. Interoperability: 
The system can work with different data warehouses, as long as they conform to the schema, allowing for plug-and-play functionality.
4. Usability: 
The project offers personalized experiences for users, such as selecting favorite graphs and watchlisting trends, enabling a user-friendly interface.
    1. Transparency:
The information displayed should also be done so in a transparent manner. It should be clear to the user exactly what data is being displayed and how it has been gathered, ie. whether it is definitive or whether statistical analysis was applied. Details should be provided in the case of non-definitive data analytics.
    2. Customizability: 
Users can manage subusers, share reports or comments, and have access to personalized statistics, offering a tailored experience.
    3. Flexibility: 
The project allows users to drill down into various statistics and filter out irrelevant data points, providing more detailed and relevant information as needed.
    4. Comprehensiveness: 
The project provides a wide range of data, including registrar data, market share statistics, customer base analysis, and overall market statistics, ensuring users have access to thorough information.
    5. Accuracy: 
The system uses statistically significant sampling methods for various analyses, increasing the reliability of the results.
    6. Relevance: 
The project links domain registration trends to external factors where correlations may be significant, providing more meaningful insights for users.
5. Efficiency: 
In the context of our system, efficiency refers to the ability of the system to provide timely and accurate data analytics results with optimal resource utilization. This is critical given the potential scale of data to be processed and the need to deliver insights in a timely manner to enable informed decision-making.

> To view our architectural document [this link](https://drive.google.com/file/d/1JRlpboiUuRh25L7FumkTPYe_PVuExtGB/view?usp=share_link)
## System Overview
Our system is composed of various components including a frontend client, an API Gateway, microservices for separate registry databases and user management, a Domain Watch service, and separate Snowflake warehouses for each registry. These components are arranged in a microservices architecture, with a central gateway, user management micro-service, registry products services, and the Domain Watch service running in a separate container. Some of these microservices also employ their own architectural patterns to meet specific needs. An overarching Gatekeeper acts as a filter between clients and the API Gateway, ensuring all incoming requests are clean and valid. This Gatekeeper is the only publicly accessible endpoint and the single entry point to our system.
### Flux Architectural Pattern  
At its core, Flux is a pattern that encourages a unidirectional data flow, which can significantly improve the usability of the application for both developers and end-users.
### Gatekeeper
In order to address the security quality attribute a Gatekeeper architecture has been employed. The gatekeeper protects applications and services using a dedicated host instance that acts as a broker between clients and the services, validates and sanitizes requests, and passes requests and data between them.  It is the single point of entry for the system. The rest of the system runs on an internal network protected by a VPN. This ensures that all requests that are passed through to the system have been screened for malicious data. 

One of the weaknesses of the Gatekeeper is that it may affect performance. Since Security is the primary Quality Requirement set out by the client, it is of higher priority in the system architecture design. However, to alleviate the potential bottleneck and single point of failure it is possible to replicate the Gatekeeper. This can then be scaled as necessary to improve performance and improve reliability by reducing the impact of the failure of a Gatekeeper

### Microservices
Microservices are used to meet the extensibility requirement of the client. Extra data products can be added as additional microservices without affecting the deployed system, each with its own database if needed. The central Gateway is configured to route to all microservices as they are requested. An additional layer of security is also implemented at this stage by ensuring that the user is authenticated and that the user has the correct permissions to access the requested product/service.

### Various patterns are employed within the Microservice Architecture:
#### Gateway
A central Gateway Routing is used to expose all the microservices at a single endpoint. The Gateway handles the routing of the requests to the correct microservices. This allows the client to connect this endpoint regardless of the services available. It also can help to make services more scalable. If a single service becomes overloaded, multiple instances of the service may be spun up. Instead of changing the client the Gateway can manage the routing to these. 
The Gateway also employs a layered approach. The entry-point is the first “layer” in order to analyse where the request should be routed. Thereafter, the request could be sent through a token based authorization middleware or bypass this middleware in the case of login, register and verify. 

#### Cache Aside
Cache Aside is used to decrease latency and improve performance. This in turn also addresses usability since data can be delivered to users at a higher pace. The microservices that handle the requests to the various data Warehouses each have a cache database to store recent retrievals. Thus when the same data is requested again, the service can access it from cache instead of making a call to the external warehouse. This also saves on the cost of Snowflake “tokens” addressing client constraints. 

#### Pipes And Filters
Pipes and Filters are used to process data in the Domain Watch microservice. The process contains various steps in order to identify strings that are a close match to he passed in parameter. In order to make this service scalable and to be able to edit/optimise parts of the processing in isolation a pipes and filters approach is used. Additional processing components can then be added, or existing ones replaced or removed without refactoring the code. 
Practically there are multiple pipelines of pipes and filters running concurrently in order to improve processing efficiency. A key advantage of the pipeline structure is that all pipelines can run in parallel or only slow filters can run in parallel while faster filters have a single instance. 

## Addressing Quality Attributes
### 1. Security
The system addresses the crucial attribute of security with a layered approach. First, at the entry point, the Gatekeeper validates and cleans all incoming requests, offering a first line of defence against malformed or malicious data. Next, the API Gateway, acting as the entry point to the system, further screens the incoming requests before routing them to the appropriate services.
The Gateway employs token based middleware to protect the system from unauthorised access. This token is session based, improving security once again.
Within the system, individual services, such as user management, ensure that only authorised users with correct permissions can access sensitive information. The user management service, with its dedicated PostgreSQL database, maintains strict access controls. Moreover, our data storage system—individual Snowflake warehouses for each registry—complies with the POPI Act by masking sensitive information and providing read-only access, thus ensuring data integrity and confidentiality.

### 2. Extensibility
The system is designed with extensibility in mind, allowing for easy addition of new products or services with minimal effect on existing functionality. The microservices architecture employed by our system inherently supports extensibility, as each service is isolated and independently deployable. This design makes it straightforward to add, modify, or remove services as necessary, allowing the system to adapt to evolving requirements and growth opportunities.

### 3. Usability and Transparency
Our frontend client ensures high usability with server-side rendering, providing a smooth and responsive user interface. The design is intuitive, customizable, and accessible. Moreover, the system prioritises transparency, particularly in terms of data representation. Information displayed to the user is clearly marked as definitive or statistically analysed, providing clarity on data sources and processing methods. 

### 4. Interoperability
Our architecture prioritises interoperability to seamlessly integrate with the registry operator's existing systems. The microservices design, with its service-specific databases, allows for easy and flexible integration with external systems. The user management service is a key example, as it is designed to authenticate registrars through the client's system.

### 5. Efficiency
Our architecture achieves efficiency by using the cache-aside pattern which allows the system to respond to requests that have been made recently much faster. This will be employed both in the User Management subsystem as well as the Registry subsystems. This will decrease latency by avoiding unnecessary access to the remote warehouse. The microservice approach also ensures that multiple instances of the same microservice can be deployed to decrease load. 

### Conclusion
Our system architecture successfully addresses the client's defined quality attributes of security, extensibility, usability and transparency, and interoperability. The thoughtful application of a microservices architecture, coupled with specific security measures, transparent data handling practices, and a user-centred frontend design, positions our system as a secure, adaptable, user-friendly, and integrable solution for domain name space analytics.

## Service Contracts
### Technology Stack
* Snowflake Data Warehouse: 
    * Procedures using Javascript
* Frontend: 
    * NextJS
    * TailwindCSS
    * Chart.js
* Gateway: 
    * NestJS
    * JWT 
    * Redis
* User Management
    * NestJS
    * Redis
    * PostgreSQL
* Domain Watch: 
    * Java

To achieve the requirements, the project team will leverage **Snowflake®'s data warehousing** technology and develop microservices using **Java/NestJS**. The team will also use **NestJS** as the primary API framework to provide a robust and scalable interface for the microservices. The team will also utlise **Redis** as a caching service to enhance user experience through faster load times. The team will user a **postgreSQL** database to manage users.

For the frontend, the team will use **NextJS** to create an intuitive and user-friendly interface that enables clients to access and visualise statistical data. Graphical information will be displayed using **chart.js**.
1. Frontend: 
    1. UI: Use NextJS for building the web-based user interface for the BIT. NextJS provides a component-based approach, which enables a modular and maintainable structure for the frontend.
    2. Graphing Service: This service will use chart.js to generate graphs that can then be displayed by the Frontend UI. This allows for different graphing libraries to be plugged into the system with minimal effects
    3. Reporting Service: Implement a reporting service that generates daily/weekly reports in PDF format containing graphical and tabular data, as well as analyses of the data. This will utlise the graphing service as well.
2. API:  NestJS will be used as the main API gateway, while different microservices will be developed using Java, NestJS and other languages as needed. Each microservice will handle a specific set of functionalities, such as data analytics, authentication, and profile management.
    1. API Gateway: The NestJS API gateway will handle the public-facing API, providing secure, token-based access to Avalanche data for clients. The API gateway will route API requests to the appropriate microservices for processing and data retrieval. This provides a single entry point for external clients to access the system's services. The API gateway handles request routing, composition, and protocol translation, simplifying the client's interaction with the system.
    2. Authentication, Authorization and User Management: Implement an authentication and authorization system using JWT tokens to ensure secure access for different types of users (Third-Party Users, Registrar Users, Registry Users). This will also handle role-based access control for different functionalities within the system.
    3. Data Processing and Analytics: Implement data wrangling and analytics microservices using suitable languages. These services will be responsible for transforming, cleaning, aggregating, and analysing the data stored in Snowflake®. They will provide insights and statistics for the frontend and API.

3. Data Storage: Use Snowflake® data warehouse technology for storing the domain data and statistics. Snowflake® provides a scalable and performance-optimised solution for data storage and retrieval.

## Project Management

* A biweekly summary report will be submitted to the industry mentor. This will include progress, obstacles and upcoming goals.
* The project will be managed using Githubs project board and any issues that need to be sent to the client will be done using Jira.
* Weekly scrum meetings will take place.
* 3 stand ups will take place each week.
* We will have weekly meetings with our lecture mentor and with our industry mentor.
