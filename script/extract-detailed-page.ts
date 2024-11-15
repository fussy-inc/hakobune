/**
 * Extract success page from convert.log
 *
 * USAGE:
 * bun script/extract-success-page.ts --log-files="./convert.log,./convert2.log,./convert3.log,./convert4.log" --success --failed
 */

import { parseArgs } from "util";
import { determinePageName } from "../src/determine-page-name";

async function setup() {

  // ref: https://bun.sh/guides/process/argv
  const { values } = parseArgs({
    args: Bun.argv,
    options: {
      "log-files": {
        type: "string",
      },
      "success": {
        type: "boolean",
        default: false,
      },
      "failed": {
        type: "boolean",
        default: false,
      },
    },
    strict: true,
    allowPositionals: true,
  });

  const logFilePaths = (values["log-files"] ?? "").split(",");

  if (logFilePaths.length === 0) {
    console.error("log-file is required");
    process.exit(1);
  }

  if (!values["success"] && !values["failed"]) {
    console.error("either success or failed is required");
    process.exit(1);
  }

  return { logFilePaths, success: values["success"], failed: values["failed"] };
}

const successRegex = /success to write/;
const failedRegex = /failed to write/;

async function main() {
  const { logFilePaths, success, failed } = await setup();
  const $lines = logFilePaths.map(async (logFilePath) => (await Bun.file(logFilePath).text()).split("\n"));
  const lines = (await Promise.all($lines)).flat();
  const pages = lines.map((line) => {
    if (success && successRegex.test(line)) {
      return determinePageName(line.replace(successRegex, ""));
    }
    if (failed && failedRegex.test(line)) {
      return determinePageName(line.replace(failedRegex, ""));
    }

    return null;
  }).filter((page) => page !== null);

  pages.forEach((page) => {
    console.log(page);
  });
}

await main();
process.exit(0);
