# 西川龍昇｜ゲームプログラマー ポートフォリオ

Unity・C#でのゲーム制作と、AIを使った開発環境づくりの取り組みを掲載しています。

- **Webサイト**: https://riusiu.github.io/PORTFOLIO/
- **PROGRAM**: チーム制作ゲームと担当した実装内容
- **TOOLS & AI**: Unity MCP、AI3D Launcher、Memory Hub、Gyroなど
- **Gyroのブラウザ版**: https://riusiu.github.io/Gyrodemo/

## ポートフォリオの操作

トップのDEBUG MENU、またはF1〜F5キー（代替の数字キー1〜5）で移動できます。

| 操作 | 移動先 |
| --- | --- |
| F1 / 1 | PROGRAM |
| F2 / 2 | TOOLS & AI |
| F3 / 3 | STRENGTHS |
| F4 / 4 | BUILD LOG |
| F5 / 5 | PROFILE |

ブラウザやOSがファンクションキーを優先する場合、数字キーを使ってください。
入力欄の操作中・修飾キーの同時押下時は動作しません。

## サイト構成

- `index.html`: トップページ・制作映像・主要な実績
- `works.html` / `work.html`: ゲーム一覧・作品詳細
- `ai.html`: Tools & AI一覧と個別詳細（`?id=...`）
- `css/debug.css`: デバッグUIモチーフのデザイン・レスポンシブ対応
- `js/app.js`: 描画・ページ切替・ショートカット
- `js/data.js`: 作品・経歴・ツールなどの掲載情報
- `js/log.js`: BUILD LOG

旧URL `ai-detail.html?id=...` からも新しい `ai.html?id=...` に転送されます。

## コードの掲載方針

チーム制作のコードは自分の担当範囲を明示し、公開可能な範囲だけを掲載します。
掲載するコードについては、役割・設計意図・検証方法を説明できるようにします。
完成していない実装や、検証していない機能を完成実績として扱いません。

## 編集と公開

WebサイトはGitHub Pagesで公開しています。掲載データを変更する際は `js/data.js` を確認してください。
UIを変更するときは `index.html`、`css/debug.css`、`js/app.js` も確認します。
複数AIで作業する場合は、Google Driveの共通作業資料を先に読み、GitHubをコードの正本とします。

## 注意

- 掲載作品の一部はチーム制作です。制作メンバーの成果物を個人制作と表記しません。
- このリポジトリの掲載説明と、リンク先の各ゲーム・外部プロジェクトのソース公開可否は別です。
