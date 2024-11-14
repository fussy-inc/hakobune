import { determinePageName } from "./determine-page-name.ts";
import { expect, test } from "bun:test";

test("determinePageName", () => {
  const mdFilePath = "data/Export 1234-5678/[teamspaces] 1234-5678/[teamspace] 1234-5678/Page A/Page B.md";
  expect(determinePageName(mdFilePath)).toBe("Page B");
});
