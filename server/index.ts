import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later"
});

// Body parsing middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, path } = req;
  
  const originalJson = res.json;
  let responseBody: unknown;
  
  res.json = function(body) {
    responseBody = body;
    return originalJson.call(this, body);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    if (path.startsWith("/api")) {
      const logData = {
        method,
        path,
        status: statusCode,
        duration: `${duration}ms`,
        ...(responseBody && { response: responseBody })
      };
      
      log(JSON.stringify(logData, null, 2));
    }
  });

  next();
});

// API routes with rate limiting
app.use("/api", apiLimiter, registerRoutes(app));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  const status = (err as any).status || (err as any).statusCode || 500;
  const message = process.env.NODE_ENV === "production"
    ? "Internal Server Error"
    : err.message;
  
  if (status >= 500) {
    console.error(`Server Error: ${err.stack || err.message}`);
  }

  res.status(status).json({ 
    error: message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
});

// Server startup
(async () => {
  try {
    const port = parseInt(process.env.PORT || "5000");
    const host = process.env.HOST || "0.0.0.0";

    // Vite setup in development
    if (process.env.NODE_ENV === "development") {
      const server = await setupVite(app);
      server.listen(port, host, () => {
        log(`Development server running on http://${host}:${port}`);
      });
    } else {
      // Production static file serving
      serveStatic(app);
      app.listen(port, host, () => {
        log(`Production server running on http://${host}:${port}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on("SIGTERM", () => {
  log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});
