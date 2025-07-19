# GitHub Actions Configuration System

This directory contains a reusable configuration system for GitHub Actions workflows that makes it easy to duplicate deployment setups across multiple projects.

## 📁 File Structure

```
.github/
├── project-config.yml          # Project-specific configuration
├── project-config.template.yml # Template for new projects
├── actions/
│   └── load-config/
│       └── action.yml          # Reusable action to load config
├── workflows/                  # Your workflow files
└── README.md                   # This file
```

## 🚀 Quick Start for New Projects

### 1. Copy Configuration Files
```bash
# Copy the entire .github/actions directory
cp -r .github/actions /path/to/new-project/.github/

# Copy and rename the template
cp .github/project-config.template.yml /path/to/new-project/.github/project-config.yml
```

### 2. Update Configuration
Edit `.github/project-config.yml` in your new project:

```yaml
project:
  gcp:
    project_id: "your-new-project-id"
    service_account: "github-actions@your-new-project.iam.gserviceaccount.com"
  firebase:
    project_id: "your-new-project-id"
    hosting:
      main_url: "https://your-new-project-id.web.app"
  app:
    name: "your-app-name"
    # ... update other values as needed
```

### 3. Copy Workflow Files
Copy any workflow files you need - they will automatically use your new configuration.

### 4. Set GitHub Secrets
Add these secrets to your GitHub repository:
- `GCP_SA_KEY` - Your Google Cloud service account JSON
- `GCP_PROJECT_ID` - Your Google Cloud project ID
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Your Firebase service account JSON

## 🔧 How It Works

### Configuration Loading
Each workflow loads configuration using the shared action:

```yaml
- name: 📋 Load Project Configuration
  id: config
  uses: ./.github/actions/load-config
```

### Using Configuration Values
Reference configuration values in subsequent steps:

```yaml
- name: 🏗️ Build Application
  run: |
    cd ${{ steps.config.outputs.web-entry-point }}
    ${{ steps.config.outputs.web-build-command }}
```

### Available Configuration Outputs

| Output | Description | Example |
|--------|-------------|---------|
| `gcp-project-id` | Google Cloud project ID | `my-project-123456` |
| `firebase-project-id` | Firebase project ID | `my-project-123456` |
| `web-entry-point` | Web app directory | `apps/web` |
| `web-build-command` | Build command | `npm run build` |
| `api-service-name-pattern` | Service naming | `api-{branch}` |
| And many more... | See `action.yml` for full list | |

## 🔄 Benefits

1. **Single Source of Truth** - All project configuration in one file
2. **Easy Duplication** - Copy config + workflows to new projects
3. **Consistent Deployments** - Same deployment logic across projects
4. **Environment Flexibility** - Easy to switch between staging/production
5. **Maintainable** - Update deployment logic in one place

## 📝 Example: Creating a New Project

```bash
# 1. Create new project structure
mkdir my-new-project
cd my-new-project
git init

# 2. Copy configuration system
cp -r /path/to/odyssey/.github/actions .github/
cp /path/to/odyssey/.github/project-config.template.yml .github/project-config.yml

# 3. Copy needed workflows
cp /path/to/odyssey/.github/workflows/deploy-web.production.* .github/workflows/

# 4. Update configuration
vim .github/project-config.yml  # Update all YOUR_* placeholders

# 5. Add GitHub secrets via web interface or CLI
gh secret set GCP_PROJECT_ID --body "my-new-project-123456"
# ... add other secrets
```

That's it! Your new project will have the same deployment capabilities.

## 🛠️ Customization

### Adding New Configuration Values
1. Add to `project-config.yml`
2. Add output to `actions/load-config/action.yml`
3. Add parsing logic in the load-config action
4. Use in workflows as `${{ steps.config.outputs.your-new-value }}`

### Supporting Different Frameworks
Update the `app.web` section in config for different frameworks:

```yaml
# For React/Next.js
app:
  web:
    entry_point: "frontend"
    build_command: "npm run build"
    environment_file: ".env.production"
    config_file: "public/config.js"

# For Vue/Nuxt
app:
  web:
    entry_point: "client"
    build_command: "npm run generate"
    environment_file: ".env.production"
    config_file: "static/config.js"
```

## 🔍 Troubleshooting

### Configuration Not Loading
- Ensure `yq` is available (auto-installed by the action)
- Check that `project-config.yml` exists and has valid YAML syntax
- Verify the config file path in workflow

### Workflow Failures
- Check that all required secrets are set
- Verify GCP/Firebase permissions
- Ensure configuration values match your actual infrastructure

### New Project Setup Issues
- Make sure you copied the entire `.github/actions` directory
- Update ALL placeholder values in the config file
- Verify GitHub secrets are set correctly

## 📚 Further Reading

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)