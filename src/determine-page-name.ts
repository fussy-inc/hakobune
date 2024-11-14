export function determinePageName(mdFilePath: string) {
  return mdFilePath.split("/").at(-1)!.replace(".md", "");
}
