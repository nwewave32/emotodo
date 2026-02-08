# emotodo

감정과 함께 기록하는 투두 앱. 할 일을 완료/부분완료/미루기로 기록하면서 그때의 감정과 에너지 레벨을 함께 남길 수 있습니다.

## 기술 스택

- **Runtime**: Expo SDK 54, React Native 0.81, React 19
- **Language**: TypeScript 5.9
- **State**: Zustand 5
- **Storage**: AsyncStorage
- **Navigation**: React Navigation 7 (Bottom Tabs + Native Stack)
- **Date**: date-fns 4
- **Test**: Jest 30, ts-jest

## 화면 구성

| 탭/화면 | 파일 | 설명 |
|---------|------|------|
| 오늘 (Home) | `HomeScreen.tsx` | 오늘 할 일 목록, 퀵 기록, 타이머 시작 |
| 기록 (History) | `HistoryScreen.tsx` | 달력 + 날짜별 기록 조회, 전체 기록 리스트 |
| 할 일 추가 | `AddTaskScreen.tsx` | 제목, 예상 시간, 반복 요일, 난이도, 예약 날짜 |
| 타이머 | `TimerScreen.tsx` | 카운트다운 타이머 |
| 기록하기 | `RecordScreen.tsx` | 상태 선택, 감정 태그, 에너지 레벨, 메모 |

## 프로젝트 구조

```
src/
  components/     # 재사용 UI 컴포넌트 (Calendar, TaskCard, EmotionPicker 등)
  constants/      # 색상, 난이도, 메시지 상수
  navigation/     # React Navigation 설정
  screens/        # 화면 컴포넌트
  store/          # Zustand 스토어 (taskStore, recordStore)
  types/          # TypeScript 타입 정의
  utils/          # 유틸리티 (date, storage)
  __tests__/      # 단위 테스트
```

## 실행

```bash
npm install
npx expo start
```

## 테스트

```bash
npm test
```

## 주요 타입

- **Task**: 할 일 (제목, 예상 시간, 반복 요일, 난이도, 예약 날짜)
- **DailyRecord**: 일일 기록 (상태, 감정, 에너지, 사유, 메모, 타이머 정보)
- **TaskStatus**: `completed` | `partial` | `postponed`
- **Difficulty**: `easy` | `normal` | `hard`
