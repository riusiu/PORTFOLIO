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
   code はコード抜粋（body はバッククォート ` で囲むと改行ごと書けます）。不要なら code: [] に。
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
    code: [
      {
        title: "コルーチンでの出題処理（現在の方式）",
        note: "「1拍分待つ」を挟みながら、合図の音・手の表示・順番の決定を順番に進めています。",
        file: "JankenManager.cs（一部抜粋）",
        body: `/// <summary>
/// ビートインターバルでディレイをかけてテンポよく指示出し
/// </summary>
private IEnumerator issueSequenceByBeat()
{
    Instance.PlaySe(SeAudioClipNames.Pi);
    yield return new WaitForSeconds((float)_beatInterval * 1);
    Instance.PlaySe(SeAudioClipNames.Pi);
    yield return new WaitForSeconds((float)_beatInterval * 1);
    RandomHand();
    Instance.PlaySe(SeAudioClipNames.Piron);
    yield return new WaitForSeconds((float)_beatInterval * 1);
    Instance.PlaySe(SeAudioClipNames.Piron);
    TurnOrder();
    JKReset();
}`
      },
      {
        title: "自作の予約実行スケジューラ（以前の方式）",
        note: "BGMの再生中はBGMの時間、止まっている間はオーディオ用の時計を基準にして、処理を「何拍後」で予約していました。",
        file: "JankenManager.cs（一部抜粋）",
        body: `// 今この瞬間の「基準時間」を返す
// BGM動作中は BgmVirtualTime、BGM停止中は DSP時間を使う
private double Now()
{
    if (_useMusicClock)
    {
        return _JKSoundManager.BgmVirtualTime;
    }
    return AudioSettings.dspTime - _dspBaseTime;
}

// 今からbeat拍後にactionを予約
private void ScheduleBeat(int beat, Action action)
{
    ScheduleIn(_beatInterval * beat, action);
}`
      }
    ],
    ideas: [
      {
        title: "音楽とズレないじゃんけん進行の設計",
        body: "BGMに合わせて出題や判定が進むように、処理を「何拍後に実行するか」で予約する仕組みを自作しました。BGMの再生中はBGMの再生時間を、ポーズ中やフェーズ切り替え中はオーディオ用の時計（dspTime）を基準に切り替えることで、テンポが変わる場面でも音と処理がずれないようにしました。"
      },
      {
        title: "テンポの加速と出題パターンの切り替え",
        body: "フェーズが進むとBPMを上げてBGMを差し替え、出す手の順番も固定とランダムを切り替える仕組みにしました。"
      }
    ],
    problems: [
      {
        problem: "自作のスケジューラは音との同期には強い一方で、時計の切り替えや予約の管理でコードが複雑になり、自分を含めチームの誰もが触りにくい状態になりました。また、他のミニゲームはコルーチンで進行を管理していて、書き方が揃っていませんでした。",
        solution: "チームで修正しやすいことを優先して、他のミニゲームと同じコルーチン方式に作り直しました。出題・回答・スコア表示などの流れをコルーチンごとに分け、「1拍分待つ」処理を挟んで順番に進める形にしたことで、読みやすく直しやすいコードになりました。"
      }
    ],
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
    links: []
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
    role: "企画（ゲームのアイデア）／［プログラムで担当した箇所］",
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
      "ジャイロセンサーを使うなど、遊びのアイデアは自分で考えた",
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

/* ---------- 企画・プランニングでの関わり ----------
   トップページに表示されます。
   workId に作品の id を入れると作品ページへ、link にURLを入れるとそのページへリンクします。
--------------------------------- */
const PLANNING = [
  {
    title: "Gakupenbiyori",
    workId: "gakupenbiyori",
    role: "企画",
    body: "ゲームの企画（アイデア）を考えた。［どんな発想から生まれたか、企画で大事にしたことを追記］"
  },
  {
    title: "Gyro（目隠しスイカ割り）",
    link: "ai.html#gyro",
    role: "アイデア出し",
    body: "ジャイロセンサーを使うなど、遊びのアイデアを考えた。［アイデアのきっかけを追記］"
  },
  {
    title: "BrakingViking",
    role: "企画修正・バランス調整",
    body: "企画の修正と、ゲームバランスの調整をメンバーのPCで直接行った。［どんな調整をして、どう良くなったかを追記］"
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
