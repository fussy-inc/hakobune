hakobune
===

Notion から Cosense にデータを。

## 必要な設定

- `.env` ファイルを作成し、`COSENSE_CONNECT_SID` を設定する。
- `data` ディレクトリを作成し、`Export-...` のディレクトリを配置する。
  - つまり export して解凍したデータを配置する。

## 使い方

### データを書き込まず書き込まれる内容を確認する


```bash
bun run src/index.ts --dry-run --cosense-project=fussy --convert-rule-file=./convert-rule.csv --path=data --count=10
```

### データを書き込む

データを書き込む。

```bash
bun run src/index.ts --cosense-project=fussy --convert-rule-file=./convert-rule.csv --path=data
```

### 書き込みに失敗する

ページ内の文字列が多すぎる場合は書き込みに失敗します。

次のようなログが流れます。

```
failed to write xxx/xxx/xxx/nanika.md
```

md2sbなどを使い各自対応お願いします。

> [!NOTE]
> 一定の文字数などで分割して追記する方法などがありそうです。うまく実装できそうだったら実装します。



### オプション

- `--convert-rule-file` 変換ルールのファイルパス 変換のルールを記述するファイルはCSVを想定
- `--count` 渡された件数処理
- `--cosense-project` Cosense のプロジェクト名
- `--dry-run` 書き込みの代わりに標準出力
- `--path` Export したデータが置かれているパス

## 実装内容

Export したデータを `data/` に配置したとき次のようなツリーになる。
つまり `pagename` のページは `pagename.md` というファイルに、その下に作られているページは `pagename/subpagename.md` というファイルになる。

```
data
└─ Export-xxx
   └─ [teamspaces] xxx
         ├─ [teamspace] xxx(dir)
         │  ├─ [Page A](dir)
         │  │     ├─ [Page B](dir)
         │  │     │  └─ [Page C].md
         │  │     └─ [Page B].md
         │  └─ [Page A].md
         └─ [teamspace] xxx.md
```

Cosense には階層構造がないので、`pagename` は `pagename` というページになり、`pagename/subpagename` は `subpagename` というページにする。
また、`subpagename` には `[pagename]` という文字列を入れることでその関連を保つ。
