---
description: How to run the Hogwarts Registry Local Server
---

### Option A: Standard Run
1. Open a terminal in the project root directory.
2. Install the required Python libraries:
```powershell
pip install -r requirements.txt
```
3. Start the registry server:
```powershell
python noyzbot.py
```

### Option B: Docker Run (Recommended)
1. Ensure Docker Desktop is running.
2. Open a terminal in the project root and run:
```powershell
docker-compose up --build
```

### Accessing the Registry
1. Once the server is running, open [harry-potter.html](file:///c:/Users/NOY/OneDrive/Documents/GitHub/my-puzzles-guide/my-puzzles-guide/harry-potter.html) in your browser.
2. Enjoy your globally synchronized magical registry! 🏰✨
