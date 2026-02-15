(function () {
  const TYPES = {
    ai_writer: {
      id: "ai_writer",
      name: "AIライター",
      catchCopy: "AIを味方に、言葉で稼ぐ新時代のライター",
      description:
        "AIツールを活用して効率的に高品質な文章を生み出せるタイプです。短時間から始めやすく、継続で収益化しやすい副業です。"
    },
    sns_manager: {
      id: "sns_manager",
      name: "SNS運用代行",
      catchCopy: "企業のSNSを動かす、影の仕掛け人",
      description:
        "トレンド把握と発信設計が得意で、アカウント運用の改善を回せるタイプです。企業案件と相性がよく、実績がそのまま武器になります。"
    },
    content_sales: {
      id: "content_sales",
      name: "コンテンツ販売",
      catchCopy: "あなたの知識が、誰かの「ほしい」になる",
      description:
        "知識や経験を教材やテンプレートに変換して届けるのに向いています。ストック型で積み上げる働き方と相性が高いタイプです。"
    },
    small_business: {
      id: "small_business",
      name: "スモール起業",
      catchCopy: "小さく始めて、大きく育てる",
      description:
        "意思決定と行動の速さがあり、自分で事業を回す力があります。副業から小さく検証して広げるアプローチに向いています。"
    },
    web_designer: {
      id: "web_designer",
      name: "WEBデザイナー",
      catchCopy: "センスを武器に、画面の向こうを彩る",
      description:
        "視覚表現と体験設計の感度が高く、サイトやバナー制作で価値を出しやすいタイプです。スキル上昇が単価に直結します。"
    },
    video_editor: {
      id: "video_editor",
      name: "動画編集",
      catchCopy: "映像の力で、人の心を動かす",
      description:
        "動画の構成とテンポ設計が得意で、編集案件に適性があります。需要の高い領域で、実務経験がそのまま強みになります。"
    },
    short_video: {
      id: "short_video",
      name: "ショート動画編集",
      catchCopy: "15秒で世界を変える、バズの仕掛け人",
      description:
        "短尺でインパクトを作る感覚に優れ、トレンド適応も得意です。SNS時代に需要が高く、伸びやすい領域に向いています。"
    },
    programmer: {
      id: "programmer",
      name: "プログラマー",
      catchCopy: "論理で組み立てる、デジタル建築家",
      description:
        "論理思考と学習継続力があり、技術習得を積み上げられるタイプです。長期で見るほど単価と自由度を高めやすい副業です。"
    }
  };

  const QUESTIONS = [
    {
      id: "Q1",
      axis: "適性",
      text: "自分の考えを文章で伝えるのが得意だ",
      isNegative: false,
      targets: [
        { type: "ai_writer", weight: 5 },
        { type: "content_sales", weight: 2 }
      ]
    },
    {
      id: "Q2",
      axis: "適性",
      text: "文章を書くとき、論理的な構成を意識できる",
      isNegative: false,
      targets: [
        { type: "ai_writer", weight: 4 },
        { type: "programmer", weight: 2 }
      ]
    },
    {
      id: "Q3",
      axis: "適性",
      text: "初対面の人とも、すぐに打ち解けられる",
      isNegative: false,
      targets: [
        { type: "sns_manager", weight: 5 },
        { type: "small_business", weight: 3 }
      ]
    },
    {
      id: "Q4",
      axis: "適性",
      text: "相手の反応を見て、伝え方を柔軟に変えられる",
      isNegative: false,
      targets: [
        { type: "sns_manager", weight: 4 },
        { type: "content_sales", weight: 2 }
      ]
    },
    {
      id: "Q5",
      axis: "適性",
      text: "自分の知識や経験を、人にわかりやすく教えられる",
      isNegative: false,
      targets: [
        { type: "content_sales", weight: 5 },
        { type: "ai_writer", weight: 2 }
      ]
    },
    {
      id: "Q6",
      axis: "適性",
      text: "情報を整理して、体系的にまとめるのが得意だ",
      isNegative: false,
      targets: [
        { type: "content_sales", weight: 4 },
        { type: "ai_writer", weight: 3 }
      ]
    },
    {
      id: "Q7",
      axis: "適性",
      text: "チームをまとめたり、周囲を巻き込む力がある",
      isNegative: false,
      targets: [
        { type: "small_business", weight: 5 },
        { type: "sns_manager", weight: 2 }
      ]
    },
    {
      id: "Q8",
      axis: "適性",
      text: "リスクを取ることに対して、比較的抵抗が少ない",
      isNegative: false,
      targets: [
        { type: "small_business", weight: 5 },
        { type: "content_sales", weight: 2 }
      ]
    },
    {
      id: "Q9",
      axis: "適性",
      text: "色やレイアウトのバランスに敏感な方だ",
      isNegative: false,
      targets: [
        { type: "web_designer", weight: 5 },
        { type: "short_video", weight: 2 }
      ]
    },
    {
      id: "Q10",
      axis: "適性",
      text: "見た目の美しさやデザインにこだわりがある",
      isNegative: false,
      targets: [
        { type: "web_designer", weight: 4 },
        { type: "short_video", weight: 3 }
      ]
    },
    {
      id: "Q11",
      axis: "適性",
      text: "流行やトレンドをいち早くキャッチできる方だ",
      isNegative: false,
      targets: [
        { type: "short_video", weight: 5 },
        { type: "sns_manager", weight: 4 }
      ]
    },
    {
      id: "Q12",
      axis: "適性",
      text: "短い時間でインパクトのある表現を作るのが得意だ",
      isNegative: false,
      targets: [
        { type: "short_video", weight: 5 },
        { type: "sns_manager", weight: 3 }
      ]
    },
    {
      id: "Q13",
      axis: "適性",
      text: "問題が起きたとき、原因を論理的に分解できる",
      isNegative: false,
      targets: [
        { type: "programmer", weight: 5 },
        { type: "small_business", weight: 2 }
      ]
    },
    {
      id: "Q14",
      axis: "適性",
      text: "新しいツールや技術を覚えるのが早い",
      isNegative: false,
      targets: [
        { type: "programmer", weight: 4 },
        { type: "web_designer", weight: 3 },
        { type: "video_editor", weight: 2 }
      ]
    },
    {
      id: "Q15",
      axis: "適性",
      text: "動画のテンポや音のタイミングに対する感覚が鋭い",
      isNegative: false,
      targets: [
        { type: "video_editor", weight: 5 },
        { type: "short_video", weight: 4 }
      ]
    },
    {
      id: "Q16",
      axis: "好き嫌い",
      text: "文章を書いたり、ブログを読んだりするのが好きだ",
      isNegative: false,
      targets: [
        { type: "ai_writer", weight: 5 },
        { type: "content_sales", weight: 2 }
      ]
    },
    {
      id: "Q17",
      axis: "好き嫌い",
      text: "AIツールを使って何かを作ることにワクワクする",
      isNegative: false,
      targets: [
        { type: "ai_writer", weight: 5 },
        { type: "programmer", weight: 2 },
        { type: "content_sales", weight: 2 }
      ]
    },
    {
      id: "Q18",
      axis: "好き嫌い",
      text: "SNS投稿やフォロワーの反応を見るのが楽しい",
      isNegative: false,
      targets: [
        { type: "sns_manager", weight: 5 },
        { type: "short_video", weight: 3 }
      ]
    },
    {
      id: "Q19",
      axis: "好き嫌い",
      text: "他人のSNSアカウントに改善点を見つけることが多い",
      isNegative: false,
      targets: [
        { type: "sns_manager", weight: 5 },
        { type: "content_sales", weight: 2 }
      ]
    },
    {
      id: "Q20",
      axis: "好き嫌い",
      text: "自分の知識やノウハウを商品化することに興味がある",
      isNegative: false,
      targets: [
        { type: "content_sales", weight: 5 },
        { type: "small_business", weight: 3 }
      ]
    },
    {
      id: "Q21",
      axis: "好き嫌い",
      text: "オンライン講座や教材を、自分で作ってみたい",
      isNegative: false,
      targets: [
        { type: "content_sales", weight: 5 },
        { type: "ai_writer", weight: 2 }
      ]
    },
    {
      id: "Q22",
      axis: "好き嫌い",
      text: "将来は自分のビジネスを持ちたいと思っている",
      isNegative: false,
      targets: [
        { type: "small_business", weight: 5 },
        { type: "content_sales", weight: 3 }
      ]
    },
    {
      id: "Q23",
      axis: "好き嫌い",
      text: "おしゃれなWEBサイトやバナーを見ると、自分でも作りたくなる",
      isNegative: false,
      targets: [
        { type: "web_designer", weight: 5 },
        { type: "short_video", weight: 2 }
      ]
    },
    {
      id: "Q24",
      axis: "好き嫌い",
      text: "YouTubeやTikTokを見て、自分ならこう編集すると考えることがある",
      isNegative: false,
      targets: [
        { type: "video_editor", weight: 5 },
        { type: "short_video", weight: 5 }
      ]
    },
    {
      id: "Q25",
      axis: "好き嫌い",
      text: "映像素材を切ったりつないだりする作業は楽しそうだ",
      isNegative: false,
      targets: [
        { type: "video_editor", weight: 5 },
        { type: "short_video", weight: 4 }
      ]
    },
    {
      id: "Q26",
      axis: "好き嫌い",
      text: "TikTokやInstagramのリール動画をよく見る",
      isNegative: false,
      targets: [
        { type: "short_video", weight: 5 },
        { type: "sns_manager", weight: 3 }
      ]
    },
    {
      id: "Q27",
      axis: "好き嫌い",
      text: "パソコンで細かい作業をコツコツ進めるのが好きだ",
      isNegative: false,
      targets: [
        { type: "programmer", weight: 4 },
        { type: "web_designer", weight: 3 },
        { type: "video_editor", weight: 3 }
      ]
    },
    {
      id: "Q28",
      axis: "好き嫌い",
      text: "地道な作業でも、結果が数字で見えるとモチベーションが上がる",
      isNegative: false,
      targets: [
        { type: "programmer", weight: 3 },
        { type: "sns_manager", weight: 3 },
        { type: "content_sales", weight: 2 }
      ]
    },
    {
      id: "Q29",
      axis: "横断",
      text: "スキマ時間を使って、少しずつでも副業に取り組みたい",
      isNegative: false,
      targets: [
        { type: "ai_writer", weight: 3 },
        { type: "sns_manager", weight: 3 },
        { type: "short_video", weight: 3 }
      ]
    },
    {
      id: "Q30",
      axis: "横断",
      text: "多少大変でも、新しいスキルを学ぶことに前向きだ",
      isNegative: false,
      targets: [
        { type: "programmer", weight: 3 },
        { type: "web_designer", weight: 3 },
        { type: "video_editor", weight: 2 },
        { type: "small_business", weight: 2 }
      ]
    }
  ];

  const PROFILE_QUESTIONS = [
    {
      id: "available_time",
      label: "1日に副業にあてられる時間はどれくらいですか？",
      options: [
        { value: "lt_30m", label: "30分未満" },
        { value: "m30_to_1h", label: "30分〜1時間" },
        { value: "h1_to_2h", label: "1〜2時間" },
        { value: "h2_to_3h", label: "2〜3時間" },
        { value: "gte_3h", label: "3時間以上" }
      ]
    },
    {
      id: "occupation",
      label: "現在の職業を教えてください",
      options: [
        { value: "company_employee", label: "会社員" },
        { value: "civil_servant", label: "公務員" },
        { value: "self_employed", label: "自営業" },
        { value: "homemaker", label: "主婦・主夫" },
        { value: "student", label: "学生" },
        { value: "other", label: "その他" }
      ]
    },
    {
      id: "side_job_experience",
      label: "副業の経験はありますか？",
      options: [
        { value: "none", label: "ない" },
        { value: "little", label: "少しある" },
        { value: "current", label: "現在もやっている" }
      ]
    },
    {
      id: "pc_skill",
      label: "パソコンのスキルは？",
      options: [
        { value: "low", label: "ほぼ使わない" },
        { value: "basic", label: "基本操作程度" },
        { value: "daily", label: "仕事で日常的に使う" },
        { value: "advanced", label: "専門的に使える" }
      ]
    }
  ];

  const ANSWER_SCALE = [
    { key: "strongly_agree", label: "あてはまる" },
    { key: "agree", label: "ややあてはまる" },
    { key: "neutral", label: "わからない" },
    { key: "disagree", label: "あまりあてはまらない" },
    { key: "strongly_disagree", label: "あてはまらない" }
  ];

  window.DIAGNOSIS_DATA = {
    appName: "副業適性診断アプリ",
    questions: QUESTIONS,
    profileQuestions: PROFILE_QUESTIONS,
    answerScale: ANSWER_SCALE,
    priorityTypes: ["ai_writer", "sns_manager", "content_sales", "short_video"],
    types: TYPES,
    typeOrder: [
      "ai_writer",
      "sns_manager",
      "content_sales",
      "small_business",
      "web_designer",
      "video_editor",
      "short_video",
      "programmer"
    ],
    links: {
      lineOfficialUrl: "https://lin.ee/xxxxxxxx",
      googleFormUrl: "https://forms.gle/xxxxxxxx",
      gasEndpoint: "",
      privacyPolicyUrl: "#"
    },
    storageKey: "side_job_diagnosis_temp"
  };
})();
