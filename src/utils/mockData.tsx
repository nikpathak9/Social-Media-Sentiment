import type { Comment } from "../types";

const MOCK_USERS = [
  "UserAlpha",
  "BetaTester",
  "CommenterGamma",
  "TechGuru",
  "SocialStar",
  "NewsBot",
  "RandomUser123",
];

const MOCK_COMMENTS_POSITIVE = [
  "This is absolutely amazing! Love it ❤️",
  "Great work, very insightful and helpful 👍",
  "Fantastic feature, so useful for my workflow!",
  "Absolutely brilliant, exceeded my expectations.",
  "I'm so happy with this product, it's a game changer.",
  "Highly recommend this to everyone. Wonderful!",
  "Excellent! The new update is fantastic. 🎉",
];

const MOCK_COMMENTS_NEGATIVE = [
  "This is terrible, I really hate it 😠",
  "Doesn't work as expected, very buggy.",
  "Very disappointing experience, needs a lot of fixes.",
  "I'm frustrated with this, it's unusable.",
  "Needs a lot of improvement, not worth the time.",
  "The worst app I've used this year. 👎",
  "Crashed multiple times. Unreliable.",
];

const MOCK_COMMENTS_NEUTRAL = [
  "Interesting perspective on the matter.",
  "Okay, I see the point being made here.",
  "This is a standard feature, nothing new.",
  "Not bad, not great either. It's average.",
  "The update is now live for all users.",
  "I'll need more time to evaluate this properly.",
  "The documentation could be clearer.",
];

const ALL_MOCK_COMMENTS = [
  ...MOCK_COMMENTS_POSITIVE,
  ...MOCK_COMMENTS_NEGATIVE,
  ...MOCK_COMMENTS_NEUTRAL,
];

export const AVAILABLE_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "😠", "🎉"];

const TRENDING_WORDS_POOL = [
  "amazing",
  "fantastic",
  "terrible",
  "awesome",
  "love",
  "hate",
  "great",
  "bad",
  "excellent",
  "horrible",
  "update",
  "feature",
  "bug",
  "fix",
  "issue",
  "problem",
  "solution",
  "improvement",
  "enhancement",
  "fast",
  "slow",
  "easy",
  "difficult",
  "simple",
  "complex",
  "useful",
  "useless",
  "helpful",
  "confusing",
  "design",
  "interface",
  "experience",
  "workflow",
  "performance",
  "speed",
  "quality",
  "reliability",
  "mobile",
  "desktop",
  "app",
  "website",
  "platform",
  "service",
  "product",
  "tool",
  "software",
  "recommend",
  "suggest",
  "avoid",
  "try",
  "test",
  "demo",
  "review",
  "feedback",
  "opinion",
  "thoughts",
];

let commentIdCounter = 0;

export const generateMockComment = (): Comment => {
  const shouldUseTrendingWords = Math.random() > 0.3;
  let randomText;

  if (shouldUseTrendingWords) {
    const baseText =
      ALL_MOCK_COMMENTS[Math.floor(Math.random() * ALL_MOCK_COMMENTS.length)];
    const trendingWord =
      TRENDING_WORDS_POOL[
        Math.floor(Math.random() * TRENDING_WORDS_POOL.length)
      ];
    const variations = [
      `${baseText} The ${trendingWord} is remarkable.`,
      `This ${trendingWord} feature ${baseText.toLowerCase()}`,
      `${baseText} Really ${trendingWord} overall.`,
      `The new ${trendingWord} update: ${baseText.toLowerCase()}`,
      `${trendingWord} experience! ${baseText}`,
    ];
    randomText = variations[Math.floor(Math.random() * variations.length)];
  } else {
    randomText =
      ALL_MOCK_COMMENTS[Math.floor(Math.random() * ALL_MOCK_COMMENTS.length)];
  }

  let sentiment: "positive" | "neutral" | "negative";
  if (
    MOCK_COMMENTS_POSITIVE.some((comment) => randomText.includes(comment)) ||
    randomText.includes("amazing") ||
    randomText.includes("fantastic") ||
    randomText.includes("love") ||
    randomText.includes("great") ||
    randomText.includes("excellent") ||
    randomText.includes("awesome")
  ) {
    sentiment = "positive";
  } else if (
    MOCK_COMMENTS_NEGATIVE.some((comment) => randomText.includes(comment)) ||
    randomText.includes("terrible") ||
    randomText.includes("hate") ||
    randomText.includes("bad") ||
    randomText.includes("horrible") ||
    randomText.includes("awful")
  ) {
    sentiment = "negative";
  } else {
    sentiment = "neutral";
  }

  const numReactions = Math.floor(Math.random() * 5);
  const reactions: string[] = [];
  const shuffledReactions = [...AVAILABLE_REACTIONS].sort(
    () => 0.5 - Math.random()
  );
  for (let i = 0; i < numReactions; i++) {
    reactions.push(shuffledReactions[i]);
  }

  return {
    id: `comment-${commentIdCounter++}`,
    text: randomText,
    timestamp: new Date(
      Date.now() -
        Math.floor(Math.random() * Math.random() * 1000 * 60 * 60 * 24 * 7)
    ),
    sentiment,
    reactions,
    user: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)],
  };
};
