/**
 * Extract success page from convert.log
 *
 * USAGE:
 * bun script/extract-success-page.ts --log-file=./convert.log
 */

import { parseArgs } from "util";

async function setup() {

  // ref: https://bun.sh/guides/process/argv
  const { values } = parseArgs({
    args: Bun.argv,
    options: {
      "log-file": {
        type: "string",
      },
    },
    strict: true,
    allowPositionals: true,
  });

  const logFilePath = values["log-file"];

  if (logFilePath === undefined) {
    console.error("log-file is required");
    process.exit(1);
  }


  return { logFilePath };
}

async function main() {
  const { logFilePath } = await setup();
  const lines = await Bun.file(logFilePath).text();

  const successPages = lines.split("\n").filter((line) => line.includes("success to write"));
  const pages = successPages.map((line) => {
    const replacedLine = line.replace("success to write ", "");
    return replacedLine.split("/").at(-1)!.replace(".md", "");
  });
  console.log(pages.join("\n"));
}

await main();
process.exit(0);
