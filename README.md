
# SkyScan

> Scan the sky. Understand the universe.

SkyScan is an AI-powered space awareness platform that helps users discover what's happening above them in real time. By combining live space data with conversational AI, SkyScan transforms complex astronomical information into simple, engaging insights.

Built for a hackathon focused on making space more accessible, personal, and interactive.

---

## Features

###  Live ISS Tracking
Track the International Space Station's current position in real time.

### NASA Astronomy Picture of the Day
Explore NASA's featured space image and learn the science behind it.

### AI Space Assistant
Ask questions in natural language:

- What's happening in space right now?
- Where is the ISS?
- Tell me about today's NASA image.
- What should I know about today's space activity?

The assistant combines live space data with AI-generated explanations.

### Real-Time Space Updates
Stay informed with up-to-date information from public space APIs.

---

##  Tech Stack

- **Python**
- **Streamlit**
- **Google Gemini API**
- **NASA Open APIs**
- **Open Notify API**

---

## How It Works

1. Fetches live data from space-related APIs.
2. Collects relevant information into a structured context.
3. Passes the context and user query to Gemini.
4. Generates clear, human-friendly responses.

```text
User Question
      ↓
SkyScan
      ↓
Live Space Data
      ↓
Gemini AI
      ↓
Personalized Answer
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/skyscan.git
cd skyscan
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_key_here
NASA_API_KEY=your_key_here
```

Run the app:

```bash
streamlit run app.py
```

---

## Problem

Space data is publicly available, but it often remains inaccessible to everyday users due to technical complexity.

---

## Solution

SkyScan bridges this gap by combining live astronomical data with AI-powered explanations, making space exploration accessible to anyone with a browser.

---
<img width="1918" height="853" alt="image" src="https://github.com/user-attachments/assets/65110c5e-39d4-4873-94fb-6adbff6f8f0c" />

## Future Improvements

- Personalized sky observations based on location
- Planet visibility forecasts
- Meteor shower alerts
- Satellite pass notifications
- Interactive sky maps
- Voice-enabled AI assistant

---

## Team Ishan Dutta, Rishit Mukherjee, Vishesh Bhati

Built during a hackathon by a team passionate about technology, AI, and space exploration.

---

## License

MIT License
