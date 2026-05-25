# emotodo 배포 체크리스트

> iOS 우선 출시 기준. 마지막 갱신: 2026-05-25

## ✅ 완료된 항목 (코드/설정)

- [x] EAS 프로젝트 설정 (`projectId` 등록)
- [x] iOS Bundle ID `com.nwewave.emotodo` / Android package 설정
- [x] iOS 제출 정보 입력 (`ascAppId: 6760214708`, `appleTeamId`, `appleId`)
- [x] 암호화 면제 선언 (`ITSAppUsesNonExemptEncryption: false`)
- [x] 빌드번호 관리 `appVersionSource: remote` 전환 (EAS 자동 증가)
- [x] 앱 아이콘/스플래시/adaptive-icon 1024×1024 정상
- [x] 테스트 통과(119개), TypeScript 에러 없음, console.log 없음
- [x] 개인정보 처리방침 작성 (`docs/privacy.html`)
- [x] 개인정보 처리방침 호스팅: https://nwewave32.github.io/emotodo/privacy.html

## 📝 App Store Connect 콘솔 작업

- [ ] 개인정보 처리방침 URL 입력 → `https://nwewave32.github.io/emotodo/privacy.html`
- [ ] App Privacy 설문 (로컬 AsyncStorage만 사용 → "데이터 수집 안 함" 검토)
- [ ] 앱 이름 / 부제 / 설명 / 키워드
- [ ] 스크린샷 (6.7" / 6.5") — iPad는 `supportsTablet: false`이므로 불필요
- [ ] 앱 카테고리 선택
- [ ] 연령 등급 설문
- [ ] 지원 URL / 마케팅 URL (선택)

## 🚀 빌드 & 제출

- [ ] 프로덕션 빌드
  ```bash
  eas build --platform ios --profile production
  ```
- [ ] 첫 빌드 로그에서 EAS 빌드번호가 ASC 기존 빌드와 충돌 없는지 확인
- [ ] TestFlight 내부 테스트 (선택)
- [ ] 스토어 제출
  ```bash
  eas submit --platform ios --profile production
  ```
- [ ] 심사 제출 및 결과 확인

## 🔜 향후 (Android 출시 시)

- [ ] `eas.json` `submit.production`에 Android 서비스 계정 키 설정 추가
- [ ] Android `versionCode` 관리 (remote 전환됨 → EAS 자동 관리)
- [ ] Google Play Console: 스토어 등록정보, 스크린샷, 기능 그래픽
- [ ] 데이터 보안 양식, 콘텐츠 등급 설문
- [ ] 타겟 API 레벨 요건 확인
