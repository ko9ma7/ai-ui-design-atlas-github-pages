# AI UI Design Atlas

UI/UX, HTML/CSS, SVG, 디자인 시스템, 접근성, 데이터 시각화, AI-native UI와 재사용 가능한 Agent Skill을 한곳에서 찾기 위한 **Git 기반 Resource Vault**입니다.

## Live

GitHub Pages: https://ko9ma7.github.io/ai-ui-design-atlas-github-pages/

## 핵심 구조

- **Catalog-first**: 원본을 무작정 복제하지 않고 메타데이터와 provenance를 먼저 관리합니다.
- **Pointer-first**: 라이선스가 불명확한 자료는 link-only로 유지합니다.
- **Vendor-last**: 실제 코드/에셋 vendoring은 라이선스 검토 후에만 합니다.
- **Agent-ready**: `SKILL.md`, `AGENTS.md`, `CLAUDE.md`를 통해 Codex/Claude Code/기타 에이전트에서 같은 원칙을 재사용합니다.
- **Static-first**: GitHub Pages에서 별도 백엔드 없이 동작합니다.

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

## License

이 저장소에서 새로 작성한 코드와 문서는 MIT License를 따릅니다. 제3자 자료는 각 upstream license를 따르며 `THIRD_PARTY_NOTICES.md`와 개별 provenance가 우선합니다.
