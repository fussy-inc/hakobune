import { expect, test } from "bun:test";
import {fixLinkStyle} from "./fix-link-style.ts";

test("fixLinkStyle", async () => {
  const bodyRow = `[nanika ../nandemo/nanika.md]`;

  const expected = `[nanika]`;

  expect(fixLinkStyle(bodyRow)).toBe(expected);
});