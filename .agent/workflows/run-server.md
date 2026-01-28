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

---

### 🌍 Making it Global (International Alliance Members)
To let people across the world use your registry, follow these steps:

1. **Install ngrok**: Download from [ngrok.com](https://ngrok.com/download).
2. **Start the Tunnel**: While your server is running, open a new command prompt and run:
   ```powershell
   ngrok http 5000
   ```
3. **Copy the Link**: Look for the line `Forwarding` (e.g., `https://a1b2.ngrok-free.app`).
4. **Update the HTML**: 
   - Open `harry-potter.html` in Notepad or VS Code.
   - Find the line: `const GLOBAL_REGISTRY_URL = 'http://localhost:5000';`
   - Paste your ngrok link inside the quotes.
5. **Push to GitHub**: 
   - `git add .`, `git commit -m "Updated Global URL"`, `git push origin main`.
6. **Share**: Now anyone who visits your GitHub page will be connected to your PC's registry brain!
