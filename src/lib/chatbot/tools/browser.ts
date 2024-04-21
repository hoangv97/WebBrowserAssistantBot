import { Readability } from '@mozilla/readability';
import * as cheerio from 'cheerio';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';
import got from 'got';

export const getWebSearchResults = async (keyword: string) => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: `${process.env.BROWSERLESS_URL}`,
  });
  const page = await browser.newPage();

  await page.goto('https://google.com/');
  await page.type('textarea', keyword);
  await Promise.all([page.keyboard.press('Enter'), page.waitForNavigation()]);

  const topLinks = await page.evaluate(() => {
    const results = [
      ...document.querySelectorAll('#search a'),
    ] as HTMLElement[];
    return [...results].map((el) => ({
      content: el.innerText,
      url: el.getAttribute('href'),
    }));
  });

  browser.close();

  return topLinks;
};

export const getWebPageContent = async (url: string) => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: `${process.env.BROWSERLESS_URL}`,
  });
  const page = await browser.newPage();
  await page.goto(url);
  const result = await page.evaluate(() => {
    const title = document.querySelector('title')?.textContent;
    const elementsToRemove = [
      'footer',
      'header',
      'nav',
      'script',
      'style',
      'link',
      'meta',
      'noscript',
      'img',
      'picture',
      'video',
      'audio',
      'iframe',
      'object',
      'embed',
      'param',
      'track',
      'source',
      'canvas',
      'map',
      'area',
      'svg',
      'math',
    ];
    elementsToRemove.forEach((el) => {
      const elements = document.querySelectorAll(el);
      elements.forEach((element) => element.remove());
    });
    return {
      title,
      content: document.body.textContent?.trim(),
    };
  });

  browser.close();

  return result;
};
