// UX 원칙: 판단하지 않고, 기록 자체를 칭찬

export const messages = {
  // 완료 시 메시지
  completionMessages: [
    '수고했어요!',
    '해냈네요!',
    '잘했어요!',
    '멋져요!',
  ],

  // 미룸 시 메시지 (판단하지 않음)
  postponedMessages: [
    '괜찮아요, 기록한 것만으로도 충분해요.',
    '오늘은 그럴 수 있어요.',
    '기록해주셔서 고마워요.',
  ],

  // 부분완료 시 메시지
  partialMessages: [
    '조금이라도 한 게 대단해요!',
    '시작한 것만으로도 충분해요.',
    '작은 한 걸음이에요!',
  ],

  // 감정 선택지 (명사형 태그)
  emotions: {
    completed: [
      { key: 'happy', label: '뿌듯함', emoji: '😊' },
      { key: 'relief', label: '후련함', emoji: '😌' },
      { key: 'tired', label: '피로', emoji: '😮‍💨' },
      { key: 'proud', label: '자부심', emoji: '🥹' },
      { key: 'neutral', label: '무난함', emoji: '😐' },
    ],
    postponed: [
      { key: 'tired', label: '피로', emoji: '😴' },
      { key: 'anxious', label: '무거움', emoji: '😔' },
      { key: 'okay', label: '무난함', emoji: '🙂' },
      { key: 'busy', label: '분주함', emoji: '🏃' },
      { key: 'neutral', label: '무감정', emoji: '😶' },
    ],
    partial: [
      { key: 'proud', label: '성취감', emoji: '💪' },
      { key: 'relief', label: '안도감', emoji: '😌' },
      { key: 'frustrated', label: '아쉬움', emoji: '😤' },
      { key: 'tired', label: '피로', emoji: '😮‍💨' },
      { key: 'neutral', label: '무난함', emoji: '😐' },
    ],
  },

  // 이유 선택지 (미완료 시) - "왜 그랬을까요?"
  reasons: [
    { key: 'tired', label: '너무 피곤했어요' },
    { key: 'time', label: '시간이 부족했어요' },
    { key: 'forgot', label: '깜빡했어요' },
    { key: 'mood', label: '기분이 안 났어요' },
    { key: 'hard', label: '어렵게 느껴졌어요' },
    { key: 'other', label: '다른 일이 생겼어요' },
  ],

  // 플레이스홀더
  placeholders: {
    taskTitle: '무엇을 하고 싶으세요?',
    note: '하고 싶은 말이 있다면 적어주세요 (선택)',
    reasonNote: '조금 더 자세히 적어볼까요? (선택)',
  },

  // 버튼
  buttons: {
    complete: '완료',
    postponed: '미룸',
    partial: '부분완료',
    save: '저장',
    cancel: '취소',
    start: '시작',
    pause: '일시정지',
    resume: '계속',
    stop: '그만하기',
    done: '완료',
  },

  // 타이머
  timer: {
    encouragement: [
      '할 수 있어요!',
      '조금만 더!',
      '잘하고 있어요!',
    ],
    completed: '목표 시간을 채웠어요!',
  },

  // 질문
  questions: {
    howDoYouFeel: '지금 기분이 어때요?',
    whyNotComplete: '왜 그랬을까요?',
    anyThoughts: '하고 싶은 말이 있나요?',
    energyLevel: '오늘 에너지 레벨은?',
  },

  // 에너지 레벨
  energyLevels: [
    { level: 1, label: '바닥', emoji: '🪫' },
    { level: 2, label: '낮음', emoji: '😴' },
    { level: 3, label: '보통', emoji: '🙂' },
    { level: 4, label: '좋음', emoji: '😄' },
    { level: 5, label: '최고', emoji: '⚡' },
  ],
};

export const wizard = {
  statusQuestion: '어떻게 됐나요?',
  emotionQuestion: '지금 기분이 어때요?',
  energyQuestion: '오늘 에너지는 어때요?',
  noteQuestion: '하고 싶은 말이 있나요?',
};

export const progressMessages = {
  allDone: '오늘도 수고했어요!',
  format: (done: number, total: number) => `${total}개 중 ${done}개 완료`,
  emptyState: '오늘은 조용한 밤이에요',
};

export const getRandomMessage = (messages: string[]): string => {
  return messages[Math.floor(Math.random() * messages.length)];
};
