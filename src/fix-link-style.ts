/**
 * もともとの Notion のリンクは次のようになっている
 * [Tactical Meetingの進め方](../Organization%20Structure%2096537181146e4312ac6110fa8ca21e65/%E9%96%B2%E8%A6%A7%E7%94%A8%EF%BC%9A%E3%83%9F%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%AF%E3%82%99%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%AB%208aa8008e8e524e94978f9afdfd7f7ffa/Tactical%20Meeting%E3%81%AE%E9%80%B2%E3%82%81%E6%96%B9%204e9155225cd24dec92c789c2b36634ef.md)
 * md2sbを通すと次のようになる
 * [Tactical Meetingの進め方 ../Organization%20Structure%2096537181146e4312ac6110fa8ca21e65/%E9%96%B2%E8%A6%A7%E7%94%A8%EF%BC%9A%E3%83%9F%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%AF%E3%82%99%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%AB%208aa8008e8e524e94978f9afdfd7f7ffa/Tactical%20Meeting%E3%81%AE%E9%80%B2%E3%82%81%E6%96%B9%204e9155225cd24dec92c789c2b36634ef.md]
 * これを
 * [Tactical Meetingの進め方 4e9155225cd24dec92c789c2b36634ef] に直す
 */
export function fixLinkStyle(bodyRow: string) {
  if (bodyRow.startsWith("[") && !bodyRow.startsWith("[*") && bodyRow.endsWith("]")) {
    const linkBody = bodyRow.slice(1, -1).split(" ");
    const link = linkBody.find((part) => part.endsWith(".md"))?.replace(".md", "");
    if (link === undefined) {
      return bodyRow;
    }

    const parentLink = link.split("/").at(-1)!;
    const decodedLink = decodeURIComponent(parentLink);
    return `[${decodedLink}]`;
  }
  return bodyRow;
}