import {fixLinkStyle} from "./fix-link-style.ts";

export type ConvertRule = {
  from: string;
  to: string;
};

export async function loadConvertRules(path: string): Promise<ConvertRule[]> {
  const file = Bun.file(path);
  const text = await file.text();
  const rules = text.split("\n").map((line) => {
    const [from, to] = line.split(",");
    return { from, to };
  });
  // 改行して終わると { from: "", to: undefined } になるので削除
  return rules.filter((rule) => rule.from !== "" && rule.to !== undefined);
}

export async function changeBodyStyle(body: string, rules: ConvertRule[]) {
  rules.forEach((rule) => {
    body = body.replace(rule.from, rule.to);
  });
  body = body.split("\n").map(fixLinkStyle).join("\n");
  return body;
}
