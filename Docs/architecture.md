# Architectural Document 
> ### Avalanche Analytics

> A Project by The Skunkworks

## Introduction
Avalanche Analytics is a project developed by The Skunkworks, which aims to provide a scalable and user-friendly data analytics platform to analyse the domain name space in South Africa

### Design Strategy
The architectural decisions made by the team are based on the quality requirements as identified by the team and prioritised by the client. 
The functional requirements and user stories that have been identified have been used to identify the most important quality requirements.

## Quality Requirements
The following Quality Requirements have been identified by the team and the client. 
They are listed in order of importance and discussed in some detail.

### 1. Security
Security has been identified as the most important quality attribute of the system. 
The data in the Snowflake Warehouse contains the personal information of individuals that are protected by the POPI Act. 
Furthermore, it contains important record-keeping information of the client that is needed for annual auditing and thus cannot be corrupted or lost. 
The CIA principle is used to quantify security measures. 
* Confidentiality is realised by only allowing authorised users with the correct permissions checked on multiple levels to access sensitive endpoints, as well as using Snowflake masking. 
* Integrity is enforced by making access from the system to the Snowflake warehouse where personal information is stored read-only. 
* Authorization in a login being required and requiring the correct integrations.

| **Security** |
| -----------  |
| **Stimulus Source** |
|  Malicious actors / Unauthorised users |
| **Stimulus** |
| Attempts to access non-aggregated data/data authorised for another user profile. | 
| **Response** |
| The system should log all requests to keep track of unauthorised data access (Audit Trail). The system should only authorise users with the correct permissions/integrations to access data, by only allowing access to specific Snowflake views which are already aggregated The system should ensure access to the Snowflake Warehouse from the API is read-only
| **Response Measure** |
| Unauthorised access attempts identified and flagged. Only authorised views are queried. The Snowflake database has not been modified
| **Environment** |
| System running normally|
| **Artifact** |
| Primarily any entry points into Snowflake like an API endpoints/SQL Builder queries |

### 2. Extensibility
The product should be designed in such a way that additional data products can be added with ease. The client has identified this project as one with the potential to grow and expand into different areas besides only data analytics in the domain name space. The system should allow for additional products/services to be added with a limited effect on current system functionality.
| Extensibility  |
| -----------  |
| **Stimulus Source** |
|  Client/Developer |
| **Stimulus** |
| Wishes to add new data products (services) in addition to the existing system products (incremental deployment) | 
| **Response** |
| Add integration (service)
Test integration |
| **Response Measure** |
| None of the existing services needs to be modified other than the central Service Bus/Gateway API
Minimal changes are needed to the user management database 
Minimal the cost (financial and time) of adding additional features
|
| **Environment** |
| An alrready deployed system|
| **Artifact** |
| Source Code |

