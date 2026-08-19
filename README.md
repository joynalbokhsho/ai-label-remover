# Remove AI Label Instantly 🛡️

A privacy-first, client-side web application built with [Next.js](https://nextjs.org/) that strips embedded metadata from images directly in your browser. This tool helps remove C2PA, XMP, EXIF, and PNG metadata to bypass automated AI-generated labels on platforms like Instagram and Facebook.

## Features ✨

- **100% Offline Processing**: All image processing happens locally within your browser using the HTML5 Canvas API. Your files are **never** uploaded to any server.
- **Removes All Metadata**: Effectively strips out EXIF, XMP, C2PA, and other invisible metadata tags.
- **Bypasses AI Labels**: Prevents false-positive or forced "AI Generated" labels on social media platforms.
- **Format Support**: Supports `JPG`, `PNG`, `WebP`, and `JFIF`. 
- **Auto-Conversion**: Automatically converts `WebP` and `JFIF` uploads into clean `.jpg` files upon download.
- **Live Global Stats**: Uses Redis to anonymously track the total number of images cleaned globally.

## Tech Stack 🛠️

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Styling**: Vanilla CSS
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [Redis](https://redis.io/) (via `ioredis`) for tracking the global processed image count

## Getting Started 🚀

### Prerequisites

- Node.js 18.x or later
- A running instance of Redis (optional, but required for the stats counter to work)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/joynalbokhsho/ai-label-remover.git
   cd ai-label-remover
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or yarn install / pnpm install
   ```

3. **Set up Environment Variables:**
   Copy the example environment file and update it with your Redis connection string if necessary:
   ```bash
   cp .env.example .env.local
   ```
   *By default, the app looks for a local Redis instance at `redis://localhost:6379`.*

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## How it Works & Bypassing Facebook AI Labels 🧠

Social media platforms like Facebook and Instagram rely on hidden metadata embedded inside image files to detect if an image was created or edited by AI. Specifically, they look for:
- **C2PA (Coalition for Content Provenance and Authenticity)** tags.
- **IPTC/XMP** metadata (often injected by tools like Photoshop's Generative Fill, Midjourney, or DALL-E).
- **EXIF data** containing software signatures.

If Facebook's systems detect these specific metadata tags upon upload, they will automatically slap an "AI Info" or "Made with AI" label on your post, often without giving you the option to remove it.

**Our application bypasses this completely by destroying the metadata:**
1. You select or drag-and-drop your AI-generated image.
2. The browser reads the image file and loads it into a virtual HTML5 `<canvas>`.
3. The `<canvas>` strictly only cares about the **visible pixel data** (the colors and shapes) and fundamentally ignores all hidden file metadata.
4. The canvas then exports those raw pixels into a brand-new image file (`canvas.toDataURL`). 
5. Because the newly exported file is built entirely from scratch from raw pixels, all the original C2PA, XMP, and EXIF tags are permanently left behind and destroyed. 

When you upload this "cleaned" image to Facebook or Instagram, their scanners find absolutely zero AI metadata, and your image is posted normally without the automated label.

## Contributing 🤝

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/joynalbokhsho/ai-label-remover/issues).

## License 📝

This project is open-source and available under the [MIT License](LICENSE).
