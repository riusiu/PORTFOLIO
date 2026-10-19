/* ==========================================================
   ポートフォリオの中身はこのファイルだけ編集すればOKです。
   ［ ］で囲まれた部分を自分の情報に書き換えてください。
   ========================================================== */

/* ---------- プロフィール・連絡先 ---------- */
const SITE = {
  name: "［名前］",                 // 例：山田 太郎
  nameEn: "PORTFOLIO",              // ヘッダー左上の表示（例：TARO YAMADA）
  school: "［学校名］",
  department: "［学科・専攻］",
  graduation: "［20XX年3月 卒業見込み］",
  role: "ゲームプログラマー",
  favoriteGenres: "［好きなゲームジャンル］",
  catchphrase: "［一言キャッチコピー　例：〇〇を大切にするゲームプログラマー］",
  photo: "",                        // 顔写真やアイコン 例："images/profile.jpg"（空ならイニシャル表示）

  intro: [
    "［自己紹介1：どこで何を学んでいるか］",
    "［自己紹介2：普段使っている技術や、作っているゲームの傾向］",
    "［自己紹介3：このサイトで何を紹介しているか］"
  ],

  philosophy: [
    { title: "［考え方1の見出し］", body: "［ゲーム制作で大切にしていることを1〜2文で］" },
    { title: "［考え方2の見出し］", body: "［チーム制作での姿勢など］" },
    { title: "［考え方3の見出し］", body: "［これから伸ばしたいこと］" }
  ],

  github: "https://github.com/riusiu",
  email: "",                        // 例："name@example.com"
  others: [
    // { label: "X", url: "https://x.com/..." },
  ]
};

/* ---------- 作品 ----------
   作品を追加するときは { ... } をひとつコピーして下に貼り、中身を書き換えます。
   並び順がそのまま一覧・メニューの順番になります（いちばん見せたい作品を先頭に）。
   id は半角英数字（URLになります：work.html?id=gyro）。
   type は "team"（チーム制作）か "solo"（個人制作）。
   画像は images/ フォルダに入れて "images/ファイル名.png" と書きます。
   youtube は動画URLの v= の後ろのID。空なら動画欄は出ません。
--------------------------------- */
const WORKS = [
  {
    id: "space-survival",
    title: "SpaceSurvival",
    subtitle: "［ジャンル］",
    type: "team",
    status: "学校の後期ゲームプロジェクト",
    thumbnail: "",
    screenshots: [],
    youtube: "",
    engine: "Unity / C#",
    teamSize: "［人数］",
    period: "［制作期間］",
    role: "じゃんけんパートのプログラム（リズムシステム・結果演出など）",
    summary: "［一行紹介］",
    description: [
      "［ゲームの概要：どんな遊びか、プレイヤーの目的は何か］",
      "［じゃんけんパートがゲームの中でどんな役割か］"
    ],
    myCode: [
      "じゃんけんの進行管理（JankenManager）と、BPMに合わせて進むリズムじゃんけんシステム",
      "テンポの加速への対応、出す手の順番（固定・ランダム）の制御",
      "じゃんけん結果の演出、看板のアニメーション",
      "スコア処理、プレイヤー・エイリアンのアニメーション、解答台のライト点滅",
      "BGMのフェード、スタート時のポップアップ、ポーズなど"
    ],
    ideas: [{ title: "［工夫した点の見出し　例：リズムとじゃんけん進行の同期］", body: "［何を、なぜ、どう工夫したか］" }],
    problems: [{ problem: "［発生した問題　例：進行管理をコルーチン以外の方法にしたときに起きた問題］", solution: "［どう原因を調べ、どう解決したか］" }],
    links: []                       // 非公開リポジトリなのでリンクなし
  },
  {
    id: "golfer-shot",
    title: "GolferShot",
    subtitle: "［ジャンル］（初代とリメイク）",
    type: "",                       // "team" か "solo" を入れてください
    status: "リメイク作品",
    thumbnail: "",
    screenshots: [],
    youtube: "",
    engine: "Unity / C#",
    teamSize: "初代：2人（実質ほぼ1人で制作）／リメイク：1人",
    period: "［制作期間］",
    role: "［担当箇所　例：プログラム全般］",
    summary: "3Dを授業で習う前に、実質ほぼ一人で作り切った初代と、そのリメイク。",
    versionsTitle: "初代とリメイクの比較",
    versions: [
      {
        label: "初代 GolferShot",
        teamSize: "2人（実質ほぼ1人で制作）",
        engine: "Unity / C#",
        context: "3Dをまだ授業で習っていない状態で制作",
        points: ["パワーゲージ", "［初代で実装したこと］"]
      },
      {
        label: "リメイク GolfRemake",
        teamSize: "1人",
        engine: "Unity / C#（lilToon使用）",
        context: "［制作時期・当時の状況］",
        points: ["プレイヤーの操作全般", "［リメイクで改善したこと］"]
      }
    ],
    description: [
      "［ゲームの概要：どんな遊びか、プレイヤーの目的は何か］",
      "［リメイクしようと思った理由］"
    ],
    myCode: ["［担当した機能］"],
    ideas: [{ title: "［工夫した点の見出し］", body: "［何を、なぜ、どう工夫したか］" }],
    problems: [{ problem: "［発生した問題　例：3Dの知識がない中でぶつかった壁］", solution: "［どう調べて乗り越えたか］" }],
    links: [
      { label: "GitHub（初代）", url: "https://github.com/riusiu/GolferShot" }
    ]
  },
  {
    id: "cell-spiral",
    title: "細胞スパイラル",
    subtitle: "［ジャンル］",
    type: "team",
    status: "",
    thumbnail: "",
    screenshots: [],
    youtube: "",
    engine: "Unity / C#",
    teamSize: "［人数］",
    period: "［制作期間］",
    role: "［担当箇所］",
    summary: "［一行紹介］",
    description: ["［ゲームの概要：どんな遊びか、プレイヤーの目的は何か］"],
    myCode: [
      "食べ物のデータ・一覧の管理（FoodList / FoodStatus）",
      "プレートまわりの実装・角度調整",
      "シーンをまたいでもBGMが途切れない仕組み",
      "リザルト画面の文言",
      "メンバーのブランチの統合（マージ）"
    ],
    ideas: [{ title: "［工夫した点の見出し］", body: "［何を、なぜ、どう工夫したか］" }],
    problems: [{ problem: "［発生した問題］", solution: "［どう原因を調べ、どう解決したか］" }],
    links: []                       // 非公開リポジトリなのでリンクなし
  },
  {
    id: "braking-viking",
    title: "BrakingViking",
    subtitle: "［ジャンル］",
    type: "team",
    status: "",
    thumbnail: "",
    screenshots: [],
    youtube: "",
    engine: "Unity",
    teamSize: "［人数］",
    period: "［制作期間］",
    role: "［担当箇所］",
    summary: "［一行紹介］",
    description: ["［ゲームの概要：どんな遊びか、プレイヤーの目的は何か］"],
    myCode: ["［担当した機能］"],
    ideas: [{ title: "［工夫した点の見出し］", body: "［何を、なぜ、どう工夫したか］" }],
    problems: [{ problem: "［発生した問題］", solution: "［どう原因を調べ、どう解決したか］" }],
    links: []
  },
  {
    id: "gakupenbiyori",
    title: "Gakupenbiyori",
    subtitle: "［ジャンル］",
    type: "team",
    status: "",
    thumbnail: "",
    screenshots: [],
    youtube: "",
    engine: "Unity / C#（LitMotion使用）",
    teamSize: "［人数］",
    period: "［制作期間］",
    role: "［担当箇所］",
    summary: "［一行紹介］",
    description: ["［ゲームの概要：どんな遊びか、プレイヤーの目的は何か］"],
    myCode: ["［担当した機能　例：タイトル画面・リザルト画面］"],
    ideas: [{ title: "［工夫した点の見出し］", body: "［何を、なぜ、どう工夫したか］" }],
    problems: [{ problem: "［発生した問題］", solution: "［どう原因を調べ、どう解決したか］" }],
    links: []                       // 非公開リポジトリなのでリンクなし
  }
];

/* ---------- AI研究 ----------
   1テーマ = { ... } ひとつ。コピーして増やせます。
--------------------------------- */
const AI_INTRO = "［このページの説明　例：ゲーム開発の効率化を目的に、AIエージェントの活用を研究しています。］";

const AI_RESEARCH = [
  {
    id: "gyro",
    title: "AIを活用した短期ゲーム開発：Gyro（目隠しスイカ割り）",
    period: "2日",
    status: "",
    summary: "AIを主体に、スマホ2台で遊ぶブラウザゲームをHTML / JavaScriptで2日で制作。",
    goal: "［目的　例：AIを使うと、どこまで短期間で遊べるゲームを形にできるか試す］",
    tools: ["HTML / JavaScript", "WebRTC", "スマホのジャイロセンサー", "［使用したAI］"],
    approach: [
      "スマホ2台を合言葉（コード）でつなぎ、プレイヤー役と観測者役で遊ぶ仕組みにした",
      "ジャイロセンサーで「振る」操作、カメラを使う「ゆうれい探し」モード、1台で遊べるソロモードを用意",
      "［AIにどこまで任せ、どこを自分で判断・修正したか］"
    ],
    results: ["2日で遊べる形まで完成", "［遊んだ人の反応など］"],
    learnings: ["［AIに任せてうまくいったこと・うまくいかなかったこと］"],
    links: [
      { label: "GitHub", url: "https://github.com/riusiu/Gyro" }
    ]
  },
  {
    id: "personal-agent",
    title: "自分専用AIエージェントの構築",
    period: "［期間　例：2026年8月〜］",
    status: "進行中",
    summary: "Claudeを、締め切り管理や企画・実装タスクを手伝う自分専用のエージェントとして運用する試み。",
    goal: "スマホ・ノートPC・デスクトップPCの3端末で情報を同期し、どの端末からでも作業を引き継げるようにすること。",
    tools: ["Claude", "Google Drive", "［ほかに使ったツール］"],
    approach: [
      "Google Driveに GameDev/ フォルダを作り、今週のタスク・企画・実装・学校提出物に分けて管理",
      "AIに渡す前提情報を context ファイルや CLAUDE.md にまとめ、毎回説明しなくても作業できるようにした",
      "［ほかに試したこと］"
    ],
    results: ["［うまくいったこと・数値などの成果］"],
    learnings: [
      "複雑なPC操作をAIに任せるとAPIの利用量がすぐ上限に達するため、コストを意識した使い分けが必要",
      "［ほかに学んだこと］"
    ],
    links: []
  },
  {
    id: "research-2",
    title: "［研究テーマ2　例：AIを使ったゲーム開発フローの効率化］",
    period: "［期間］",
    status: "",
    summary: "［一行紹介］",
    goal: "［目的・解決したかった課題］",
    tools: ["［使用技術］"],
    approach: ["［やったこと］"],
    results: ["［結果］"],
    learnings: ["［学んだこと］"],
    links: []
  }
];

/* ---------- スキル ----------
   level：1〜5（0 なら「未設定」と表示）
   works：そのスキルを使った作品の id を並べると、スキル表から作品へリンクされます。
--------------------------------- */
const SKILLS = [
  { name: "Unity",           years: "［年数］", level: 0, note: "", works: ["space-survival", "golfer-shot", "cell-spiral", "gakupenbiyori"] },
  { name: "C#",              years: "［年数］", level: 0, note: "", works: ["space-survival", "golfer-shot", "cell-spiral", "gakupenbiyori"] },
  { name: "HTML / JavaScript", years: "［年数］", level: 0, note: "WebRTC・端末センサーを使用（AI研究ページのGyro）", works: [] },
  { name: "Git / GitHub",    years: "［年数］", level: 0, note: "チーム開発でブランチ運用", works: ["space-survival", "golfer-shot", "cell-spiral", "gakupenbiyori"] },
  { name: "JetBrains Rider", years: "［年数］", level: 0, note: "", works: [] },
  { name: "Unreal Engine",   years: "［年数］", level: 0, note: "授業で学習中", works: [] }
];
