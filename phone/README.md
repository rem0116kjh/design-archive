# phone — Jin-hyung Kim

김진형의 프로젝트, 대회·자격과 활동 기록을 아이폰 홈 화면으로 연결한 개인 포트폴리오입니다. 검은 배경·고정 내비게이션·아이폰 프레임·모바일 접힘 동작은 junho.io를 참고한 기존 디자인을 유지했습니다.

`index.html`을 열어 시작하세요. 화면에 필요한 폰트·이미지·스크립트를 포함했습니다. 외부 저장소·스토어·Velog·이메일을 열 때는 인터넷 또는 해당 앱이 필요합니다.

## 연결된 내용

- 이름: **Jin-hyung Kim / 김진형**.
- GitHub: https://github.com/rem0116kjh
- Velog: https://velog.io/@luka0116kjh/posts
- 이메일: kjh08116@naver.com
- 프로젝트 11개: GHAS 알리미, SufficePatch, KTspace, Mapon, GCPT, lhLinux, Love Consult, QNote, FabGuard AI, Hrr, Design Archive.
- 대회·자격 12개, 활동 17개: 기존 포트폴리오의 분류·날짜·성과·상태를 보존했습니다.
- Velog 공개 RSS에서 확인한 실제 글 6개. 제목을 누르면 원문으로 이동합니다.
- 공개 GitHub 저장소 34개. 이름 검색과 실제 저장소 링크를 제공합니다.

ReadAI와 관련 프로젝트·저장소 링크는 사용자 요청으로 제외했습니다. 공개 링크가 없는 작업은 소개만 표시합니다. 비공개 저장소 주소나 서비스 내부 정보는 넣지 않았습니다. 기존 제작자의 프로젝트·투자 내역·글은 표시하지 않습니다.

## 아이폰 사용

- 앱 아이콘 15개는 해당 프로젝트·대회·활동·블로그·GitHub 섹션으로 이동합니다.
- GHAS 알리미는 실제 앱 아이콘을 사용합니다. GitHub 앱과 Dock에는 실제 GitHub 로고를 사용합니다.
- Dock의 Contact는 연락 패널, Email은 메일 앱, Blog는 글 목록, GitHub는 공개 프로필을 엽니다.
- 작은 화면에서 본문을 클릭하면 아이폰이 접히고, 아이폰을 클릭하면 다시 펼쳐집니다.
- 아이콘은 Enter·Space로 조작할 수 있고, Escape로 연락 패널을 닫습니다.
- 시스템 동작 줄이기 설정을 반영합니다.

## 파일

```text
index.html                  소개·프로젝트·대회·활동·아이폰
blog/index.html             실제 Velog 글 목록
records/index.html          대회·자격·활동 전체
style.css                   개인화 화면과 인터랙션 상태
script.js                   아이폰·검색·날짜 동작
content.json                반영한 개인 프로필·프로젝트·기록 목록
public-repositories.json    연결한 공개 저장소 목록
assets/personal/            실제 앱 아이콘·GitHub 아바타·프로젝트 그래픽
preview/                    현재 화면 캡처
SOURCES.md                  콘텐츠·디자인·에셋 출처
QA.md                       검증 결과
```

이름·소개·프로젝트를 바꿀 때는 HTML을 수정합니다. 앱의 `data-project`와 대상 섹션의 `id`를 맞추세요. `content.json`은 이번 반영 내용을 정리한 기록이며 자동으로 HTML을 바꾸지는 않습니다. 블로그와 저장소 목록은 2026-10-21 기준으로 반영했고 이후 변경을 자동 수집하지 않습니다.

이전 `backed/`와 `w/` 경로는 개인화된 Records·Blog 화면으로 이동합니다. 이 결과는 로컬 포트폴리오와 아카이브용 ZIP이며 공개 배포·커밋·푸시는 포함하지 않습니다.
