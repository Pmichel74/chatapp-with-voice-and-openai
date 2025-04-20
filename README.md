# 🎙️ Voice Chat App with OpenAI

![OpenAI](https://img.shields.io/badge/Powered%20by-OpenAI-16a085?style=for-the-badge&logo=openai&logoColor=white)
![Flask](https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Watson](https://img.shields.io/badge/IBM-Watson-054ADA?style=for-the-badge&logo=ibm&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

An interactive chat application that uses voice recognition to convert speech to text, OpenAI's GPT API to generate intelligent responses, and speech synthesis to read these responses aloud.

## 📋 Table of Contents

- [🚀 Features](#-features)
- [🔧 Technologies Used](#-technologies-used)
- [📦 Installation](#-installation)
- [🏃‍♂️ Getting Started](#-getting-started)
- [🎮 How to Use](#-how-to-use)
- [👨‍💻 Architecture](#-architecture)
- [⚙️ Configuration](#-configuration)
- [🧪 Troubleshooting](#-troubleshooting)
- [📝 Notes](#-notes)
- [📚 Resources](#-resources)

## 🚀 Features

- **🎤 Voice Recognition**: Convert speech to text via Watson Speech-to-Text API
- **🤖 AI Processing**: Generate intelligent responses with OpenAI's GPT-3.5
- **🔊 Voice Synthesis**: Convert text responses to speech via Watson Text-to-Speech API
- **🎨 Adaptive Interface**: Light/dark mode and customizable voice options
- **📱 Responsive Design**: Works on computers, tablets, and smartphones

## 🔧 Technologies Used

- **Backend**:
  - 🐍 Python with Flask
  - 🤖 OpenAI API for AI processing
  - 🔊 IBM Watson APIs for speech recognition and synthesis
  
- **Frontend**:
  - 🌐 HTML5, CSS3, JavaScript
  - 📚 jQuery for DOM interactions
  - 🎨 Bootstrap for responsive design
  
- **Deployment**:
  - 🐳 Docker for containerization
  - 🚀 Portability across different platforms

## 📦 Installation

### Prerequisites

- Docker installed on your machine
- An IBM Cloud account (free) to access Watson APIs (optional, default credentials are provided)
- An OpenAI account for an API key (optional, default configuration is available)

### Installation Steps

1. Clone this repository:
   ```
   git clone https://github.com/your-username/chatapp-with-voice-and-openai.git
   cd chatapp-with-voice-and-openai
   ```

2. Build the Docker image:
   ```
   docker build -t voice-chatapp-powered-by-openai .
   ```

## 🏃‍♂️ Getting Started

Run the Docker container:
```
docker run -p 8000:8000 voice-chatapp-powered-by-openai
```

Access the application in your browser:
```
http://localhost:8000
```

## 🎮 How to Use

1. **🎤 To speak**:
   - Click on the microphone icon
   - Speak clearly
   - Click again to stop recording
   - Wait for the audio and text response

2. **⌨️ To type**:
   - Write your message in the text field
   - Press Enter or click the send icon
   - Wait for the response

3. **🎛️ Options**:
   - Use the voice selector to choose different voices
   - Toggle between light and dark modes according to your preferences

## 👨‍💻 Architecture

The application is structured as follows:

```
chatapp-with-voice-and-openai/
├── server.py               # Main Flask server
├── worker.py               # API integration functions
├── Dockerfile              # Docker configuration
├── requirements.txt        # Python dependencies
├── certs/                  # Certificates for APIs (optional)
├── static/                 # Static files (JS, CSS)
└── templates/              # HTML templates
```

### Workflow

1. User speaks or types a message
2. Frontend sends the audio to the backend
3. Backend converts audio to text (Speech-to-Text)
4. Text is sent to OpenAI for processing
5. OpenAI's response is converted to speech (Text-to-Speech)
6. Audio and text response is sent back to the frontend

## ⚙️ Configuration

### Environment Variables

You can configure the following parameters in the Dockerfile:

- `OPENAI_API_KEY`: Your OpenAI API key
- `WATSON_STT_URL`: Watson Speech-to-Text API URL
- `WATSON_TTS_URL`: Watson Text-to-Speech API URL

### Model Customization

You can modify the assistant's behavior in `worker.py`:

```python
# Example of modifying the OpenAI prompt
prompt = "Act as a personal assistant with expertise in [your domain]."
```

## 🧪 Troubleshooting

### Common Issues

1. **Microphone not responding**:
   - Check that you have granted microphone permissions to the browser
   - Check for errors in the browser developer console (F12)
   - Try another browser (Chrome recommended)

2. **Server connection errors**:
   - Verify that the Docker container is running
   - Check Docker logs for errors:
     ```
     docker logs [container-id]
     ```

3. **No audio response**:
   - Check that your device is not in silent mode
   - Verify that the returned audio format is supported by your browser

## 📝 Notes

- The application currently uses free APIs with limitations
- For production use, configure your own API keys
- IBM Watson Speech-to-Text models work best with clear audio and minimal background noise

## 📚 Resources

- [OpenAI Documentation](https://platform.openai.com/docs/introduction)
- [IBM Watson Documentation](https://cloud.ibm.com/docs/watson)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Docker Guide](https://docs.docker.com/get-started/)

---

## 🙏 Acknowledgements

This project uses IBM Watson and OpenAI services. Thanks to their teams for making these technologies accessible.

## 📄 License

MIT © [Your Name]

---

*Made with ❤️ to make voice technology accessible*