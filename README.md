# Arborist

A simple, customizable Linktree-style theme with profile, messaging, and link cards for [Hugo](https://gohugo.io/).

## Live Preview

![Arborist Screenshot](https://raw.githubusercontent.com/seangalie/arborist/refs/heads/main/static/images/screenshot.png)

## Features

- **Profile**: Prominently show a profile image, display name, short bio, and configurable social icons (Font Awesome supported).
- **About** (optional): Add one or more titled sections to summarize your background, specialties, or personal interests.
- **Link cards**: Flexible, styled cards for links — each card supports an icon, title, optional description, and target URL.
- **Font Awesome icons**: Use any Font Awesome class for link icons and social buttons for consistent visual style.
- **Modular partials**: All markup lives in Hugo partials so you can override or extend templates without changing core files.

## Getting Started

1. Create a new Hugo site (if you haven’t already)

```shell
hugo new site my-site
cd my-site
```

2. Clone this repo into your Hugo site’s themes folder

```shell
git clone https://github.com/seangalie/arborist.git themes/arborist
```

3. Enable the theme in your new site’s `config.toml`. If `config.toml` doesn't exists, then edit `hugo.toml` by adding the following code.

```yaml
baseURL = "https://yourdomain.com/"
languageCode = "en-us"
title = "Your Web Site Title"
theme = "arborist"
minVersion = "0.115.0"

[params]
  description = "A simple, customizable Linktree-style Hugo theme with profile, messaging, and link cards."
  googleAnalytics = ""    # Your Google Analytics ID, if you use GA

[outputs]
  home = ["HTML"]
```

4. Copy or edit `content/_index.md` (the only file you really need to modify).

5. Start Hugo’s development server to view the site.

```shell
hugo server -D
```

## Configuration

All content is driven by Front Matter in `content/_index.md`:

```yaml
title: "arborist"
profileImage: "images/profile.png" # Prefer placing this under `assets/images/` to enable Hugo image processing (theme will fall back to `static/` if not found)
name: "Your Name"
description: "Your tagline, motto, credo, slogan, or role"
socials:
  - url: "https://github.com/<yourusername>"
    icon: "fab fa-github"
# ...
about:
  title: "About Me"
  sections:
    - heading: "Professional Experience"
      content: "Add some text about your experience."
# ...
links:
  - href: "https://github.com/<yourusername>"
    icon: "fab fa-github"
    title: "GitHub"
    description: "Explore my project repositories"
# ...
```

- **Add/Remove Sections**: Simply remove or comment out `about:` blocks to toggle that section.
- **Add Links**: Append to the `links:` array.
- **Add Socials**: Append to the `socials:` array.

## Background animation

This theme includes an optional animated background (particle flow) that uses p5.js. You can disable it by setting the site parameter `params.bgAnimation = false` in your site config. By default the animation is enabled.

You can also control the number of particles and whether to bundle p5 locally:

```toml
[params]
  bgAnimation = true
  bgParticles = 600    # adjust for performance
  bundleP5 = false     # set true if you place p5.min.js at static/vendor/p5.min.js
```

To bundle p5 locally, download a production build from https://p5js.org/download/ and place `p5.min.js` at `static/vendor/p5.min.js`, then set `params.bundleP5 = true`.

## Partials

- `layouts/partials/profile.html`
- `layouts/partials/about.html`
- `layouts/partials/link-card.html`

You can override any partial by copying it into your project’s `layouts/partials/` folder and editing.

## Development

Run Hugo’s development server:

```shell
hugo server -D
```

Navigate to [http://localhost:1313](http://localhost:1313) to preview changes live.

## Deployment

### Traditional Stack (with Github)

1. Build the site:

  ```shell
  hugo --gc --minify
  ```

2. Push your site repository to GitHub.

3. Create GitHub Secrets for FTP Credentials:

  - Navigate to your repository's Settings tab.
  - Go to Secrets and variables > Actions.
  - Click New repository secret.
  - Create secrets for your FTP username (FTP_USERNAME) and password (FTP_PASSWORD). You may also need secrets for the host (FTP_SERVER) and port (FTP_PORT) if they are not standard.

4. Create a GitHub Actions Workflow File:

  - In your repository, create a directory structure .github/workflows/.
  - Inside this directory, create a .yml file (e.g., deploy.yml). 

5. Configure the Workflow:

  - Define when the workflow should run (e.g., on push to the main branch).
  - Use the SamKirkland/FTP-Deploy-Action action to handle the FTP upload.
  - Provide the necessary inputs to the action, referencing your GitHub secrets for sensitive information.

Here's an example deploy.yml file:

```yaml
name: Deploy HTML to FTP

on:
  push:
    branches:
      - main # Or your main branch name

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4 # Checkout your repository content

      - name: FTP Deploy
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5 # Use the FTP Deploy action
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          server-dir: /public_html/ # Target directory on your FTP server
          local-dir: ./ # Local directory to upload (e.g., where your HTML files are)
```

6. Commit and Push: Commit your deploy.yml file and push it to your GitHub repository. The workflow will then trigger based on your defined on event, deploying your HTML pages to the specified FTP server.

### GitHub Pages

1. In `config.toml`, set:

  ```yaml
  baseURL = "https://<username>.github.io/<repo>/"
  publishDir = "public"
  ```

2. Build the site:

  ```shell
  hugo --gc --minify
  ```

3. Push the `public/` folder to the `gh-pages` branch:

  ```shell
  git subtree push --prefix public origin gh-pages
  ```

### Vercel

1. Push your repo to GitHub.

2. Sign in to [Vercel](https://vercel.com/) and import the project.

3. Set the **Framework Preset** to **Hugo**.

4. Use the build command:

  ```shell
  hugo --gc --minify
  ```

5. Output directory: `public`

6. Deploy and visit your Vercel URL.

## Customization

- **CSS**: Update configuration or your custom CSS in `assets/css` or `static/css`.
- **Icons**: Change any Font Awesome icon class in front matter.
- **Templates**: Edit partials or create new ones in `layouts/partials/`.

## Contributing

1. Fork this repository.
2. Create a feature branch: `git checkout -b feature/my-change`
3. Commit your changes: `git commit -m "feat: add new ..."
4. Push to branch: `git push origin feature/my-change`
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.