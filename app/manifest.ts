import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HoneyMoon Hotel",
    short_name: "HoneyMoon",
    description:
      "Hotel boutique 5 estrellas frente al Pacífico. Un santuario privado frente al horizonte.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0c0f",
    theme_color: "#0a0c0f",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
