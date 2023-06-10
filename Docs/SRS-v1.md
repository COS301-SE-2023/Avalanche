# Avalanche
## DNS Business

### Overview
The Avalanche project aims to implement a powerful Business Intelligence Tool (BIT) capable of analyzing and providing statistical insights on the domain spaces managed by DNS Business. By leveraging the latest data analytics technologies and techniques, the tool will enable DNS Business and other interested parties to gain a deeper understanding of the above-mentioned domain space, identify trends and patterns, and make informed decisions to improve their operations.

### Objectives
The high-level objectives for the Avalanche project are:
- Develop a robust and scalable Business Intelligence Tool (BIT) capable of analyzing and providing statistical insights on domain spaces managed by DNS Business.
- Enable clients (registrars) to access relevant and up-to-date statistics on their domains, and to drill down into demographic information to drive advertising strategies.
- Present statistical data in a user-friendly, graphical manner, using a dynamic and powerful visualization language, that is easy to understand and interpret.
- Provide clients with daily updates on their domain statistics to facilitate proactive decision-making.
- Ensure plug-and-play compatibility with different domain zones conforming to the DNS Snowflake® schema, including popular zones such as .co.za, .africa, .jozi.
- Offer a public-facing API that clients can use to incorporate Avalanche data into their own processes in a secure and token-based manner.
- Conduct industry-specific trend analysis on localized areas to enable academics, economists, and government officials to monitor and assess domain growth and activity in their countries.

### Scope
Using Snowflake®'s data warehouse technology to extract valuable information is a beneficial opportunity for DNS Business. Registrars around the country do not have a comprehensive understanding of their market. This understanding is imperative in developing business strategies. Having and utilizing a reliable and powerful data warehouse tool like Snowflake® could be instrumental in gaining these insights. 

The scope of the Avalanche project is extensive and includes multiple aspects that are vital for the successful implementation of the Business Intelligence Tool (BIT). One of the critical components of the project is data wrangling, which involves transforming, cleaning, and aggregating the data stored in the warehouse to provide relevant statistics and insights to clients.

The scope of the project includes, but is not limited to, data wrangling what is currently in the warehouse and to extract from that to provide statistics and information to the clients on the portal. The team will be using NestJS as the main API and languages such as Java and Python to implement microservices which will be plugged into the API. The frontend for the portal will be NextJS

### Use Cases

#### User Characteristics:
The users of the software system can be classified into the following groups:
- Third-Party Users
- Registrar Users 
- Registry Users

#### User Descriptions:
- **Third-Party Users**, such as academic institutions, economists and independent researchers. They will be interested in overall trends, possible correlations with external factors (eg. JSE, Load Shedding Schedules) and specialised data points relevant to their research. This is open to any individual who registers an account and is approved.
- **Registrar Users** are Registrars, including Afrihost, domains.co.za, XNeelo etc. They will be interested in their customer base (including retention, renewals and transfers), their growth relative to market growth and market share etc.
- **Registry Users** are Registry Operators or Registry Service Providers, including ZA Registry Consortium (ZARC) and ZADNA (ZA Domain Name Authority). They will be interested in overall domain name space health, as well as Registrar performance and growth.

#### User Stories:
##### As a Third-Party User:
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

##### As a Registrar User:
- I can do anything a Third-Party User can do
- I can integrate as a Registrar into Registries for which I am registered using my Registrar credentials
- I can view detailed data within my own domain space after adding Registry Integrations as a Registrar
- I can view my growth in relation to market growth
- I can view my market share
- I can view customer related information
- I can export data in CSV or JSON format

##### As a Registry User:
- I can do anything a Registrar User can do
- I can view unanonymised Registrar Data (eg. Registrar Ranking)

