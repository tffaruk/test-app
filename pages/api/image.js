import chromium from "chrome-aws-lambda";
import playwright from "playwright-core";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  // Start Playwright with the dynamic chrome-aws-lambda args
  console.log(playwright);
  const browser = await playwright.chromium.launch({
    args: chromium.args,

    headless: process.env.NODE_ENV !== "development" ? chromium.headless : true,
  });

  // Create a page with the recommended Open Graph image size
  const page = await browser.newPage({
    viewport: {
      width: 1200,
      height: 720,
    },
  });

  const url = req.query.path;

  await page.goto(url);

  const data = await page.screenshot({
    type: "png",
  });

  await browser.close();

  // Set the `s-maxage` property to cache at the CDN layer
  res.setHeader("Cache-Control", "s-maxage=31536000, public");
  res.setHeader("Content-Type", "image/png");
  res.end(data);
};
