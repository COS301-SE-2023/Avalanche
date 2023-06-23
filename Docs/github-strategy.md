[go back](readme.md)

# Github Strategy
In our project, we adopt the Git Flow strategy, utilising two primary branches:

1. Stable: This branch serves as our main branch, housing the released code that meets our production standards.
2. Working: This branch functions as our development branch, where active development and feature implementation take place.

By adhering to the Git Flow strategy, we ensure that our codebase maintains a robust and reliable state in the stable branch, while allowing for continuous progress and experimentation in the working branch.

In our project, we adhere to a strict set of rules and practices to ensure code quality and maintain a professional workflow.

The stable branch, our main branch, is protected and subject to rigorous requirements before code can be merged into it. We have implemented Github Actions that automatically run comprehensive tests for each pull request targeting the stable branch. These tests cover all development phases, including frontend, backend, and any additional codebases. If the actions fail, the pull request cannot be accepted. Instead, necessary fixes must be applied, and all actions should be rerun to ensure a successful merge into the stable branch.

On the other hand, the working branch contains code that meets our internal integration standards. Before making a pull request into the stable branch, we thoroughly validate the functionality on the working branch. Although we also utilise Github Actions for pull requests into the working branch, they are not mandatory for successful merging.

To manage the development process effectively, we adopt a branching strategy where we create new branches for each feature or major addition to the codebase. For instance, the integration_dev branch is specifically dedicated to integrating the frontend with the backend, providing a clear focus for the frontend developer.

It's important to note that branches suffixed with "_dev" indicate ongoing work in progress, while those suffixed with "_inactive" represent branches that are no longer actively developed.

When creating new branches, we always branch off from the working branch. This approach relies on developers ensuring the stability and functionality of their latest code or, at the very least, providing essential code required by other team members. By following these practices, we maintain a consistent and reliable development environment throughout our project.

In our CI/CD pipeline, we have implemented a robust system that allows us to run actions on every commit. However, we have also introduced a mechanism to selectively skip these actions based on specific keywords found in the commit title. This flexibility enables us to optimise our workflow and focus on essential code changes when necessary.

On the deployment front, we have stringent requirements in place to ensure the stability and reliability of our server. Before any deployment takes place, all tests, including lints, must pass successfully. This ensures that our code meets the defined quality standards before it is deployed onto the server.

To effectively manage our services, we leverage the power of Docker. By employing Docker containers, we achieve a consistent and efficient deployment process. In the context of our CI/CD pipeline, our Github Actions seamlessly connect with the server and execute the necessary commands to deploy our application successfully.

Through this well-orchestrated integration of Docker and Github Actions, we ensure smooth and reliable deployments, guaranteeing that our server remains in a consistent and functional state throughout the development and deployment lifecycle.
