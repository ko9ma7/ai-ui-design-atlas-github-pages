const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const saved=(k,fallback)=>localStorage.getItem(k)||fallback;
const state={
  items:[],query:"",kind:"",category:"",license:"",favoritesOnly:false,sort:"relevance",tag:"",style:saved("atlas:style","atlas"),
  view:saved("atlas:view","grid"),density:saved("atlas:density","compact"),columns:saved("atlas:columns","auto"),preview:saved("atlas:preview","on"),
  favorites:new Set(JSON.parse(localStorage.getItem("atlas:favorites")||"[]")),compare:new Set()
};
const ghCache=new Map();
const stylePresets=[
  {id:"atlas",label:"Atlas",desc:"현재 기본 디자인 · 균형 잡힌 카탈로그",colors:["#f7f8fc","#ffffff","#6757ff","#101522"]},
  {id:"glass",label:"Glass",desc:"반투명 레이어와 부드러운 빛",colors:["#eef2ff","#d9d2ff","#6d5dfc","#171528"]},
  {id:"y2k",label:"Y2K",desc:"버블 형태와 핑크·시안 포인트",colors:["#f8f1ff","#f6dcff","#ff4fd8","#231737"]},
  {id:"brutal",label:"Brutal",desc:"굵은 선·강한 대비·하드 섀도",colors:["#fffdf2","#ffe600","#5b34ff","#090909"]},
  {id:"minimal",label:"Minimal",desc:"최소 장식과 높은 정보 집중도",colors:["#fafafa","#f4f4f4","#111111","#111111"]},
  {id:"neo",label:"Neo",desc:"제품형 블루·민트 인터페이스",colors:["#eef6ff","#dcecff","#1668dc","#10233f"]},
  {id:"bauhaus",label:"Bauhaus",desc:"기하학과 원색 기반의 구조적 표현",colors:["#f7f4ec","#f4d93f","#e43d30","#111111"]},
  {id:"clay",label:"Clay",desc:"두꺼운 곡면과 따뜻한 소프트 섀도",colors:["#f6eee8","#f3e1d6","#e56f63","#402f2b"]},
  {id:"editorial",label:"Editorial",desc:"세리프 타이포와 잡지형 위계",colors:["#f7f4ee","#eeeae1","#8c2f39","#1b1b18"]},
  {id:"cyber",label:"Cyber",desc:"네온 그린·모노스페이스·그리드",colors:["#050709","#111923","#64ff8f","#e7fff4"]},
  {id:"pastel",label:"Pastel",desc:"라벤더·민트·핑크의 부드러운 팔레트",colors:["#f9f4ff","#f0e8ff","#9a74e8","#332941"]},
  {id:"blueprint",label:"Blueprint",desc:"청사진 그리드와 기술 문서 감성",colors:["#0a2a48","#114267","#6dd5ff","#f0f9ff"]},
  {id:"luxe",label:"Luxe",desc:"딥 브라운·골드의 프리미엄 톤",colors:["#11100f","#231f1a","#d4ad67","#f4ead8"]},
  {id:"swiss",label:"Swiss",desc:"정렬·타이포 중심의 모던 그리드",colors:["#f5f5f3","#efefec","#e32620","#111111"]},
  {id:"soft-ui",label:"Soft UI",desc:"뉴모피즘 기반의 볼륨감 있는 표면",colors:["#e9eef6","#e1e7f0","#6479e8","#263348"]},
  {id:"retro",label:"Retro",desc:"크림·오렌지·틸의 빈티지 인쇄 감성",colors:["#f4e7c3","#e9d6a6","#d95d39","#2a2a1f"]},
  {id:"mono",label:"Mono",desc:"흑백 대비와 모노스페이스 정보성",colors:["#ffffff","#f1f1f1","#000000","#000000"]},
  {id:"gradient",label:"Gradient",desc:"보라·핑크·시안 그라디언트",colors:["#f7f4ff","#eef6ff","#7c3aed","#211737"]},
  {id:"paper",label:"Paper",desc:"따뜻한 종이 질감과 문서형 분위기",colors:["#f4efe3","#efe6d2","#8a5a32","#312d25"]}
];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s??"").toLowerCase();
const safeUrl=u=>{try{const x=new URL(u,location.href);return /^https?:$/.test(x.protocol)?x.href:""}catch{return""}};
const curated={
  "nextlevelbuilder-ui-ux-pro-max-skill":{about:"AI 코딩 에이전트가 제품 유형에 맞는 UI 스타일, 색상, 타이포그래피, 레이아웃과 UX 규칙을 선택하도록 돕는 디자인 인텔리전스 Skill입니다.",examples:["Design System Generator","UI style recommendations","Color & typography pairing","UX anti-pattern / pre-delivery checklist"]},
  "copilotkit-opengenerativeui":{about:"에이전트가 생성한 HTML/SVG를 인터랙티브 UI로 렌더링하고 Generative UI 패턴을 실험할 수 있는 CopilotKit 계열 레퍼런스입니다.",examples:["Interactive HTML/SVG widget","Generative UI playground","Agent output → UI rendering","Sandboxed visualizations"]},
  "nexu-io-open-design":{about:"로컬 우선 디자인 워크스페이스로, composable skills와 DESIGN.md 기반 디자인 시스템을 사용해 프로토타입·대시보드·슬라이드·이미지 등을 실제 파일로 생성합니다.",examples:["Brief → direction → design system → artifact","Composable design skills","HTML/PDF/PPTX/MP4 handoff","Local-first preview workflow"]},
  "donnemartin-system-design-primer":{about:"대규모 시스템 설계 개념과 트레이드오프, 인터뷰 문제, 샘플 솔루션과 다이어그램을 체계적으로 모은 학습 레퍼런스입니다.",examples:["Scalability / availability trade-offs","System design diagrams","Interview problem solutions","Architecture study guide"]},
  "designsystemlab-design-system":{about:"React에서 재사용 가능한 UI 컴포넌트를 제공하는 J Design System입니다. Compound Component, 접근성 역할, Storybook, Emotion, 키보드 인터랙션을 주요 축으로 삼습니다.",examples:["Button / Modal / Tabs / Tooltip","Compound Component API","Keyboard & accessibility behavior","Storybook component reference"]}
};
function applyTheme(v){const root=document.documentElement;const theme=v==="system"?(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"):v;root.dataset.theme=theme;localStorage.setItem("atlas:theme",v)}
function cycleTheme(){const v=localStorage.getItem("atlas:theme")||"system";applyTheme(v==="system"?"dark":v==="dark"?"light":"system")}
function renderStylePresets(){
  const host=$("#stylePresetGrid");if(!host)return;
  host.innerHTML=stylePresets.map(s=>'<button type="button" class="style-option '+(state.style===s.id?"active":"")+'" data-style-preset="'+s.id+'" aria-pressed="'+(state.style===s.id?"true":"false")+'" style="--p1:'+s.colors[0]+';--p2:'+s.colors[1]+';--p3:'+s.colors[2]+';--p4:'+s.colors[3]+'"><span class="style-swatch" aria-hidden="true"></span><span><strong>'+s.label+'</strong><small>'+s.desc+'</small></span></button>').join("");
}
function applyStyle(id){
  const preset=stylePresets.find(s=>s.id===id)||stylePresets[0];
  state.style=preset.id;
  document.documentElement.dataset.style=preset.id;
  localStorage.setItem("atlas:style",preset.id);
  const label=$("#styleLabel");if(label)label.textContent=preset.label;
  renderStylePresets();
}
function applyDisplay(){
  const root=document.documentElement;
  root.dataset.view=state.view;root.dataset.density=state.density;root.dataset.columns=state.columns;root.dataset.preview=state.preview;
  localStorage.setItem("atlas:view",state.view);localStorage.setItem("atlas:density",state.density);localStorage.setItem("atlas:columns",state.columns);localStorage.setItem("atlas:preview",state.preview);
  $$("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===state.view));
  $("#columnSelect").value=state.columns;$("#densitySelect").value=state.density;
  $("#previewToggle").classList.toggle("active",state.preview==="on");$("#previewToggle").setAttribute("aria-pressed",state.preview==="on"?"true":"false");
}
function itemText(i){return [i.name,i.title,i.summary,i.category,i.license,i.note,...(i.tags||[])].join(" ").toLowerCase()}
function githubRepo(i){if(!i.url)return null;try{const u=new URL(i.url);if(u.hostname!=="github.com")return null;const p=u.pathname.split("/").filter(Boolean);return p.length>=2?{owner:p[0],repo:p[1].replace(/\.git$/,""),key:p[0]+"/"+p[1].replace(/\.git$/,"")}:null}catch{return null}}
function ogImage(i){const g=githubRepo(i);return g?"https://opengraph.githubassets.com/1/"+encodeURIComponent(g.owner)+"/"+encodeURIComponent(g.repo):""}
function filtered(){
  let a=state.items.filter(i=>{
    if(state.query&&!itemText(i).includes(state.query))return false;
    if(state.kind&&i.kind!==state.kind)return false;
    if(state.category&&i.category!==state.category)return false;
    if(state.license&&i.license!==state.license)return false;
    if(state.tag&&!(i.tags||[]).includes(state.tag))return false;
    if(state.favoritesOnly&&!state.favorites.has(i.id))return false;
    return true
  });
  if(state.sort==="name")a.sort((a,b)=>(a.name||a.title).localeCompare(b.name||b.title));
  if(state.sort==="category")a.sort((a,b)=>(a.category||"").localeCompare(b.category||""));
  return a
}
function card(i){
  const title=i.name||i.title,summary=i.summary||i.note||"README와 원본 자료를 상세 보기에서 확인하세요.",fav=state.favorites.has(i.id),cmp=state.compare.has(i.id),preview=i.kind==="resource"?ogImage(i):"";
  return '<article class="card" data-kind="'+esc(i.kind)+'">'+
    (preview?'<button class="card-preview" data-detail="'+esc(i.id)+'" type="button" aria-label="'+esc(title)+' 미리보기"><img src="'+esc(preview)+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.classList.add(\'preview-failed\')"></button>':'')+
    '<div class="card-body"><div class="card-top"><span class="badge '+esc(i.kind)+'">'+esc(i.kind)+'</span><span class="badge">'+esc(i.category||"general")+'</span></div>'+
    '<h3>'+esc(title)+'</h3><p>'+esc(summary)+'</p><div class="tags">'+(i.tags||[]).slice(0,5).map(t=>'<span class="tag">'+esc(t)+'</span>').join("")+'</div>'+
    '<div class="meta"><span>'+esc(i.license||"—")+'</span><span>'+(i.licenseStatus==="review-required"?"link-only":"source-first")+'</span></div>'+
    '<div class="card-actions"><button class="star '+(fav?"on":"")+'" data-fav="'+esc(i.id)+'" aria-label="즐겨찾기">'+(fav?"★":"☆")+'</button><button data-detail="'+esc(i.id)+'">상세</button><button data-compare="'+esc(i.id)+'">'+(cmp?"선택됨":"비교")+'</button>'+(i.url?'<a href="'+esc(i.url)+'" target="_blank" rel="noreferrer">원본</a>':"")+'</div></div></article>'
}
function activeFilterMarkup(){
  const tokens=[];
  if(state.query)tokens.push(["query","검색",state.query]);
  if(state.kind)tokens.push(["kind","종류",state.kind]);
  if(state.category)tokens.push(["category","카테고리",state.category]);
  if(state.license)tokens.push(["license","라이선스",state.license]);
  if(state.tag)tokens.push(["tag","태그",state.tag]);
  if(state.favoritesOnly)tokens.push(["favorites","보기","즐겨찾기"]);
  return tokens.map(t=>'<button class="filter-token" data-clear="'+t[0]+'" type="button"><b>'+esc(t[1])+'</b> '+esc(t[2])+' ×</button>').join("")
}
function render(){
  const a=filtered();
  $("#grid").innerHTML=a.map(card).join("");
  $("#resultCount").textContent=a.length;$("#empty").hidden=!!a.length;$("#favoriteCount").textContent=state.favorites.size;
  $("#compareCount").textContent=state.compare.size;$("#compareBar").hidden=!state.compare.size;
  $("#activeFilters").innerHTML=activeFilterMarkup();
  $("#favoritesQuick").classList.toggle("active",state.favoritesOnly)
}
function decode64(s){try{const b=atob((s||"").replace(/\n/g,""));const bytes=Uint8Array.from(b,c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)}catch{return""}}
function resolveReadmeImage(src,download){src=(src||"").trim().replace(/^<|>$/g,"");if(!src||/^(data:|javascript:)/i.test(src))return"";try{return safeUrl(new URL(src,download||location.href).href)}catch{return""}}
function readmeImages(md,download){const found=[];let m;const re1=/!\[[^\]]*\]\((?:<)?([^\s)>]+)(?:>)?(?:\s+["'][^"']*["'])?\)/g;const re2=/<img[^>]+src=["']([^"']+)["'][^>]*>/gi;while((m=re1.exec(md)))found.push(m[1]);while((m=re2.exec(md)))found.push(m[1]);return [...new Set(found.map(x=>resolveReadmeImage(x,download)).filter(x=>x&&!/(shields\.io|badge|star-history|github-readme-stats|codecov|coveralls|actions\/workflows)/i.test(x)))].slice(0,6)}
function readmeHighlights(md){let s=md.replace(/\x60\x60\x60[\s\S]*?\x60\x60\x60/g," ").replace(/!\[[^\]]*\]\([^)]*\)/g," ").replace(/<img[^>]*>/gi," ").replace(/<[^>]+>/g," ");s=s.replace(/\[([^\]]+)\]\([^)]*\)/g,"$1").replace(/^#{1,6}\s+/gm,"").replace(/^[-*+]\s+/gm,"• ").replace(/^>\s?/gm,"").replace(/\|[-: |]+\|/g," ");return s.split(/\n\s*\n/).map(x=>x.replace(/\s+/g," ").trim()).filter(x=>x.length>45&&!/^(badge|build|license|stars?|forks?)\b/i.test(x)).slice(0,4)}
async function loadGithub(i){
  const g=githubRepo(i);if(!g)return null;if(ghCache.has(g.key))return ghCache.get(g.key);
  const p=(async()=>{
    const headers={"Accept":"application/vnd.github+json"};
    const [repoRes,readmeRes]=await Promise.allSettled([
      fetch("https://api.github.com/repos/"+g.owner+"/"+g.repo,{headers}).then(r=>r.ok?r.json():Promise.reject(r.status)),
      fetch("https://api.github.com/repos/"+g.owner+"/"+g.repo+"/readme",{headers}).then(r=>r.ok?r.json():Promise.reject(r.status))
    ]);
    const meta=repoRes.status==="fulfilled"?repoRes.value:null,readme=readmeRes.status==="fulfilled"?readmeRes.value:null,md=readme?decode64(readme.content):"";
    return {meta,readme,md,images:readmeImages(md,readme&&readme.download_url),highlights:readmeHighlights(md)}
  })();
  ghCache.set(g.key,p);return p
}
function gallery(images,title){if(!images.length)return"";return '<section class="preview-section"><div class="section-kicker">VISUAL PREVIEW</div><h3>README에서 찾은 화면과 예시</h3><div class="preview-gallery">'+images.map((u,n)=>'<a href="'+esc(u)+'" target="_blank" rel="noreferrer" class="preview-shot"><img src="'+esc(u)+'" alt="'+esc(title)+' README preview '+(n+1)+'" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest(\'.preview-shot\').remove()"></a>').join("")+'</div><p class="source-note">이미지는 upstream README의 원본 URL을 직접 참조합니다. 재배포가 아니라 미리보기이며 저작권·라이선스는 원본 프로젝트를 따릅니다.</p></section>'}
function detailShell(i){
  const title=i.name||i.title,prompt=i.kind==="skill"?'Use the "'+i.id+'" skill. Read the local catalog first, then select only sources with verified provenance and suitable license status. Apply accessibility and responsive checks.':'Use "'+title+'" as a reference for this task. Check its upstream source, license/provenance, accessibility and responsive behavior before reusing code or assets.',c=curated[i.id];
  return '<div class="detail-hero">'+(i.kind==="resource"&&ogImage(i)?'<img class="detail-og" src="'+esc(ogImage(i))+'" alt="" referrerpolicy="no-referrer">':"")+'<div><span class="badge '+esc(i.kind)+'">'+esc(i.kind)+'</span><h2 class="detail-title">'+esc(title)+'</h2><p class="detail-summary">'+esc((c&&c.about)||i.summary||i.note||"카탈로그 항목")+'</p></div></div>'+
  '<div class="detail-grid"><div><small>Category</small><strong>'+esc(i.category||"—")+'</strong></div><div><small>License</small><strong>'+esc(i.license||"—")+'</strong></div><div><small>Policy</small><strong>'+(i.licenseStatus==="review-required"?"Link-only / review required":"Source-first")+'</strong></div><div><small>ID</small><strong>'+esc(i.id)+'</strong></div></div>'+
  (c&&c.examples?'<section class="example-box"><div class="section-kicker">EXAMPLES</div><h3>이 자료에서 먼저 볼 것</h3><div class="example-grid">'+c.examples.map(x=>'<span>'+esc(x)+'</span>').join("")+'</div></section>':"")+
  '<div id="githubEnrichment" class="github-enrichment">'+(githubRepo(i)?'<div class="readme-loading"><span class="spinner"></span> GitHub About · README · 이미지를 불러오는 중…</div>':"")+'</div><div class="tags">'+(i.tags||[]).map(t=>'<span class="tag">'+esc(t)+'</span>').join("")+'</div><h3>Agent prompt</h3><pre class="prompt" id="promptText">'+esc(prompt)+'</pre><p class="detail-actions"><button class="button" id="copyPrompt" type="button">프롬프트 복사</button> '+(i.url?'<a class="button ghost" href="'+esc(i.url)+'" target="_blank" rel="noreferrer">Upstream 열기</a>':"")+'</p>'
}
async function detail(i){
  const title=i.name||i.title;$("#detailContent").innerHTML=detailShell(i);$("#detailDialog").showModal();
  const prompt=$("#promptText").textContent;$("#copyPrompt").onclick=async()=>{await navigator.clipboard.writeText(prompt);$("#copyPrompt").textContent="복사됨"};
  if(!githubRepo(i))return;
  try{
    const d=await loadGithub(i),m=d&&d.meta,c=curated[i.id],box=$("#githubEnrichment");if(!box)return;
    const desc=(m&&m.description)||(c&&c.about)||"",home=m&&safeUrl(m.homepage),topics=m&&m.topics||[];
    const stats=m?'<div class="repo-stats"><span>★ '+Number(m.stargazers_count||0).toLocaleString()+'</span><span>⑂ '+Number(m.forks_count||0).toLocaleString()+'</span><span>'+esc(m.language||"Multi")+'</span><span>Updated '+esc((m.updated_at||"").slice(0,10))+'</span></div>':"";
    const about='<section class="about-panel"><div class="section-kicker">GITHUB ABOUT</div><h3>About</h3><p>'+esc(desc||"GitHub README에서 프로젝트 설명을 확인하세요.")+'</p>'+stats+(topics.length?'<div class="tags">'+topics.slice(0,10).map(t=>'<span class="tag">'+esc(t)+'</span>').join("")+'</div>':"")+(home?'<p><a class="text-link" href="'+esc(home)+'" target="_blank" rel="noreferrer">공식 데모 / 홈페이지 열기 →</a></p>':"")+'</section>';
    const highlights=d.highlights.length?'<section class="readme-panel"><div class="section-kicker">README HIGHLIGHTS</div><h3>README 핵심 내용</h3>'+d.highlights.map(x=>'<p>'+esc(x.slice(0,700))+'</p>').join("")+'<a class="text-link" href="'+esc(i.url)+'#readme" target="_blank" rel="noreferrer">전체 README 보기 →</a></section>':"";
    box.innerHTML=gallery(d.images,title)+about+highlights
  }catch(e){const box=$("#githubEnrichment");if(box)box.innerHTML='<div class="readme-error">GitHub API 미리보기를 불러오지 못했습니다. 원본 저장소의 README는 계속 열 수 있습니다.</div>'}
}
function compare(){const items=[...state.compare].map(id=>state.items.find(x=>x.id===id)).filter(Boolean);$("#compareContent").innerHTML='<h2>Resource Compare</h2><p class="detail-summary">최대 4개 항목의 성격·라이선스·태그를 나란히 확인합니다.</p><div style="overflow:auto"><table class="compare-table"><thead><tr><th>항목</th><th>종류</th><th>카테고리</th><th>라이선스</th><th>태그</th></tr></thead><tbody>'+items.map(i=>'<tr><td><strong>'+esc(i.name||i.title)+'</strong></td><td>'+esc(i.kind)+'</td><td>'+esc(i.category||"—")+'</td><td>'+esc(i.license||"—")+'</td><td>'+esc((i.tags||[]).join(", "))+'</td></tr>').join("")+'</tbody></table></div>';$("#compareDialog").showModal()}
function options(sel,vals){$(sel).insertAdjacentHTML("beforeend",[...new Set(vals.filter(Boolean))].sort().map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join(""))}
function resetFilters(){
  state.query=state.kind=state.category=state.license=state.tag="";state.favoritesOnly=false;
  $("#search").value="";$("#kindFilter").value=$("#categoryFilter").value=$("#licenseFilter").value="";$("#favoritesOnly").checked=false;
  $$(".chip").forEach(x=>x.classList.remove("active"));render()
}
function clearOne(key){
  if(key==="query"){state.query="";$("#search").value=""}
  if(key==="kind"){state.kind="";$("#kindFilter").value=""}
  if(key==="category"){state.category="";$("#categoryFilter").value=""}
  if(key==="license"){state.license="";$("#licenseFilter").value=""}
  if(key==="tag"){state.tag="";$$(".chip").forEach(x=>x.classList.remove("active"))}
  if(key==="favorites"){state.favoritesOnly=false;$("#favoritesOnly").checked=false}
  render()
}
async function init(){
  applyTheme(localStorage.getItem("atlas:theme")||"system");applyStyle(state.style);applyDisplay();
  const data=await fetch("./data/catalog.json").then(r=>{if(!r.ok)throw new Error("catalog load failed");return r.json()});
  const res=data.resources.map(x=>({...x,kind:"resource"})),skills=data.skills.map(x=>({...x,kind:"skill",category:"agent-skill",license:"Project"})),patterns=data.patterns.map(x=>({...x,license:"Project",tags:[x.category]}));
  state.items=[...res,...skills,...patterns];
  $("#resourceCount").textContent=res.length;$("#skillCount").textContent=skills.length;$("#patternCount").textContent=patterns.length;
  options("#categoryFilter",state.items.map(x=>x.category));options("#licenseFilter",state.items.map(x=>x.license));
  const quick=["accessibility","design-system","ai-ui","icons","dashboard","react","svg","html","motion"];
  $("#quickTags").innerHTML=quick.map(t=>'<button class="chip" data-tag="'+t+'">'+t+'</button>').join("");
  render()
}
$("#search").addEventListener("input",e=>{state.query=norm(e.target.value.trim());render()});
$("#kindFilter").onchange=e=>{state.kind=e.target.value;render()};
$("#categoryFilter").onchange=e=>{state.category=e.target.value;render()};
$("#licenseFilter").onchange=e=>{state.license=e.target.value;render()};
$("#favoritesOnly").onchange=e=>{state.favoritesOnly=e.target.checked;render()};
$("#sortSelect").onchange=e=>{state.sort=e.target.value;render()};
$("#resetBtn").onclick=resetFilters;$("#emptyReset").onclick=resetFilters;
$("#themeBtn").onclick=cycleTheme;
$("#aboutBtn").onclick=()=>$("#aboutDialog").showModal();
$("#styleBtn").onclick=()=>{renderStylePresets();$("#styleDialog").showModal()};
$("#stylePresetGrid").addEventListener("click",e=>{const b=e.target.closest("[data-style-preset]");if(!b)return;applyStyle(b.dataset.stylePreset);$("#styleDialog").close()});
$("#favoritesQuick").onclick=()=>{state.favoritesOnly=!state.favoritesOnly;$("#favoritesOnly").checked=state.favoritesOnly;render()};
$("#filterToggle").onclick=()=>{const p=$("#filterPanel"),open=p.classList.toggle("open");$("#filterToggle").setAttribute("aria-expanded",open?"true":"false")};
$$("[data-view]").forEach(b=>b.onclick=()=>{state.view=b.dataset.view;applyDisplay()});
$("#columnSelect").onchange=e=>{state.columns=e.target.value;applyDisplay()};
$("#densitySelect").onchange=e=>{state.density=e.target.value;applyDisplay()};
$("#previewToggle").onclick=()=>{state.preview=state.preview==="on"?"off":"on";applyDisplay()};
$("#activeFilters").addEventListener("click",e=>{const b=e.target.closest("[data-clear]");if(b)clearOne(b.dataset.clear)});
$("#grid").addEventListener("click",e=>{
  const fav=e.target.closest("[data-fav]"),det=e.target.closest("[data-detail]"),cmp=e.target.closest("[data-compare]");
  if(fav){const id=fav.dataset.fav;state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);localStorage.setItem("atlas:favorites",JSON.stringify([...state.favorites]));render()}
  if(det){const i=state.items.find(x=>x.id===det.dataset.detail);if(i)detail(i)}
  if(cmp){const id=cmp.dataset.compare;if(state.compare.has(id))state.compare.delete(id);else if(state.compare.size<4)state.compare.add(id);render()}
});
$("#quickTags").addEventListener("click",e=>{const b=e.target.closest("[data-tag]");if(!b)return;state.tag=state.tag===b.dataset.tag?"":b.dataset.tag;$$(".chip").forEach(x=>x.classList.toggle("active",x.dataset.tag===state.tag));render()});
$("#compareOpen").onclick=compare;$("#compareClear").onclick=()=>{state.compare.clear();render()};
document.addEventListener("keydown",e=>{if(e.key==="/"&&!["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)){e.preventDefault();$("#search").focus()}if(e.key==="Escape"&&document.activeElement===$("#search"))$("#search").blur()});
init().catch(err=>{$("#grid").innerHTML='<div class="empty"><strong>카탈로그를 불러오지 못했습니다.</strong><span>'+esc(err.message)+'</span></div>'});
