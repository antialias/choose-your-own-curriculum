# Remaining Tasks

This document tracks outstanding work for the Choose Your Own Curriculum project.

- **Authentication**: Implement user sign up and login using NextAuth or similar. The first registered user should be assigned the `superadmin` role.
- **Profile Management**: Allow users to create student and teacher profiles and manage many-to-many relationships between students and teachers.
- **Topic DAGs**: Provide CRUD interfaces to create and manage topic graphs expressed in Mermaid DAG format.
- **Work Uploads**: Support uploading work samples, generating embeddings, and storing summaries in the database.
- **Recommendations**: Combine topic DAGs and uploaded work to recommend what topics to study next.
- **Multiple DAGs**: Allow each user to manage multiple DAGs and select one when generating lesson plans or quizzes.
- **Casbin Access Control**: Apply Casbin policies across API routes to secure student/teacher interactions.
- **GitHub Actions**: Finalize Docker build and configure authentication to push images to GCR.
- **E2E Tests**: Set up Playwright for end-to-end testing of key flows.
- **Documentation**: Expand README and Storybook as features are implemented.

