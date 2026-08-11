# AI UI Design Atlas — 128 UI Styles

> 같은 AI 일정 관리 대시보드를 **128가지 UI 디자인 스타일**로 비교하는 정적 레퍼런스 사이트입니다.

“깔끔하게”, “세련되게”, “요즘 스타일로”처럼 추상적으로 요청하는 대신, **정확한 디자인 언어의 이름과 핵심 문법**을 AI 프롬프트에 넣을 수 있도록 만들었습니다.

## Live demo

GitHub Pages를 활성화하면 아래 형식으로 공개됩니다.

`https://YOUR_GITHUB_ID.github.io/YOUR_REPOSITORY/`

## 주요 기능

- 128가지 UI 스타일 / 16개 카테고리
- 모든 스타일을 **동일한 AI 일정 관리 대시보드**로 비교
- 스타일명·키워드·추천 분야 검색
- 카테고리 필터 / 정렬
- 즐겨찾기(LocalStorage)
- 최대 4개 스타일 나란히 비교
- 스타일별 AI 디자인 프롬프트 복사
- 특정 스타일 URL 공유(`#style-...`)
- 반응형 모바일 레이아웃
- 빌드 도구와 외부 라이브러리 없이 `index.html` 단독 실행

## GitHub Pages 배포

1. 이 폴더의 파일을 GitHub 저장소 루트에 업로드합니다.
2. GitHub 저장소에서 **Settings → Pages**로 이동합니다.
3. **Build and deployment → Source**를 `Deploy from a branch`로 선택합니다.
4. Branch를 `main`, Folder를 `/(root)`로 지정하고 저장합니다.
5. 잠시 후 표시되는 GitHub Pages 주소를 열면 됩니다.

## 저장소 설명 문구

> 같은 AI 대시보드로 비교하는 128가지 UI 디자인 스타일 레퍼런스 — 검색, 필터, 비교, AI 프롬프트 복사 지원.

## GitHub Pages 소개 문구

> “깔끔하게” 대신 정확한 디자인 언어를 선택하세요. 미니멀리즘부터 글래스모피즘, 브루탈리즘, Y2K, 사이버펑크, 에디토리얼까지 128가지 스타일을 같은 화면으로 비교할 수 있습니다.

## 공유용 문구

> AI에게 UI를 부탁할 때 ‘세련되게’만 말하면 결과가 비슷해집니다. 128가지 디자인 스타일을 같은 대시보드로 비교하고, 마음에 드는 스타일의 프롬프트를 바로 복사해보세요.

## 추천 GitHub Topics

`ui-design` `design-system` `ui-inspiration` `frontend` `css` `github-pages` `ai-prompts` `design-reference`

## 구조

```text
.
├── index.html   # 전체 사이트(HTML + CSS + JS + 128 스타일 데이터)
├── README.md    # 프로젝트 소개 / 배포 방법 / 공유 문구
├── LICENSE      # MIT License
└── .nojekyll    # GitHub Pages에서 Jekyll 처리 방지
```

## 커스터마이징

`index.html`의 `styles` 배열은 스타일 데이터, CSS의 `.fx-*` / `.layout-*` 클래스는 시각 효과와 레이아웃 계열을 담당합니다. 새로운 스타일을 추가하려면 기존 스타일 객체를 복제한 뒤 이름, 카테고리, 색상, `fx`, `layout`, 프롬프트를 수정하면 됩니다.

## License

MIT
