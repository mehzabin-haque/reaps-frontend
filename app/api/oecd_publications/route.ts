// pages/api/oecd-publications.ts (Next.js <= 12 or 13 in pages folder)
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
// or import { JSDOM } from "jsdom"; or "cheerio" for scraping

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1. Fetch the HTML from the OECD link
    const response = await fetch("https://www.oecd.org/en/search/publications.html?...");
    const html = await response.text();

    // 2. Parse with JSDOM / Cheerio
    // e.g., const $ = cheerio.load(html);

    // 3. Extract relevant info (id, title, description, date, category, link)
    // This part depends on the HTML structure
    const publications = [
      {
        id: "someUniqueId",
        title: "Example Title",
        description: "Short description...",
        date: "2025-01-28",
        category: "Policy Brief",
        link: "https://www.oecd.org/document-link",
      },
      // ... more
    ];

    // 4. Respond with JSON
    res.status(200).json(publications);
  } catch (err) {
    res.status(500).json({ error: "Failed to scrape OECD publications" });
  }
}
