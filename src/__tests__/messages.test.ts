import { messages, getRandomMessage } from '../constants/messages';

describe('messages', () => {
  describe('emotions', () => {
    it('has emotions for all three statuses', () => {
      expect(messages.emotions.completed).toBeDefined();
      expect(messages.emotions.partial).toBeDefined();
      expect(messages.emotions.postponed).toBeDefined();
    });

    it('each emotion has key, label, and emoji', () => {
      const allEmotions = [
        ...messages.emotions.completed,
        ...messages.emotions.partial,
        ...messages.emotions.postponed,
      ];

      allEmotions.forEach((emotion) => {
        expect(emotion.key).toBeTruthy();
        expect(emotion.label).toBeTruthy();
        expect(emotion.emoji).toBeTruthy();
      });
    });

    it('emotion labels are noun form (no verb endings)', () => {
      const verbEndings = ['해요', '했어요', '없어요', '다행', '그래요'];
      const allEmotions = [
        ...messages.emotions.completed,
        ...messages.emotions.partial,
        ...messages.emotions.postponed,
      ];

      allEmotions.forEach((emotion) => {
        verbEndings.forEach((ending) => {
          expect(emotion.label).not.toContain(ending);
        });
      });
    });

    it('has unique keys within each status', () => {
      (['completed', 'partial', 'postponed'] as const).forEach((status) => {
        const keys = messages.emotions[status].map((e) => e.key);
        expect(new Set(keys).size).toBe(keys.length);
      });
    });
  });

  describe('energyLevels', () => {
    it('has exactly 5 levels', () => {
      expect(messages.energyLevels).toHaveLength(5);
    });

    it('levels are sequential from 1 to 5', () => {
      messages.energyLevels.forEach((item, index) => {
        expect(item.level).toBe(index + 1);
      });
    });

    it('each level has label and emoji', () => {
      messages.energyLevels.forEach((item) => {
        expect(item.label).toBeTruthy();
        expect(item.emoji).toBeTruthy();
      });
    });
  });

  describe('reasons', () => {
    it('has at least one reason option', () => {
      expect(messages.reasons.length).toBeGreaterThan(0);
    });

    it('each reason has key and label', () => {
      messages.reasons.forEach((reason) => {
        expect(reason.key).toBeTruthy();
        expect(reason.label).toBeTruthy();
      });
    });

    it('has unique keys', () => {
      const keys = messages.reasons.map((r) => r.key);
      expect(new Set(keys).size).toBe(keys.length);
    });
  });

  describe('placeholders', () => {
    it('has reasonNote placeholder', () => {
      expect(messages.placeholders.reasonNote).toBeTruthy();
    });
  });

  describe('questions', () => {
    it('has energyLevel question', () => {
      expect(messages.questions.energyLevel).toBeTruthy();
    });
  });

  describe('getRandomMessage', () => {
    it('returns a message from the array', () => {
      const msgs = ['a', 'b', 'c'];
      const result = getRandomMessage(msgs);
      expect(msgs).toContain(result);
    });

    it('returns the only item in a single-item array', () => {
      expect(getRandomMessage(['only'])).toBe('only');
    });
  });
});
