# Dottie - Menstrual Health Assessment App

## Overview

Dottie is a mobile-friendly web application designed to provide personalized menstrual health assessments for teens and young adults. The app guides users through a series of questions about their menstrual cycle and provides educational information, personalized insights, and evidence-based recommendations based on their responses.

![Dottie App](https://placeholder.svg?height=300&width=150)

## Features

- **Comprehensive Assessment**: Six-question assessment covering cycle length, period duration, flow heaviness, pain level, and associated symptoms
- **Educational Content**: Informative sections about typical menstrual patterns and symptoms
- **Age-Appropriate Guidance**: Content tailored to different age groups
- **Personalized Results**: Analysis of the user's menstrual health based on their responses
- **Custom Recommendations**: Practical advice based on assessment results
- **Resource Library**: Curated resources for further learning and support
- **Privacy-Focused**: No personal health information is stored
- **AI Chat Assistant**: Gemini-powered assistant with fallback mock responses for local development

## Tech Stack

### Frontend
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: SQLite (development), SQL Server (production)
- **AI Integration**: Google Gemini API (with mock implementation for local development)
- **Cloud Storage**: Supabase (with mock implementation for local development)

# Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version `18.0.0` or later.
- **npm** or **yarn**: Package managers for installing dependencies.

To check your current Node.js and npm versions, run:
```bash
node -v
npm -v
```

If you don't have Node.js installed, follow these steps:

#### **Installing Node.js**

1. **Using `nvm` (Recommended)**:
   - Install `nvm` (Node Version Manager):
     ```bash
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
     ```
   - Restart your terminal or reload your shell:
     ```bash
     source ~/.zshrc  # or ~/.bashrc for bash or export NVM_DIR="$HOME/.nvm" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
     ```
   - Install the latest LTS version of Node.js:
     ```bash
     nvm install --lts
     ```

2. **Using the Official Installer**:
   - Download the latest LTS version from the [official Node.js website](https://nodejs.org/).
   - Follow the installation instructions for your operating system.

3. **Using a Package Manager**:
   - On macOS (using Homebrew):
     ```bash
     brew install node
     ```
   - On Linux (using `apt`):
     ```bash
     sudo apt update
     sudo apt install nodejs npm
     ```

---

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lmcrean/dottie.git
   cd dottie
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Environment Variables (Optional):
   - The application is designed to run without environment variables in development mode
   - If you want to use real API services, create a `.env` file in the backend directory with:
     ```
     # Gemini API key (optional - mock responses used if not provided)
     VITE_GEMINI_API_KEY=your_gemini_api_key
     
     # Supabase configuration (optional - mock client used if not provided)
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_PUBLIC=your_supabase_anon_key
     
     # Local development flag
     LOCAL_DEV=true
     ```

---

### Running the Application

1. Start the development server for both frontend and backend:
   ```bash
   # From the frontend directory
   npm run dev
   ```
   This will start both the backend (on port 5000) and frontend (on port 3000) concurrently.

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

**Note**: The application uses mock implementations for Gemini AI and Supabase when API keys are not provided, allowing for full functionality during local development without external dependencies.

---

### Project Structure

- **/frontend**: React application built with Vite
- **/backend**: Node.js API server
  - **/routes**: API endpoints organized by feature
  - **/services**: Shared services (logger, database connections, etc.)
  - **/models**: Data models and database interactions
  - **/db**: Database configuration and migrations

---

### Building for Production

1. Build the frontend application:
   ```bash
   cd frontend
   npm run build
   ```

2. For production deployment, ensure appropriate environment variables are set in your hosting environment.

---

### Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your commit message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request on GitHub.

---

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

### Support

If you encounter any issues or have questions, please [open an issue](https://github.com/lmcrean/dottie.git/issues) on GitHub.