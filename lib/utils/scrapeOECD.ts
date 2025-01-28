import axios from "axios";
import * as cheerio from "cheerio";

interface Publication {
  title: string;
  date: string;
  summary: string;
}

async function fetchOECDPublications(): Promise<Publication[]> {
  const URL = "https://www.oecd.org/en/search/publications.html?orderBy=mostRelevant&page=0&facetTags=oecd-languages%3Aen%2Coecd-content-types%3Apublications%2Fpolicy-briefs%2Coecd-content-types%3Apublications%2Fpolicy-papers&minPublicationYear=2024&maxPublicationYear=2025";

  try {
    const response = await axios.get(URL);
    const $ = cheerio.load(response.data);

    const publications: Publication[] = [];

    // Adjust the selector based on the actual structure of the OECD webpage
    $('div.search-result').each((index, element) => {
      const $element = $(element);

      // Extract title
      const title = $element.find('.search-result-title').text().trim();

      // Extract date
      const date = $element.find('.search-result-date').text().trim();

      // Extract summary
      const summary = $element.find('.search-result-description').text().trim();

      if (title && date && summary) {
        publications.push({ title, date, summary });
      }
    });

    return publications;

  } catch (error) {
    console.error("Error during scraping:", error);
    return [];
  }
}

export default fetchOECDPublications;