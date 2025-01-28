// This is a Next.js App Router API route (app/api/oecd/route.ts)

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

import puppeteer from 'puppeteer';


export async function GET(request: NextRequest) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        const user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
        await page.setUserAgent(user_agent);
        await page.setExtraHTTPHeaders({
            'Referer': 'https://www.google.com/',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Connection': 'keep-alive'
        });

        await page.goto('https://www.oecd.org/en/search/publications.html/robots.txt?orderBy=mostRelevant&page=0&minPublicationYear=2024&maxPublicationYear=2025&facetTags=oecd-languages%3Aen%2Coecd-content-types%3Apublications%2Fpolicy-papers%2Coecd-content-types%3Apublications%2Fpolicy-briefs', {
            waitUntil: 'networkidle0'
        });

        const content = await page.content();
        const $ = cheerio.load(content);
        const publications: { title: string; date: string; content: string; }[] = [];
        
        $('div.search-result').each((i, element) => {
            const title = $(element).find('h2 a').text().trim();
            const date = $(element).find('div.date').text().trim();
            const content = $(element).find('div.Summary').text().trim();

            publications.push({
                title,
                date,
                content
            });
        });

        await browser.close();

        return NextResponse.json({
            status: 'success',
            data: publications
        }, { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ 
            status: 'error', 
            message: 'Failed to fetch data from OECD website'
        }, { status: 500 });
    }
}