export const typeDefs = `#graphql

  type Job {
    id: ID!
    title: String!
    company: String!
    location: String!
    salary: String!
    jobType: String!
    experienceLevel: String!
    description: String!
    requirements: String!
    postedBy: String!
    datePosted: String!
    isActive: Boolean!
  }

  type Company {
    id: ID!
    name: String!
    industry: String!
    location: String!
    description: String!
    website: String!
    email: String!
  }

  type Application {
    id: ID!
    jobTitle: String!
    applicantName: String!
    email: String!
    coverLetter: String!
    status: String!
    appliedDate: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    githubUsername: String!
    oauthId: String!
    role: String!
    joinedDate: String!
  }

  # Inputs

  input AddJobInput {
    title: String!
    company: String!
    location: String!
    salary: String!
    jobType: String!
    experienceLevel: String!
    description: String!
    requirements: String!
  }

  input UpdateJobInput {
    title: String
    company: String
    location: String
    salary: String
    jobType: String
    experienceLevel: String
    description: String
    requirements: String
    isActive: Boolean
  }

  input AddCompanyInput {
    name: String!
    industry: String!
    location: String!
    description: String!
    website: String!
    email: String!
  }

  input UpdateCompanyInput {
    name: String
    industry: String
    location: String
    description: String
    website: String
    email: String
  }

  input AddApplicationInput {
    jobTitle: String!
    applicantName: String!
    email: String!
    coverLetter: String!
  }

  input UpdateApplicationInput {
    jobTitle: String
    applicantName: String
    email: String
    coverLetter: String
    status: String
  }

  input UpdateUserInput {
    name: String
    role: String
  }

  # Queries

  type Query {
    jobs: [Job!]!
    job(id: ID!): Job
    companies: [Company!]!
    company(id: ID!): Company
    applications: [Application!]!
    application(id: ID!): Application
    users: [User!]!
    user(id: ID!): User
    me: User
  }

  # Mutations

  type Mutation {
    addJob(input: AddJobInput!): Job!
    updateJob(id: ID!, input: UpdateJobInput!): Job
    deleteJob(id: ID!): Boolean!

    addCompany(input: AddCompanyInput!): Company!
    updateCompany(id: ID!, input: UpdateCompanyInput!): Company
    deleteCompany(id: ID!): Boolean!

    addApplication(input: AddApplicationInput!): Application!
    updateApplication(id: ID!, input: UpdateApplicationInput!): Application
    deleteApplication(id: ID!): Boolean!

    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean!
  }
`;
