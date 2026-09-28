# AI UI Design Atlas

UI/UX, HTML/CSS, SVG, 디자인 시스템, 접근성, 데이터 시각화, AI-native UI와 재사용 가능한 Agent Skill을 **찾고, 실제 모습을 미리 보고, 코딩 에이전트에 바로 연결하기 위한 오픈 Git 기반 아틀라스**입니다.

## About

**AI UI Design Atlas**는 좋은 인터페이스를 만들 때 필요한 레퍼런스가 GitHub 저장소, 디자인 시스템 문서, 컴포넌트 라이브러리, 접근성 가이드, 시각화 도구, AI UI 프로젝트에 흩어져 있다는 문제에서 시작했습니다.

이 프로젝트는 단순한 링크 모음이 아닙니다. 각 리소스의 **GitHub About 정보, README 핵심 내용, 대표 이미지·스크린샷, 라이선스, 기술 스택, 태그와 사용 맥락**을 한 화면에서 탐색할 수 있게 정리합니다. 상세 보기에서는 upstream README를 실시간으로 읽어 시각 자료와 설명을 보강하고, 필요한 자료를 Codex·Claude Code 등 다양한 코딩 에이전트의 컨텍스트로 연결할 수 있는 프롬프트도 제공합니다.

목표는 세 가지입니다.

- **Discover visually** — 이름만 보고 판단하지 않고 README 이미지와 repository preview를 먼저 확인합니다.
- **Reuse responsibly** — source와 license/provenance를 함께 확인하고, 권리가 불명확한 자료는 link-only로 유지합니다.
- **Work agent-first** — 사람이 탐색한 디자인 지식을 재사용 가능한 Skill과 agent context로 전환합니다.

## Live

GitHub Pages: https://ko9ma7.github.io/ai-ui-design-atlas-github-pages/

## What you can explore

- UI/UX 패턴과 page/component 레퍼런스
- Design System, design token, component library
- HTML/CSS/SVG/icon/illustration 구현 자료
- 접근성, responsive UI, interaction pattern
- Dashboard, table, chart, data visualization
- AI chat, generative UI, tool approval, artifact UI
- Frontend/system architecture와 품질 도구
- Codex·Claude Code 등에서 재사용할 Agent Skill

## Visual preview & README enrichment

GitHub resource 상세 보기를 열면 브라우저에서 해당 공개 저장소의 GitHub API를 읽어 다음 정보를 보강합니다.

- repository description / homepage / topics
- stars / forks / primary language / updated date
- README에서 발견한 대표 screenshot·image
- README의 핵심 설명 문단
- 프로젝트별로 선별한 대표 기능·사용 예시
- upstream / demo 링크

카드에는 GitHub repository Open Graph preview를 사용하고, 상세 화면의 README 이미지는 원본 URL을 직접 참조합니다. 이미지를 이 저장소의 소유물처럼 재배포하지 않으며 제3자 자료의 저작권·라이선스는 각 upstream 프로젝트를 따릅니다.

## 핵심 구조

- **Catalog-first**: 원본을 무작정 복제하지 않고 메타데이터와 provenance를 먼저 관리합니다.
- **Pointer-first**: 라이선스가 불명확한 자료는 link-only로 유지합니다.
- **Vendor-last**: 실제 코드/에셋 vendoring은 라이선스 검토 후에만 합니다.
- **Agent-ready**: `SKILL.md`, `AGENTS.md`, `CLAUDE.md`를 통해 Codex/Claude Code/기타 에이전트에서 같은 원칙을 재사용합니다.
- **Static-first**: GitHub Pages에서 별도 백엔드 없이 동작합니다.
- **README-aware**: GitHub 리소스는 상세 보기에서 upstream README와 시각 자료를 동적으로 보강합니다.

## 현재 데이터

- Research source registry: 79개
- Canonical agent skills: 10개
- Atomic UI/UX patterns: 20개
- 데이터 원본: `data/catalog.json`

> 현재 license 값은 제공된 Deep Research 보고서에서 정규화한 초기 메타데이터입니다. 실제 코드나 에셋을 저장소로 가져오기 전에는 upstream의 현재 LICENSE/NOTICE를 다시 검증해야 합니다.

## 로컬 실행

정적 파일만 사용하므로 아무 HTTP server로 실행할 수 있습니다.

```bash
python -m http.server 8080
```

또는 VS Code Live Server 등을 사용할 수 있습니다.

## 배포

`main`에 push하면 GitHub Pages 소스 설정에 따라 정적 페이지가 갱신됩니다. Actions 기반 Pages를 사용할 경우 `.github/workflows/pages.yml`을 사용합니다.

## 데이터 정책

1. 공식 upstream URL을 우선합니다.
2. 재배포 권한이 불명확하면 코드/SVG/이미지를 복제하지 않습니다.
3. vendored/snippet 자료는 source commit, license, notice, modification 정보를 보존합니다.
4. 브랜드 SVG는 오픈 라이선스와 별개로 trademark 상태를 검토합니다.
5. 외부 Skill/HTML/SVG는 실행 전에 보안 검토합니다.
6. README preview는 탐색 편의를 위한 원본 참조이며 vendoring과 구분합니다.

## License

이 저장소에서 새로 작성한 코드와 문서는 MIT License를 따릅니다. 제3자 자료는 각 upstream license를 따르며 `THIRD_PARTY_NOTICES.md`와 개별 provenance가 우선합니다.
