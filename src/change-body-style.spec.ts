import { expect, test } from "bun:test";
import {changeBodyStyle, type ConvertRule} from "./change-body-style.ts";

test("changeBodyStyle", async () => {
  const body = `
Hello
Please read it.
[nanika ../nandemo/nanika.md]
`;

  const expected = `
Ciao
Please read it.
[nanika]
`;

  const rules: ConvertRule[] = [
    {from: "Hello", to: "Ciao"},
  ];

  expect(await changeBodyStyle(body, rules)).toBe(expected);
});

