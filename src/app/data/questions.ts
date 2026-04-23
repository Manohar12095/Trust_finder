export interface QuestionOption {
  text: string;
  emoji: string;
}

export interface Question {
  id: number;
  prompt: string;
  emoji: string;
  optionA: QuestionOption;
  optionB: QuestionOption;
}

export const questions: Question[] = [
  {
    id: 1,
    prompt: "with spicy food",
    emoji: "🌶️",
    optionA: { text: "Loves it", emoji: "🔥" },
    optionB: { text: "Avoids it", emoji: "🚫" },
  },
  {
    id: 2,
    prompt: "in the morning",
    emoji: "🌅",
    optionA: { text: "Early bird", emoji: "☀️" },
    optionB: { text: "Night owl", emoji: "🌙" },
  },
  {
    id: 3,
    prompt: "as a pet lover",
    emoji: "🐾",
    optionA: { text: "Dog person", emoji: "🐕" },
    optionB: { text: "Cat person", emoji: "🐱" },
  },
  {
    id: 4,
    prompt: "on vacation",
    emoji: "✈️",
    optionA: { text: "Beach vibes", emoji: "🏖️" },
    optionB: { text: "Mountain trek", emoji: "⛰️" },
  },
  {
    id: 5,
    prompt: "with drinks",
    emoji: "☕",
    optionA: { text: "Coffee addict", emoji: "☕" },
    optionB: { text: "Tea lover", emoji: "🍵" },
  },
  {
    id: 6,
    prompt: "with food taste",
    emoji: "🍽️",
    optionA: { text: "Sweet tooth", emoji: "🍰" },
    optionB: { text: "Savory fan", emoji: "🧀" },
  },
  {
    id: 7,
    prompt: "on free nights",
    emoji: "🌃",
    optionA: { text: "Movie night", emoji: "🎬" },
    optionB: { text: "Game night", emoji: "🎮" },
  },
  {
    id: 8,
    prompt: "with seasons",
    emoji: "🌤️",
    optionA: { text: "Summer lover", emoji: "☀️" },
    optionB: { text: "Winter lover", emoji: "❄️" },
  },
  {
    id: 9,
    prompt: "with learning",
    emoji: "📖",
    optionA: { text: "Read books", emoji: "📚" },
    optionB: { text: "Listen podcasts", emoji: "🎧" },
  },
  {
    id: 10,
    prompt: "at parties",
    emoji: "🎉",
    optionA: { text: "Introvert", emoji: "🏠" },
    optionB: { text: "Extrovert", emoji: "🎉" },
  },
  {
    id: 11,
    prompt: "with fast food",
    emoji: "🍕",
    optionA: { text: "Pizza forever", emoji: "🍕" },
    optionB: { text: "Burger lover", emoji: "🍔" },
  },
  {
    id: 12,
    prompt: "on social media",
    emoji: "📱",
    optionA: { text: "Instagram", emoji: "📸" },
    optionB: { text: "Twitter/X", emoji: "🐦" },
  },
  {
    id: 13,
    prompt: "while traveling",
    emoji: "🗺️",
    optionA: { text: "Road trip", emoji: "🚗" },
    optionB: { text: "Fly there", emoji: "✈️" },
  },
  {
    id: 14,
    prompt: "with food",
    emoji: "👨‍🍳",
    optionA: { text: "Cook it", emoji: "👨‍🍳" },
    optionB: { text: "Order it", emoji: "📱" },
  },
  {
    id: 15,
    prompt: "in communication",
    emoji: "💬",
    optionA: { text: "Texting", emoji: "💬" },
    optionB: { text: "Calling", emoji: "📞" },
  },
  {
    id: 16,
    prompt: "with movies",
    emoji: "🎥",
    optionA: { text: "Action/Thriller", emoji: "💥" },
    optionB: { text: "Romance/Comedy", emoji: "💕" },
  },
  {
    id: 17,
    prompt: "with fitness",
    emoji: "💪",
    optionA: { text: "Hit the gym", emoji: "🏋️" },
    optionB: { text: "Outdoor sports", emoji: "🏃" },
  },
  {
    id: 18,
    prompt: "with music",
    emoji: "🎵",
    optionA: { text: "Pop/Hip-hop", emoji: "🎵" },
    optionB: { text: "Rock/Indie", emoji: "🎸" },
  },
  {
    id: 19,
    prompt: "for dessert",
    emoji: "🍦",
    optionA: { text: "Ice cream", emoji: "🍦" },
    optionB: { text: "Chocolate", emoji: "🍫" },
  },
  {
    id: 20,
    prompt: "on weekends",
    emoji: "🛋️",
    optionA: { text: "Stay home", emoji: "🛋️" },
    optionB: { text: "Go out", emoji: "🏙️" },
  },
  {
    id: 21,
    prompt: "with shopping",
    emoji: "🛍️",
    optionA: { text: "Online shopping", emoji: "💻" },
    optionB: { text: "In-store shopping", emoji: "🏬" },
  },
  {
    id: 22,
    prompt: "for breakfast",
    emoji: "🥞",
    optionA: { text: "Pancakes", emoji: "🥞" },
    optionB: { text: "Cereal", emoji: "🥣" },
  },
  {
    id: 23,
    prompt: "with weather",
    emoji: "🌧️",
    optionA: { text: "Rainy day lover", emoji: "🌧️" },
    optionB: { text: "Sunny day lover", emoji: "🌞" },
  },
  {
    id: 24,
    prompt: "in a fight",
    emoji: "😤",
    optionA: { text: "Talk it out", emoji: "🗣️" },
    optionB: { text: "Silent treatment", emoji: "🤐" },
  },
  {
    id: 25,
    prompt: "with photos",
    emoji: "📷",
    optionA: { text: "Selfie lover", emoji: "🤳" },
    optionB: { text: "Behind the camera", emoji: "📷" },
  },
  {
    id: 26,
    prompt: "for a snack",
    emoji: "🍿",
    optionA: { text: "Popcorn", emoji: "🍿" },
    optionB: { text: "Chips", emoji: "🥔" },
  },
  {
    id: 27,
    prompt: "with sleeping",
    emoji: "😴",
    optionA: { text: "Sleep early", emoji: "🌙" },
    optionB: { text: "Sleep late", emoji: "🦇" },
  },
  {
    id: 28,
    prompt: "about money",
    emoji: "💰",
    optionA: { text: "Saver", emoji: "🏦" },
    optionB: { text: "Spender", emoji: "💸" },
  },
  {
    id: 29,
    prompt: "on a date",
    emoji: "💝",
    optionA: { text: "Fancy dinner", emoji: "🍷" },
    optionB: { text: "Casual hangout", emoji: "🧋" },
  },
  {
    id: 30,
    prompt: "with surprises",
    emoji: "🎁",
    optionA: { text: "Love surprises", emoji: "🎉" },
    optionB: { text: "Hate surprises", emoji: "😰" },
  },
];

export function getRandomQuestions(count: number = 10): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
