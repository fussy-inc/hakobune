import { parseArgs } from "util";
import { readdir } from "node:fs/promises";
import md2sb from "md2sb";
import { loadConvertRules, changeBodyStyle } from "./change-body-style.ts";
import writeToCosense from "./write-to-cosense.ts";
import { determinePageName } from "./determine-page-name.ts";

async function setup() {

  // ref: https://bun.sh/guides/process/argv
  const { values } = parseArgs({
    args: Bun.argv,
    options: {
      "dry-run": {
        type: "boolean",
        default: false,
      },
      path: {
        type: "string",
        default: "./data",
      },
      "convert-rule-file": {
        type: "string",
        default: "./convert-rule.csv",
      },
      "cosense-project": {
        type: "string",
        default: "fussy",
      },
      take: {
        type: "string",
      },
      "skip-page": {
        type: "string",
      },
    },
    strict: true,
    allowPositionals: true,
  });

  const dryRun = values["dry-run"];
  const path = values.path;
  const convertRuleFilePath = values["convert-rule-file"];
  const convertRules = await loadConvertRules(convertRuleFilePath);
  const cosenseProject = values["cosense-project"];
  const skipPagePath = values["skip-page"];
  const cosenseConnectSid = process.env["COSENSE_CONNECT_SID"];

  if (cosenseConnectSid === undefined) {
    console.error("COSENSE_CONNECT_SID is required");
    process.exit(1);
  }

  const paths = await readdir(path, { recursive: true });
  const mdFiles = paths.filter((path) => path.endsWith(".md"));
  const take = values.take ? parseInt(values.take) : undefined;

  return { path, mdFiles, paths, convertRules, cosenseConnectSid, cosenseProject, dryRun, take, skipPagePath };
}

async function main() {
  const { path, mdFiles, convertRules, cosenseConnectSid, cosenseProject, dryRun, take, skipPagePath } = await setup();

  let mdFilesToWrite = mdFiles;
  if (take !== undefined) {
    mdFilesToWrite = mdFiles.slice(0, take);
  }
  if (skipPagePath !== undefined) {
    const skipPage = await Bun.file(skipPagePath).text();
    const skipPageNames = skipPage.split("\n");
    mdFilesToWrite = mdFilesToWrite.filter((mdFile) => !skipPageNames.includes(determinePageName(mdFile)));
  }

  console.info(`writes ${mdFilesToWrite.length.toLocaleString()} pages`);
  for (const mdFile of mdFilesToWrite) {
    const text = await Bun.file(path + "/" + mdFile).text();
    const parentPageName = mdFile.split("/").at(-2)?.replace(".md", "");
    if (parentPageName === undefined) {
      console.error(`parentPageName is undefined ${mdFile}`);
    }
    const body = (await md2sb(text)) + "\n" + (parentPageName ? `[${parentPageName}]\n` : "");
    const convertedBody = await changeBodyStyle(body, convertRules);
    const pageName = determinePageName(mdFile);

    if (!dryRun) {
      await writeToCosense({ project: cosenseProject, pageName, text: convertedBody }, cosenseConnectSid)
        .then(() => console.info(`success to write ${mdFile}`))
        .catch(() => console.info(`failed to write ${mdFile}`));
    } else {
      console.info(convertedBody);
    }
  }

  console.info("done");
  process.exit(0);
}

await main();
