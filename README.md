# GPT2.0 Chat App

## Project Overview

This project is a simple chat application built using **Next.js** and **React**. The application allows users to send messages and view chat history. It integrates with the **EchoGPT API** for chatbot functionalities.

## Features

- **User-friendly UI** different from EchoGPT's original UI.
- **Chat interface** for user interaction.
- **Chat history** to keep track of previous messages.
- **API integration** with EchoGPT.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** EchoGPT API

## Live Demo

[GPT2.0 Live Site](https://gpt20.netlify.app/)

## Repository

[GitHub Repository](https://github.com/abujaforhadi/GPT2.0)

## Installation and Setup

### Prerequisites

Ensure you have the following installed:

- Node.js (>= 16)
- npm or yarn

### Steps to Run the Project

1. **Clone the Repository**

   ```sh
   git clone https://github.com/abujaforhadi/GPT2.0.git
   cd GPT2.0
   ```

2. **Install Dependencies**

   ```sh
   npm install  # or yarn install
   ```

3. **Get API Keys**

   - Sign up at [EchoGPT Platform](https://platform.echogpt.live/).
   - Get your API key from the dashboard.

4. **Set Up Environment Variables**\
   Create a `.env.local` file in the project root and add the following line:

   ```env
   NEXT_PUBLIC_ECHOGPT_API_KEY=your_api_key_here
   ```

5. **Run the Development Server**

   ```sh
   npm run dev  # or yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

- The chat interface communicates with **EchoGPT API**.
- Refer to the [API Docs](https://platform.echogpt.live/) for request/response formats.

## Deployment

To deploy the application, run:

```sh
npm run build  # or yarn build
npm run start  # or yarn start
```

You can deploy it on platforms like **Vercel** or **Netlify**.

## Contact

For any queries, reach out to **Md. Abu Jafor** at [abujafor.me](https://abujafor.me).

