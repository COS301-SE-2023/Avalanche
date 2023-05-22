# Avalanche
## DNS Business
> A Capstone project by The Skunkworks 

### Overview
> The Avalanche project aims to implement a powerful Business Intelligence Tool (BIT) capable of analyzing and providing statistical insights on the domain spaces managed by DNS Business. By leveraging the latest data analytics technologies and techniques, the tool will enable DNS Business and other interested parties to gain a deeper understanding of the above-mentioned domain space, identify trends and patterns, and make informed decisions to improve their operations.

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

### User Stories:

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

### Functional Requirements:

#### Requirements

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
    2. Allow users to select the warehouse on which the dashboard is based
(Currently we are only provided with access to the ZARC warehouse, however, provision should be made to enable the client to “plug-and-play” other warehouses)
    3. Allows users to choose the graph type
    4. Allow users to view graphs individually
    5. Allow users to download the data as CSV or JSON format
    6. Allow users to view data in graphical or tabular format

6. Custom Dashboards
    1. Allow users/user groups to create their own dashboards where they place their own graphs
    2. Allow users to select the warehouse on which the graph is based
(Currently we are only provided with access to the ZARC warehouse, however, provision should be made to enable the client to “plug-and-play” other warehouses)
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




