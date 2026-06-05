import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Let's support larger base64 file payloads (e.g. up to 20MB)
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ limit: "20mb", extended: true }));

  // Ensure 'uploads' directory is created statically in root
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  // Serve uploads statically
  app.use("/uploads", express.static(uploadsDir));

  // Ensure 'public/uploads' is created so Vite can serve files immediately in local routes
  const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(publicUploadsDir)) {
    fs.mkdirSync(publicUploadsDir, { recursive: true });
  }

  // Backend endpoint: Handle image uploads (Base64 fileData payload)
  app.post("/api/upload", (req, res) => {
    try {
      const { fileName, fileData } = req.body;
      if (!fileName || !fileData) {
        return res.status(400).json({ error: "Missing required fileName or fileData fields" });
      }

      // Match base64 pattern (e.g. "data:image/png;base64,iVB...")
      const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid fileData base64 encoding format" });
      }

      const fileBuffer = Buffer.from(matches[2], "base64");
      
      // Clean filename and make unique
      const sanitisedName = Date.now() + "_" + fileName.replace(/[^a-zA-Z0-9\.\-_]/g, "_");
      
      // Save file inside the primary filesystem uploads directory
      fs.writeFileSync(path.join(uploadsDir, sanitisedName), fileBuffer);

      // Save file inside Vite's public uploads directory for hot dev environment discovery
      try {
        fs.writeFileSync(path.join(publicUploadsDir, sanitisedName), fileBuffer);
      } catch (e) {
        console.warn("Could not copy uploaded image to public/uploads folder:", e);
      }

      console.log(`Image upload succeed: ${sanitisedName}`);
      return res.json({ 
        url: `/uploads/${sanitisedName}`,
        fileName: sanitisedName 
      });
    } catch (err: any) {
      console.error("Image Upload handler error:", err);
      return res.status(500).json({ error: err?.message || "Internal server error occurred during image upload" });
    }
  });

  // Setup Vite development middleware vs production static handler
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Fallback for SPA routing in development when arbitrary path is hit directly:
    app.get("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const indexHtmlPath = path.resolve(process.cwd(), "index.html");
        let html = fs.readFileSync(indexHtmlPath, "utf-8");
        html = await vite.transformIndexHtml(url, html);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[KCF Backend] Full-stack Express server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
