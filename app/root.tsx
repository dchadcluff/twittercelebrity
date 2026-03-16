import { Outlet, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { Footer } from "./components/Footer";
import "./styles/app.css";

export function HydrateFallback() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ backgroundColor: "#0a0a0f", color: "#e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          Loading...
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
