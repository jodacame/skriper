# Skriper

Skriper is a tool similar to ChatGPT that allows the creation of specialized assistants on specific topics and facilitates more organized conversations using modern technologies such as Node.js, Nuxt 3, and SQLite3. The application connects to the OpenAI API to provide advanced conversational assistance capabilities.

## Features

- **Specialized Assistants**: Create assistants tailored to specific topics, enabling more focused and coherent conversations.
- **Enhanced Context**: Enrich each assistant with additional documentation and files to provide more precise and relevant responses.
- **OpenAI Integration**: Connect to the OpenAI API to leverage advanced conversational capabilities.
- **Attachment Support**: Share files and documents with assistants to enhance the conversation.

## Screenshots

Here are a few screenshots of Skriper in action:

| [![Home](/assets/skriper.home.png)](/assets/skriper.home.png) | [![Assistant](/assets/skriper.assistant.png)](/assets/skriper.assistant.png) |
|-------------------------------------------------------------|-------------------------------------------------------------------|
| **Home**                                                   | **Assistant**                                                    |


## Requirements

To run Skriper, you'll need to have the following tools installed on your machine:

- Docker
- OpenAI API Key

## Docker Installation

### Installation with Persistent Storage

To ensure your data is preserved and survives Docker container restarts or rebuilds, you'll need to use a persistent volume. The Skriper code creates its SQLite database at the /data directory inside the container.


#### Clone the repository and navigate into it:

```bash
git clone git@github.com:jodacame/skriper.git
cd skriper
```

#### Build the Docker image:

```bash
docker build --build-arg API_URL=http://localhost:3001 -t skriper .
```

#### Run the Docker container with a persistent volume:

```bash
docker run -p 3000:3000 -p 3001:3001 \
-e API_URL=http://localhost:3001 \
-e OPENAI_API_KEY=sk-1234567890 \
-e JWT_SECRET=secret-1234567890 \
-v skriper_data:/data \
skriper
```

### Important Note


Persistent Volume: The ```-v skriper_data:/data``` flag creates a Docker volume named ```skriper_data``` that is mounted to the ```/data``` directory inside the container. This ensures all data stored in the database is retained across container rebuilds and restarts.

By setting up Skriper with a persistent volume, you can ensure that your data remains safe and intact even when making changes to the Docker container.


Replace `http://localhost:3001` with the URL where the application is running. If you're running Skriper locally, you can use `http://localhost:3001` or if you have a production URL, you can use that instead.

### Environment Variables

To configure Skriper, you'll need to set the following environment variables:

- **OPENAI_API_KEY**: API key to connect to OpenAI.
- **JWT_SECRET**: Secret key to sign and verify JSON Web Tokens.
- **API_URL**: Base URL for internal API requests.


### Optional Variables

You may also define these optional variables to customize server settings:

- **PORT**: The port on which the application will listen. Defaults to 3000.
- **SERVER_PORT**: A secondary port, if needed, defaults to 3001.


Here's a section explaining the installation process and first-time setup:

---

## Installation and First-Time Setup

After setting up Skriper using Docker or your preferred installation method, you will need to perform a first-time login at the configured URL, typically `http://localhost:3000`.

### First-Time Login

Upon your first visit to Skriper, you will be prompted to enter a email and password. Here's the catch: you can enter any credentials you like on this initial login. Skriper will create an account with the information you provide, so make sure to choose credentials you can remember.

### Important Notes

- **Future Logins**: Remember that the email and password you use on your first login are the ones you'll need for all future accesses. There's no current system in place for password recovery within the application.
  
- **Password Recovery**: If you happen to forget your credentials, you'll need to manually update them directly in the database. Given that Skriper uses SQLite3, you can access the database file and modify the user information as needed.

By following these steps, you'll be all set to start using Skriper and enjoying its conversational capabilities tailored to your preferences.


## Why I Made This Project

The inspiration behind Skriper stemmed from my previous experience using ChatGPT. While ChatGPT is an incredibly powerful tool, I faced the challenge of maintaining order in my conversations. Often, topics would get mixed up, making it difficult to manage multiple conversations efficiently.

With Skriper, my goal is to provide a solution that offers greater organization and structure in conversational interactions. I wanted to create an environment where it is possible to develop specialized assistants on specific topics, allowing users to maintain a more coherent and focused flow of conversation.

A key feature of Skriper is its ability to enhance each assistant with additional documentation and files. This enables the assistants to maintain a much more precise and relevant context about the topics discussed, significantly improving the quality and usefulness of the responses provided.

In summary, Skriper not only aims to resolve the disorder of conversations but also to enhance each assistant with enriched context, providing users with a more organized and efficient user experience.


Here's a light-hearted section you can add to your README:

---

## A Little Project with Big Ambitions

This project has always been a personal endeavor and has never seen the light of the public internet. It lived quietly on my devices, diligently serving my needs without any external exposure. However, I've decided to release it as open source because there might just be people out there who could benefit from it too.

Why pay a monthly subscription to ChatGPT when you can pay-as-you-go for API use with the latest models? This way, you get more flexibility and potentially lower costs.

I must confess, I might have missed handling a few errors along the way. But hey, that's part of the charm! By making Skriper public, I hope to engage a community of enthusiasts who see the potential in this project. Together, we can polish, refine, and enhance it into something even better. So dive in, explore, and let's improve Skriper together!

## License

This project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE