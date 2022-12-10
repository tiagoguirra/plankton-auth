# Plankton auth

A authentication micro-service for plankton application.

## About Plankton

Plankton is an application for diagrams documentation projetcs, develop 


### Developed with

- [NodeJS](https://nodejs.org/)
- [Serveless](https://serverless.com/)
- [Typescript](https://www.typescriptlang.org/)
- [AWS Cognito](https://aws.amazon.com/pt/cognito/)


### Requirements

1. `nodeJs` na versão `14.x`
2. `serverless` versão `3.22.x`

### Installation

```bash
yarn install
```

### Running

**With debugger mode**

```bash
yarn debug
```

> This mode runs with node inpection to provider debugger on editors like VS Code.

**Without debugger mode**

```bash
serverless offline
```