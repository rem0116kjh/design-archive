# L — 입체 유리 디자인 포트폴리오

후배들을 위해 제작한 디자인 포트폴리오입니다. 다양한 디자인과 코드를 참고하고, 자신의 이야기로 바꿔 사용할 수 있도록 준비했습니다.

[MAKERVIL 영문 홈페이지](https://www.makervil.com/en)의 실제 홈페이지 구조·반응형 스타일·WebGL 렌더러·스크롤 연출을 기반으로, 내용과 아이덴티티를 개인 포트폴리오로 바꾼 HTML 템플릿입니다. 이전 `M/` 폴더는 `L/`로 변경했습니다. 최상위 갤러리의 카드·상단 바로가기·추천 영역에서 `L/index.html`로 연결됩니다.

## 실행

`index.html`을 열거나 L 폴더 전체를 정적 호스팅에 올리세요. 열람에 npm 설치나 빌드가 필요하지 않습니다. 실행용 스크립트·폰트·이미지는 모두 로컬에 포함되어 있으며 외부 CDN을 호출하지 않습니다. 실제 유리 조형물에는 WebGL 지원이 필요합니다.

개발 미리보기는 저장소 최상위에서 `python3 -m http.server 8768 --bind localhost` 실행 후, 해당 로컬 서버에서 `L/index.html`을 열면 됩니다. 검증은 HTTP 환경에서 했으며, 브라우저 도구의 프로토콜 제한으로 파일 직접 실행은 검사하지 않았습니다.

## 구성

- 원본 크기·타이포그래피·여백·배경·헤더·반응형 규칙.
- 회전하는 로딩 큐브, 숫자 카운터, 등장 애니메이션.
- Three.js r183의 실제 입체 L: 유리 투과·굴절·반사·베벨·마우스 반응·자동 회전.
- 스크롤에 따라 등장하는 글자와 숫자, 휘어지는 프로젝트 이미지.
- 서비스 구역의 sticky 배치와 순차 이미지 전환, 기록 hover 미리보기.
- 연락처 배경·심벌 parallax, 하단 유리 L 조형물과 입체 글자 등장.
- 영어·한국어·중국어 정적 페이지, 라이트·다크 테마, 모바일 전체 화면 메뉴.
- ATLAS·FORM·SIGNAL 사례와 기록을 여는 상세 창. Escape 닫기와 포커스 복원.

L, ATLAS·FORM·SIGNAL과 작업 설명은 개인 콘셉트 예시이며 실제 경력이나 수상 이력을 주장하지 않습니다. `hello@example.com`을 본인 이메일로 바꾼 후 사용하세요. 이메일 링크는 메일 앱을 엽니다.

## 수정 위치

- `index.html` / `ko.html` / `zh.html`: 각 언어의 소개·프로젝트·작업 방식·기록·연락처.
- `<template id="portfolio-atlas">` 등: 프로젝트 상세 내용.
- `<script id="portfolio-notes" type="application/json">`: 기록 상세 내용.
- `assets/atlas.svg`, `form.svg`, `signal.svg`: 예시 프로젝트 이미지. WebGL 카드의 HTML에는 같은 이미지를 data URL로 포함했습니다. 이미지를 교체하면 카드·기록 preview의 data URL과 상세 이미지도 함께 바꾸세요.
- `portfolio.css` / `portfolio.js`: 상세 창과 포트폴리오 전용 동작.
- `assets/dist/reference.css`: 원본 반응형 규칙. 자산 URL만 로컬 상대 경로로 변경했습니다.
- `assets/dist/site-cursor.js`, `home-intro.js`, `contact-motion.js`, `chunks/`: 렌더러·모션의 읽을 수 있는 소스.
- `assets/dist/portfolio-runtime.js`: 실제 실행되는 일반 스크립트 번들.

실행 번들은 esbuild 0.25.12로 생성했습니다. 소스를 수정할 경우 저장소 최상위에서 다음과 같이 다시 만들 수 있습니다. 빌드는 템플릿 수정자에게만 필요한 선택 사항입니다.

```sh
npm exec --yes --package=esbuild@0.25.12 -- esbuild L/assets/dist/entry.js --bundle --format=iife --platform=browser --target=es2022 --minify --legal-comments=linked --define:import.meta.url=document.baseURI --define:import.meta.resolve=undefined --outfile=L/assets/dist/portfolio-runtime.js
```

테마는 브라우저의 `l-portfolio:site-theme`에 저장됩니다. 분석·추적 스크립트와 원본 서버의 폼·라우터는 포함하지 않았습니다. 소셜 링크는 포트폴리오 소유자의 GitHub로 연결됩니다.

## 출처와 검증

- 원본 디자인·홈페이지 모션·서비스 이미지: [MAKERVIL](https://www.makervil.com/en). 원본 자산의 권리는 각 권리자에게 있습니다.
- 참고한 공개 파일 목록과 로컬 해시: `assets/reference/source-manifest.json`.
- Three.js·Lenis: MIT. SplitType: ISC. Nacelle·Pretendard: SIL OFL. 관련 고지는 `assets/licenses/`에 포함했습니다.
- Nacelle 출처: [Sora Sagano / Dot Colon](https://dotcolon.net/fonts/nacelle/). 하단 CREATIVE 글자는 Nacelle 윤곽선으로 생성했습니다.
- [원본 구현 분석](REFERENCE_ANALYSIS.md), [브라우저 확인 기록](VERIFICATION.md), `preview/`의 실제 캡처를 참고하세요.
