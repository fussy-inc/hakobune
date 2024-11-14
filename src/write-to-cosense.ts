import { launch, type Page, type Browser } from "puppeteer";

type Content = {
  project: string;
  pageName: string;
  text: string;
};

export default async function writeToCosense(content: Content, sid: string) {
  const { project, pageName, text } = content;
  const url = new URL(`https://scrapbox.io/${project}/${encodeURIComponent(pageName)}?body=${encodeURIComponent(text)}`);
  // console.log(url.toString());
  const browser: Browser = await launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page: Page = await browser.newPage();

  await page.setCookie({ name: "connect.sid", value: sid, domain: "scrapbox.io" });
  await page.goto(url.toString());

  await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
  await browser.close();
}
