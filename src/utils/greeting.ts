interface Greeting {
  text: string;
  emoji: string;
}

export const getGreeting = (): Greeting => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour <= 11) {
    return { text: '좋은 아침이에요', emoji: '🌅' };
  }
  if (hour >= 12 && hour <= 17) {
    return { text: '오늘도 수고하고 있어요', emoji: '☀️' };
  }
  if (hour >= 18 && hour <= 22) {
    return { text: '고요한 저녁이에요', emoji: '🌙' };
  }
  return { text: '아직 깨어 있군요', emoji: '🌌' };
};
