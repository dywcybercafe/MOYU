"use strict";

const DB_NAME = "moyu-library-v1";
const DB_VERSION = 1;
const BOOK_STORE = "books";
const CHARS_PER_LINE = 32;
const LINES_PER_PAGE = 28;
const routes = [...document.querySelectorAll(".view")];
const navItems = [...document.querySelectorAll(".nav-item[data-route]")];

const els = {
  continuePanel: document.querySelector("#continue-panel"),
  bookSelect: document.querySelector("#book-select"),
  workspaceSelect: document.querySelector("#workspace-select"),
  disguiseSelect: document.querySelector("#disguise-select"),
  startWork: document.querySelector("#start-work"),
  bookList: document.querySelector("#book-list"),
  libraryColumns: document.querySelector("#library-columns"),
  importButtonLabel: document.querySelector("#import-button-label"),
  importBook: document.querySelector("#import-book"),
  libraryEmpty: document.querySelector("#library-empty"),
  librarySearch: document.querySelector("#library-search"),
  librarySort: document.querySelector("#library-sort"),
  allCount: document.querySelector("#all-count"),
  recentCount: document.querySelector("#recent-count"),
  favoriteCount: document.querySelector("#favorite-count"),
  fileInput: document.querySelector("#file-input"),
  positionModal: document.querySelector("#position-modal"),
  positionForm: document.querySelector("#position-form"),
  positionCancel: document.querySelector("#position-cancel"),
  modalBookName: document.querySelector("#modal-book-name"),
  pageInput: document.querySelector("#page-input"),
  lineInput: document.querySelector("#line-input"),
  wpsPages: document.querySelector("#wps-pages"),
  wpsScroll: document.querySelector("#wps-scroll"),
  wpsPageIndicator: document.querySelector("#wps-page-indicator"),
  wpsWordCount: document.querySelector("#wps-word-count"),
  realDisguisePopover: document.querySelector("#real-disguise-popover"),
  realDisguiseName: document.querySelector("#real-disguise-name"),
  uploadDisguise: document.querySelector("#upload-disguise"),
  disguiseFileInput: document.querySelector("#disguise-file-input"),
  realDisguiseClose: document.querySelector("#real-disguise-close"),
  mysqlCode: document.querySelector("#mysql-code"),
  mysqlEditorScroll: document.querySelector("#mysql-editor-scroll"),
  mysqlProgress: document.querySelector("#mysql-progress"),
  vscodeCode: document.querySelector("#vscode-code"),
  vscodeEditorScroll: document.querySelector("#vscode-editor-scroll"),
  vscodeProgress: document.querySelector("#vscode-progress"),
  settingsImePreview: document.querySelector("#settings-ime-preview"),
  typingPreviewText: document.querySelector("#typing-preview-text"),
  typingPreviewInput: document.querySelector("#typing-preview-input"),
  imeCandidateOverlay: document.querySelector("#ime-candidate-overlay"),
  deleteModal: document.querySelector("#delete-modal"),
  deleteCancel: document.querySelector("#delete-cancel"),
  deleteConfirm: document.querySelector("#delete-confirm"),
  toast: document.querySelector("#toast")
};

const fakeDocuments = [
  `2026 年第三季度项目调研报告\n\n一、项目概况\n\n本阶段工作围绕用户需求梳理、业务流程核验和实施风险评估展开。项目组已完成核心访谈材料汇总，并结合现有运营数据形成初步结论。\n\n二、阶段进展\n\n截至目前，基础信息采集工作已经完成。各小组按计划提交了业务现状说明，重点流程中的责任边界与协作节点已完成第一轮确认。针对反馈较集中的问题，项目组建立了专项跟踪表，并安排负责人持续更新。\n\n三、主要发现\n\n现有流程整体运行稳定，但部分环节仍存在重复录入、反馈周期偏长和信息口径不一致等情况。后续建议优先统一数据定义，减少非必要的人工转交，并对关键节点设置可量化的检查标准。\n\n四、下一步安排\n\n下一阶段将完成方案细化与内部评审，根据评审意见调整实施顺序。项目组计划同步准备试运行材料，确保相关人员在正式切换前熟悉新的工作方式。`,
  `部门周工作总结\n\n本周工作按照既定计划有序推进，重点完成了月度数据复核、重点事项跟踪以及跨部门需求确认。整体进度符合预期，暂未发现影响交付时间的重大风险。\n\n一、本周完成事项\n\n完成业务数据汇总及异常项复查，更新项目进度台账，并与相关负责人确认后续交付口径。针对上周会议提出的待办事项，已逐项补充处理说明。\n\n二、当前问题\n\n部分历史数据的归档标准仍需统一，个别事项依赖外部反馈。现阶段已通过临时清单进行跟踪，不影响日常工作开展。\n\n三、下周计划\n\n继续推进资料整理和结果校验，完成阶段性汇报材料初稿。对尚未闭环的问题安排专项沟通，并根据实际情况更新计划。`,
  `关于优化内部协作流程的建议\n\n为提高信息流转效率，减少重复沟通，现对当前协作流程提出以下优化建议。\n\n首先，统一需求提交入口。所有新增事项应包含背景、目标、完成标准和期望时间，避免因信息不完整产生反复确认。\n\n其次，明确任务状态。执行过程中统一使用待确认、进行中、待验收和已完成四类状态，并由事项负责人维护最新进展。\n\n再次，建立固定复盘机制。对于跨部门事项，在完成后简要记录实际结果、主要问题和可复用经验，为后续同类工作提供参考。\n\n以上建议可先在小范围内试行，两周后根据使用反馈调整细节，再决定是否推广。`
];

const fakeSqlDocuments = [
  `-- Customer activity report / Q3\nSELECT\n    c.customer_id,\n    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,\n    COUNT(r.rental_id) AS rental_count,\n    MAX(r.rental_date) AS last_activity\nFROM sakila.customer AS c\nLEFT JOIN sakila.rental AS r\n    ON r.customer_id = c.customer_id\nWHERE c.active = 1\n  AND r.rental_date >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)\nGROUP BY c.customer_id, customer_name\nORDER BY rental_count DESC\nLIMIT 1000;`,
  `-- Monthly sales reconciliation\nSELECT\n    DATE_FORMAT(p.payment_date, '%Y-%m') AS report_month,\n    s.store_id,\n    COUNT(*) AS transaction_count,\n    ROUND(SUM(p.amount), 2) AS gross_revenue,\n    ROUND(AVG(p.amount), 2) AS average_value\nFROM sakila.payment AS p\nINNER JOIN sakila.staff AS s\n    ON s.staff_id = p.staff_id\nWHERE p.payment_date IS NOT NULL\n  AND p.amount > 0\nGROUP BY report_month, s.store_id\nHAVING gross_revenue > 500\nORDER BY report_month DESC, s.store_id ASC;`,
  `-- Inventory availability check\nSELECT\n    f.title AS film_title,\n    cat.name AS category_name,\n    COUNT(i.inventory_id) AS copies_total,\n    SUM(CASE WHEN r.return_date IS NULL THEN 1 ELSE 0 END) AS checked_out\nFROM sakila.film AS f\nJOIN sakila.film_category AS fc ON fc.film_id = f.film_id\nJOIN sakila.category AS cat ON cat.category_id = fc.category_id\nJOIN sakila.inventory AS i ON i.film_id = f.film_id\nLEFT JOIN sakila.rental AS r ON r.inventory_id = i.inventory_id\nWHERE f.replacement_cost >= 15.00\nGROUP BY f.film_id, f.title, cat.name\nORDER BY checked_out DESC, f.title;`
];

const fakeCodeDocuments = [
  `from pathlib import Path
from dataclasses import dataclass

@dataclass
class DocumentState:
    path: Path
    encoding: str = "utf-8"
    cursor: int = 0

def load_workspace(root: Path) -> list[str]:
    files = sorted(root.glob("**/*.txt"))
    return [item.read_text(encoding="utf-8") for item in files]

def main() -> None:
    root = Path(__file__).parent.parent / "data"
    documents = load_workspace(root)
    print(f"loaded {len(documents)} documents")

if __name__ == "__main__":
    main()`,
  `import json
from datetime import datetime, timezone

def normalize_record(payload: dict) -> dict:
    return {
        "id": str(payload.get("id", "")),
        "title": payload.get("title", "Untitled").strip(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "active": bool(payload.get("active", True)),
    }

def export_records(records: list[dict]) -> str:
    normalized = [normalize_record(item) for item in records]
    return json.dumps(normalized, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    print(export_records([]))`,
  `from collections.abc import Iterable

DEFAULT_BATCH_SIZE = 64

def batched(items: Iterable[str], size: int = DEFAULT_BATCH_SIZE):
    batch: list[str] = []
    for item in items:
        batch.append(item)
        if len(batch) >= size:
            yield tuple(batch)
            batch.clear()
    if batch:
        yield tuple(batch)

def process_stream(lines: Iterable[str]) -> int:
    completed = 0
    for group in batched(lines):
        completed += len(group)
    return completed

if __name__ == "__main__":
    print(process_stream(["alpha", "beta", "gamma"]))`
];

let dbPromise;
let books = [];
let pendingBook = null;
let realDisguiseDoc = null;
let wpsSession = null;
let saveTimer = null;
let toastTimer = null;
let imeTimer = null;
let pendingDeleteId = null;
let libraryFilter = "all";
let libraryView = localStorage.getItem("moyu-library-view") || "grid";
const settings = {
  imeStyle: localStorage.getItem("moyu-ime-style") || "windows",
  typingSpeed: localStorage.getItem("moyu-typing-speed") || "medium"
};
const candidateWords = ["项目组", "文件夹", "数据库", "分析表", "新方案", "工作中", "进度表", "确认书", "计划表", "整理好", "已完成", "会议室", "需求单", "今天", "测试中"];
const sqlCandidateWords = ["SELECT", "FROM", "WHERE", "JOIN", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "COUNT", "SUM", "AVG", "AS", "AND", "OR", "id", "user_id", "created_at", "users", "orders", "*", "=", "()"];
const codeCandidateWords = ["def", "return", "if", "else", "for", "while", "class", "import", "from", "try", "except", "True", "False", "None", "data", "result", "items", "user_id", "load_data", "()", ":", "_"];

function openDatabase() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(BOOK_STORE)) {
          request.result.createObjectStore(BOOK_STORE, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return dbPromise;
}

async function getAllBooks() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(BOOK_STORE, "readonly").objectStore(BOOK_STORE).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function putBook(book) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(BOOK_STORE, "readwrite").objectStore(BOOK_STORE).put(book);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function deleteBookRecord(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(BOOK_STORE, "readwrite").objectStore(BOOK_STORE).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function selectedBookId() {
  return localStorage.getItem("moyu-selected-book") || els.bookSelect.value || "";
}

function selectedBook() {
  const id = selectedBookId();
  return books.find((book) => book.id === id) || books[0] || null;
}

function showRoute(route) {
  const isReadingRoute = route === "word" || route === "mysql" || route === "vscode";
  if (!["home", "library", "settings", "word", "mysql", "vscode"].includes(route)) route = "home";
  if (isReadingRoute && !wpsSession) route = books.length ? "home" : "library";
  const activeReadingRoute = document.body.classList.contains("vscode-mode") ? "vscode" : (document.body.classList.contains("mysql-mode") ? "mysql" : (document.body.classList.contains("word-mode") ? "word" : ""));
  if (activeReadingRoute && route !== activeReadingRoute) endWpsSession();
  routes.forEach((view) => view.classList.toggle("is-visible", view.id === route));
  navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.route === route));
  document.body.classList.toggle("word-mode", route === "word");
  document.body.classList.toggle("mysql-mode", route === "mysql");
  document.body.classList.toggle("vscode-mode", route === "vscode");
  const nextHash = route === "home" ? "" : `#${route}`;
  if (window.location.hash !== nextHash) history.replaceState(null, "", nextHash || window.location.pathname + window.location.search);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
}

function progressOf(book) {
  return book.text.length ? Math.min(100, Math.round((book.position / book.text.length) * 100)) : 0;
}

function pageAndLine(position) {
  const pageSize = CHARS_PER_LINE * LINES_PER_PAGE;
  return {
    page: Math.floor(position / pageSize) + 1,
    line: Math.floor((position % pageSize) / CHARS_PER_LINE) + 1
  };
}

function relativeTime(timestamp) {
  if (!timestamp) return "—";
  const seconds = Math.max(1, Math.round((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "刚刚";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  return `${days} 天前`;
}

function excerptFor(book) {
  const start = Math.max(0, book.position - 36);
  return book.text.slice(start, start + 82).replace(/\s+/g, " ").trim() || "等待你敲下第一个字。";
}

function workspaceLabel(workspace) {
  if (workspace === "mysql") return "MySQL Workbench";
  if (workspace === "vscode") return "VS Code";
  return "Word";
}

function renderHome() {
  const current = selectedBook();
  els.bookSelect.innerHTML = "";
  if (!books.length) {
    const option = new Option("请先导入小说", "");
    els.bookSelect.add(option);
    els.bookSelect.disabled = true;
    els.startWork.disabled = true;
    els.continuePanel.innerHTML = `
      <div class="empty-continue"><p class="overline">继续阅读</p><h2>还没有可以继续的小说。</h2>
      <p class="meta">先去书库添加一本小说，再开始你的第一段摸鱼时间。</p></div>
      <button class="dark-button" type="button" data-route="library">添加小说 <span>→</span></button>`;
    bindRouteButtons(els.continuePanel);
    return;
  }

  els.bookSelect.disabled = false;
  els.startWork.disabled = false;
  for (const book of books) els.bookSelect.add(new Option(book.title, book.id));
  els.bookSelect.value = current.id;
  const progress = progressOf(current);
  const position = pageAndLine(current.position);
  els.continuePanel.innerHTML = `
    <div><p class="overline">继续阅读</p><h2>${escapeHtml(current.title)}</h2>
    <p class="meta">${progress}% <i>·</i> ${workspaceLabel(current.lastWorkspace)} <i>·</i> 第 ${position.page} 页，第 ${position.line} 行 <i>·</i> ${relativeTime(current.lastReadAt)}</p>
    <div class="progress"><span style="width:${progress}%"></span></div></div>
    <button class="dark-button primary-session-button" id="continue-work" type="button">继续阅读 <span>→</span></button>`;
  document.querySelector("#continue-work").addEventListener("click", () => startWpsSession(current.id, current.lastWorkspace || els.workspaceSelect.value));
}

function renderLibrary() {
  const recentBooks = books.filter((book) => Boolean(book.lastReadAt));
  const favoriteBooks = books.filter((book) => Boolean(book.favorite));
  els.allCount.textContent = `(${books.length})`;
  els.recentCount.textContent = `(${recentBooks.length})`;
  els.favoriteCount.textContent = `(${favoriteBooks.length})`;
  let shown = libraryFilter === "recent" ? recentBooks : (libraryFilter === "favorite" ? favoriteBooks : [...books]);
  const query = els.librarySearch.value.trim().toLocaleLowerCase();
  if (query) shown = shown.filter((book) => book.title.toLocaleLowerCase().includes(query));
  if (els.librarySort.value === "title") shown.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  else if (els.librarySort.value === "added") shown.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  else shown.sort((a, b) => (b.lastReadAt || b.createdAt || 0) - (a.lastReadAt || a.createdAt || 0));
  els.libraryColumns.classList.toggle("is-empty", shown.length === 0);
  els.libraryColumns.classList.toggle("is-list", libraryView === "list");
  els.libraryEmpty.hidden = shown.length !== 0;
  els.bookList.hidden = shown.length === 0;
  els.bookList.innerHTML = shown.map((book, index) => {
    const progress = progressOf(book);
    return `<article class="book-row" data-read-book="${book.id}">
      <div class="cover" data-tone="${index % 4}"><small>${escapeHtml(book.title)}</small></div>
      <div class="book-info"><h2>${escapeHtml(book.title)}</h2><p class="book-progress-label">${progress}%</p>
      <div class="row-progress"><i style="width:${progress}%"></i></div><p>${book.lastReadAt ? `上次阅读：${relativeTime(book.lastReadAt)}` : "尚未开始"}</p></div>
      <button class="book-menu-trigger" type="button" data-book-menu="${book.id}" aria-label="${escapeHtml(book.title)}的更多操作">•••</button>
      <div class="book-menu" data-menu-for="${book.id}" hidden><button type="button" data-favorite-book="${book.id}">${book.favorite ? "取消喜欢" : "标记为喜欢"}</button><button class="delete-item" type="button" data-delete-book="${book.id}">删除小说</button></div>
    </article>`;
  }).join("");
  els.bookList.querySelectorAll("[data-read-book]").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (event.target.closest("button,.book-menu")) return;
      const book = books.find((item) => item.id === button.dataset.readBook);
      startWpsSession(button.dataset.readBook, book?.lastWorkspace || "word");
    });
  });
  els.bookList.querySelectorAll("[data-book-menu]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    const menu = els.bookList.querySelector(`[data-menu-for="${button.dataset.bookMenu}"]`);
    const willOpen = menu.hidden;
    els.bookList.querySelectorAll(".book-menu").forEach((item) => { item.hidden = true; });
    menu.hidden = !willOpen;
  }));
  els.bookList.querySelectorAll("[data-favorite-book]").forEach((button) => button.addEventListener("click", () => toggleFavorite(button.dataset.favoriteBook)));
  els.bookList.querySelectorAll("[data-delete-book]").forEach((button) => {
    button.addEventListener("click", () => requestDeleteBook(button.dataset.deleteBook));
  });
}

async function toggleFavorite(id) {
  const book = books.find((item) => item.id === id);
  if (!book) return;
  book.favorite = !book.favorite;
  await putBook(book);
  renderLibrary();
  showToast(book.favorite ? "已添加到我喜欢的" : "已取消喜欢");
}

function requestDeleteBook(id) {
  pendingDeleteId = id;
  els.deleteModal.hidden = false;
}

async function deleteBook(id) {
  try {
    await deleteBookRecord(id);
    books = books.filter((book) => book.id !== id);
    if (localStorage.getItem("moyu-selected-book") === id) {
      if (books[0]) localStorage.setItem("moyu-selected-book", books[0].id);
      else localStorage.removeItem("moyu-selected-book");
    }
    renderAll();
    showToast("小说及阅读数据已删除");
  } catch (error) {
    console.error(error);
    showToast("删除失败，请稍后重试");
  }
}

function randomCandidates(count = 5) {
  return [...candidateWords].sort(() => Math.random() - .5).slice(0, count).map((word, index) => ({
    index: index + 1,
    word: [...word].slice(0, 1 + Math.floor(Math.random() * 3)).join("")
  }));
}

function randomTechnicalCandidates(words, count = 6) {
  return [...words].sort(() => Math.random() - .5).slice(0, count).map((word, index) => ({ index: index + 1, word }));
}

function workspaceCandidates() {
  if (wpsSession?.workspace === "mysql") return randomTechnicalCandidates(sqlCandidateWords);
  if (wpsSession?.workspace === "vscode") return randomTechnicalCandidates(codeCandidateWords);
  return randomCandidates(6);
}

function candidateMarkup(style, candidates = workspaceCandidates()) {
  return `<div class="candidate-box ${style}">${candidates.map((item, index) => `<span class="${index === 0 ? "selected" : ""}"><b>${item.index}</b>${escapeHtml(item.word)}</span>`).join("")}<i>⌄</i></div>`;
}

function renderSettings() {
  document.querySelectorAll("[data-ime-style]").forEach((button) => button.classList.toggle("is-active", button.dataset.imeStyle === settings.imeStyle));
  document.querySelectorAll("[data-typing-speed]").forEach((button) => button.classList.toggle("is-active", button.dataset.typingSpeed === settings.typingSpeed));
  els.settingsImePreview.innerHTML = candidateMarkup(settings.imeStyle, ["项目", "文件", "数据", "分析", "方案"].map((word, index) => ({ index: index + 1, word })));
}

function typingRange() {
  if (settings.typingSpeed === "slow") return [1, 2];
  if (settings.typingSpeed === "fast") return [3, 8];
  return [1, 5];
}

function randomTypingAmount() {
  const [min, max] = typingRange();
  return min + Math.floor(Math.random() * (max - min + 1));
}

function positionImeCandidates() {
  if (els.imeCandidateOverlay.hidden || !wpsSession) return;
  const caretSelector = wpsSession.workspace === "mysql" ? "#mysql-caret" : (wpsSession.workspace === "vscode" ? "#vscode-caret" : "#typing-caret");
  const caret = document.querySelector(caretSelector);
  const candidateBox = els.imeCandidateOverlay.querySelector(".candidate-box");
  if (!caret || !candidateBox) return;
  const caretRect = caret.getBoundingClientRect();
  const boxRect = candidateBox.getBoundingClientRect();
  const gap = 6;
  const edge = 8;
  const left = Math.min(Math.max(edge, caretRect.left), Math.max(edge, window.innerWidth - boxRect.width - edge));
  const below = caretRect.bottom + gap;
  const top = below + boxRect.height <= window.innerHeight - edge
    ? below
    : Math.max(edge, caretRect.top - boxRect.height - gap);
  els.imeCandidateOverlay.style.left = `${left}px`;
  els.imeCandidateOverlay.style.top = `${top}px`;
}

function showImeCandidates() {
  if (!wpsSession || wpsSession.disguise) return;
  els.imeCandidateOverlay.className = `ime-candidate-overlay ${settings.imeStyle}`;
  els.imeCandidateOverlay.innerHTML = candidateMarkup(settings.imeStyle);
  els.imeCandidateOverlay.hidden = false;
  requestAnimationFrame(positionImeCandidates);
  clearTimeout(imeTimer);
  imeTimer = setTimeout(() => { els.imeCandidateOverlay.hidden = true; }, 1400);
}

function renderAll() {
  books.sort((a, b) => (b.lastReadAt || b.createdAt) - (a.lastReadAt || a.createdAt));
  renderHome();
  renderLibrary();
  renderSettings();
}

function bindRouteButtons(root = document) {
  root.querySelectorAll("[data-route]").forEach((button) => {
    if (button.dataset.routeBound) return;
    button.dataset.routeBound = "true";
    button.addEventListener("click", () => showRoute(button.dataset.route));
  });
}

function normalizeText(text) {
  return text.replace(/\r\n?/g, "\n").replace(/[\t\u00a0]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{4,}/g, "\n\n\n").trim();
}

function xmlToParagraphs(xmlText, preserveSpacing = false) {
  const xml = new DOMParser().parseFromString(xmlText, "application/xml");
  if (xml.querySelector("parsererror")) throw new Error("文件内容无法解析");
  const paragraphs = [...xml.getElementsByTagNameNS("*", "p")];
  const text = paragraphs.map((paragraph) => {
    const pieces = [];
    [...paragraph.getElementsByTagName("*")].filter((node) => ["t", "tab", "br", "cr"].includes(node.localName)).forEach((node) => {
      if (node.localName === "t") pieces.push(node.textContent || "");
      else if (node.localName === "tab") pieces.push("\t");
      else pieces.push("\n");
    });
    return pieces.join("");
  }).join("\n\n").replace(/\r\n?/g, "\n");
  return preserveSpacing ? text : normalizeText(text);
}

function htmlToText(htmlText) {
  const doc = new DOMParser().parseFromString(htmlText, "text/html");
  doc.querySelectorAll("script,style,noscript,svg").forEach((node) => node.remove());
  const blocks = [...doc.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,blockquote,pre")];
  return normalizeText((blocks.length ? blocks.map((node) => node.textContent) : [doc.body.textContent]).join("\n\n"));
}

function resolveZipPath(baseFile, relativePath) {
  const clean = decodeURIComponent(relativePath.split("#")[0]);
  if (clean.startsWith("/")) return clean.slice(1);
  const parts = `${baseFile.includes("/") ? baseFile.slice(0, baseFile.lastIndexOf("/") + 1) : ""}${clean}`.split("/");
  const out = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") out.pop(); else out.push(part);
  }
  return out.join("/");
}

function xmlAttribute(node, localName) {
  if (!node) return "";
  return [...node.attributes].find((attribute) => attribute.localName === localName)?.value || "";
}

function mostFrequent(values) {
  if (!values.length) return null;
  const counts = new Map();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts].sort((a, b) => b[1] - a[1])[0][0];
}

function bounded(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function defaultReadingStyle() {
  return { fontFamily: "PingFang SC", fontSize: 15, lineHeight: 1.56, letterSpacing: 0.45 };
}

function extractDocxReadingStyle(...xmlTexts) {
  const fonts = [];
  const sizes = [];
  const lineHeights = [];
  const letterSpacings = [];
  for (const xmlText of xmlTexts.filter(Boolean)) {
    const xml = new DOMParser().parseFromString(xmlText, "application/xml");
    [...xml.getElementsByTagNameNS("*", "rFonts")].forEach((node) => {
      const font = xmlAttribute(node, "eastAsia") || xmlAttribute(node, "ascii") || xmlAttribute(node, "hAnsi");
      if (font && !font.startsWith("+")) fonts.push(font);
    });
    [...xml.getElementsByTagNameNS("*", "sz")].forEach((node) => {
      const halfPoints = Number(xmlAttribute(node, "val"));
      if (halfPoints >= 16 && halfPoints <= 48) sizes.push(Math.round((halfPoints / 2) * 1.333 * 10) / 10);
    });
    [...xml.getElementsByTagNameNS("*", "spacing")].forEach((node) => {
      const line = Number(xmlAttribute(node, "line"));
      if (line >= 240 && line <= 480) lineHeights.push(line / 240);
      const characterSpacing = Number(xmlAttribute(node, "val"));
      if (characterSpacing >= 0 && characterSpacing <= 80) letterSpacings.push(characterSpacing / 20 * 1.333);
    });
  }
  const defaults = defaultReadingStyle();
  return {
    fontFamily: mostFrequent(fonts) || defaults.fontFamily,
    fontSize: bounded(mostFrequent(sizes), 13, 20, defaults.fontSize),
    lineHeight: bounded(mostFrequent(lineHeights), 1.3, 1.9, defaults.lineHeight),
    letterSpacing: bounded(mostFrequent(letterSpacings), 0, 1.6, defaults.letterSpacing)
  };
}

function cssSizeToPixels(value, fallback) {
  const match = String(value || "").trim().match(/^([\d.]+)(px|pt|em|rem)?$/i);
  if (!match) return fallback;
  const number = Number(match[1]);
  const unit = (match[2] || "px").toLowerCase();
  if (unit === "pt") return number * 1.333;
  if (unit === "em" || unit === "rem") return number * 16;
  return number;
}

function extractCssReadingStyle(cssText) {
  const defaults = defaultReadingStyle();
  const focusedRules = [...cssText.matchAll(/(?:^|[}\s,])(body|p|article|section)[^{]*\{([^}]*)\}/gi)].map((match) => match[2]).join(";") || cssText;
  const property = (name) => focusedRules.match(new RegExp(`${name}\\s*:\\s*([^;}]*)`, "i"))?.[1]?.trim();
  const font = property("font-family")?.split(",")[0].replace(/["']/g, "").trim();
  const fontSize = cssSizeToPixels(property("font-size"), defaults.fontSize);
  const rawLineHeight = property("line-height");
  const parsedLineHeight = rawLineHeight && !/[a-z%]/i.test(rawLineHeight) ? Number(rawLineHeight) : cssSizeToPixels(rawLineHeight, fontSize * defaults.lineHeight) / fontSize;
  const letterSpacing = cssSizeToPixels(property("letter-spacing"), defaults.letterSpacing);
  return {
    fontFamily: font || defaults.fontFamily,
    fontSize: bounded(fontSize, 13, 20, defaults.fontSize),
    lineHeight: bounded(parsedLineHeight, 1.3, 1.9, defaults.lineHeight),
    letterSpacing: bounded(letterSpacing, 0, 1.6, defaults.letterSpacing)
  };
}

function safeInlineStyle(styleText) {
  const allowed = new Set([
    "font-family", "font-size", "font-weight", "font-style", "text-decoration",
    "letter-spacing", "line-height", "text-align", "text-indent", "margin-top",
    "margin-right", "margin-bottom", "margin-left", "padding-left", "color",
    "white-space", "vertical-align"
  ]);
  return String(styleText || "").split(";").map((declaration) => declaration.trim()).filter(Boolean).map((declaration) => {
    const separator = declaration.indexOf(":");
    if (separator < 1) return "";
    const property = declaration.slice(0, separator).trim().toLowerCase();
    const value = declaration.slice(separator + 1).trim();
    if (!allowed.has(property) || /url\s*\(|expression\s*\(|javascript:/i.test(value)) return "";
    return `${property}:${value}`;
  }).filter(Boolean).join(";");
}

function sanitizeDocumentHtml(htmlText) {
  const doc = new DOMParser().parseFromString(htmlText, "text/html");
  doc.querySelectorAll("script,style,noscript,iframe,object,embed,svg,img,link,meta,form,input,button").forEach((node) => node.remove());
  const allowed = new Set(["P", "DIV", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE", "PRE", "BR", "UL", "OL", "LI", "TABLE", "TBODY", "THEAD", "TR", "TD", "TH", "STRONG", "B", "EM", "I", "U", "SUP", "SUB"]);
  [...doc.body.querySelectorAll("*")].forEach((node) => {
    if (!allowed.has(node.tagName)) {
      node.replaceWith(...node.childNodes);
      return;
    }
    const style = safeInlineStyle(node.getAttribute("style"));
    [...node.attributes].forEach((attribute) => node.removeAttribute(attribute.name));
    if (style) node.setAttribute("style", style);
  });
  return doc.body.innerHTML;
}

function directChildByLocalName(node, localName) {
  return [...(node?.children || [])].find((child) => child.localName === localName) || null;
}

function twipsToPixels(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round((number / 15) * 100) / 100 : null;
}

function docxParagraphPages(documentXml) {
  const xml = new DOMParser().parseFromString(documentXml, "application/xml");
  const pages = [[]];
  for (const paragraph of [...xml.getElementsByTagNameNS("*", "p")]) {
    const paragraphProperties = directChildByLocalName(paragraph, "pPr");
    const styles = ["white-space:pre-wrap"];
    const alignment = xmlAttribute(directChildByLocalName(paragraphProperties, "jc"), "val");
    const alignments = { left: "left", center: "center", right: "right", both: "justify", distribute: "justify" };
    if (alignments[alignment]) styles.push(`text-align:${alignments[alignment]}`);
    const indentation = directChildByLocalName(paragraphProperties, "ind");
    const firstLine = twipsToPixels(xmlAttribute(indentation, "firstLine"));
    const hanging = twipsToPixels(xmlAttribute(indentation, "hanging"));
    const leftIndent = twipsToPixels(xmlAttribute(indentation, "left") || xmlAttribute(indentation, "start"));
    const rightIndent = twipsToPixels(xmlAttribute(indentation, "right") || xmlAttribute(indentation, "end"));
    if (firstLine !== null) styles.push(`text-indent:${firstLine}px`);
    if (hanging !== null) styles.push(`text-indent:-${hanging}px`);
    if (leftIndent !== null) styles.push(`margin-left:${leftIndent}px`);
    if (rightIndent !== null) styles.push(`margin-right:${rightIndent}px`);
    const spacing = directChildByLocalName(paragraphProperties, "spacing");
    const before = twipsToPixels(xmlAttribute(spacing, "before"));
    const after = twipsToPixels(xmlAttribute(spacing, "after"));
    if (before !== null) styles.push(`margin-top:${before}px`);
    if (after !== null) styles.push(`margin-bottom:${after}px`);
    const line = Number(xmlAttribute(spacing, "line"));
    const lineRule = xmlAttribute(spacing, "lineRule");
    if (line > 0) styles.push(lineRule === "auto" ? `line-height:${line / 240}` : `line-height:${twipsToPixels(line)}px`);

    const runs = [];
    for (const run of [...paragraph.getElementsByTagNameNS("*", "r")]) {
      const runProperties = directChildByLocalName(run, "rPr");
      const runStyles = [];
      const fonts = directChildByLocalName(runProperties, "rFonts");
      const font = xmlAttribute(fonts, "eastAsia") || xmlAttribute(fonts, "ascii") || xmlAttribute(fonts, "hAnsi");
      if (font && !/["'`;{}]/.test(font)) runStyles.push(`font-family:${font}`);
      const halfPoints = Number(xmlAttribute(directChildByLocalName(runProperties, "sz"), "val"));
      if (halfPoints > 0) runStyles.push(`font-size:${Math.round((halfPoints / 2) * 1.333 * 100) / 100}px`);
      if (directChildByLocalName(runProperties, "b")) runStyles.push("font-weight:700");
      if (directChildByLocalName(runProperties, "i")) runStyles.push("font-style:italic");
      if (directChildByLocalName(runProperties, "u")) runStyles.push("text-decoration:underline");
      const color = xmlAttribute(directChildByLocalName(runProperties, "color"), "val");
      if (/^[0-9a-f]{6}$/i.test(color)) runStyles.push(`color:#${color}`);
      const characterSpacing = twipsToPixels(xmlAttribute(directChildByLocalName(runProperties, "spacing"), "val"));
      if (characterSpacing !== null) runStyles.push(`letter-spacing:${characterSpacing}px`);
      const pieces = [];
      [...run.getElementsByTagName("*")].filter((node) => ["t", "tab", "br", "cr"].includes(node.localName)).forEach((node) => {
        if (node.localName === "t") pieces.push(node.textContent || "");
        else if (node.localName === "tab") pieces.push("\t");
        else if (xmlAttribute(node, "type") !== "page") pieces.push("\n");
      });
      if (pieces.length) runs.push(`<span${runStyles.length ? ` style="${safeInlineStyle(runStyles.join(";"))}"` : ""}>${escapeHtml(pieces.join(""))}</span>`);
    }
    const html = `<p class="real-paragraph" style="${safeInlineStyle(styles.join(";"))}">${runs.join("") || "<br>"}</p>`;
    pages[pages.length - 1].push(html);
    const hasPageBreak = [...paragraph.getElementsByTagNameNS("*", "br")].some((node) => xmlAttribute(node, "type") === "page") || paragraph.getElementsByTagNameNS("*", "lastRenderedPageBreak").length > 0;
    if (hasPageBreak) pages.push([]);
  }
  return pages.filter((page) => page.length).map((page) => page.join(""));
}

async function parseDocx(file) {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const entry = zip.file("word/document.xml");
  if (!entry) throw new Error("DOCX 中没有找到正文");
  const documentXml = await entry.async("string");
  const stylesXml = zip.file("word/styles.xml") ? await zip.file("word/styles.xml").async("string") : "";
  return { text: xmlToParagraphs(documentXml), originalText: xmlToParagraphs(documentXml, true), readingStyle: extractDocxReadingStyle(documentXml, stylesXml), layoutPages: docxParagraphPages(documentXml) };
}

async function parseEpub(file) {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const container = zip.file("META-INF/container.xml");
  if (!container) throw new Error("EPUB 结构不完整");
  const containerXml = new DOMParser().parseFromString(await container.async("string"), "application/xml");
  const rootfile = containerXml.getElementsByTagNameNS("*", "rootfile")[0];
  const opfPath = rootfile?.getAttribute("full-path");
  if (!opfPath) throw new Error("EPUB 中没有找到目录");
  const opfEntry = zip.file(opfPath);
  if (!opfEntry) throw new Error("EPUB 目录无法读取");
  const opf = new DOMParser().parseFromString(await opfEntry.async("string"), "application/xml");
  const manifest = new Map([...opf.getElementsByTagNameNS("*", "item")].map((item) => [item.getAttribute("id"), item.getAttribute("href")]));
  const spine = [...opf.getElementsByTagNameNS("*", "itemref")].map((item) => item.getAttribute("idref"));
  const chapters = [];
  const layoutPages = [];
  const styleSheets = [];
  for (const item of [...opf.getElementsByTagNameNS("*", "item")]) {
    if (item.getAttribute("media-type") !== "text/css") continue;
    const cssEntry = zip.file(resolveZipPath(opfPath, item.getAttribute("href") || ""));
    if (cssEntry) styleSheets.push(await cssEntry.async("string"));
  }
  for (const id of spine) {
    const href = manifest.get(id);
    if (!href) continue;
    const entry = zip.file(resolveZipPath(opfPath, href));
    if (entry) {
      const html = await entry.async("string");
      const inlineStyles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1]);
      styleSheets.push(...inlineStyles);
      const text = htmlToText(html);
      if (text) {
        chapters.push(text);
        layoutPages.push(sanitizeDocumentHtml(html));
      }
    }
  }
  if (!chapters.length) throw new Error("EPUB 中没有找到可读正文");
  return { text: normalizeText(chapters.join("\n\n\n")), originalText: chapters.join("\n\n\n"), readingStyle: extractCssReadingStyle(styleSheets.join("\n")), layoutPages };
}

async function parsePdf(file) {
  let pdfjs;
  try {
    pdfjs = await import("./vendor/pdf.min.mjs");
  } catch (error) {
    throw new Error("PDF 解析需要通过本项目的本地服务器打开页面");
  }
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("./vendor/pdf.worker.min.mjs", window.location.href).href;
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages = [];
  const fontFamilies = [];
  const fontSizes = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    let previousY = null;
    const lines = [];
    let current = "";
    for (const item of content.items) {
      if (item.fontName && content.styles?.[item.fontName]?.fontFamily) fontFamilies.push(content.styles[item.fontName].fontFamily);
      const detectedSize = Math.hypot(item.transform?.[0] || 0, item.transform?.[1] || 0);
      if (detectedSize >= 8 && detectedSize <= 30) fontSizes.push(detectedSize * 1.333);
      const y = item.transform?.[5];
      if (previousY !== null && y !== undefined && Math.abs(y - previousY) > 3) {
        if (current.trim()) lines.push(current.trim());
        current = "";
      }
      current += `${item.str || ""}${item.hasEOL ? "\n" : " "}`;
      previousY = y;
    }
    if (current.trim()) lines.push(current.trim());
    pages.push(lines.join("\n"));
  }
  const defaults = defaultReadingStyle();
  return {
    text: normalizeText(pages.join("\n\n")),
    originalText: pages.join("\n\n"),
    layoutPages: pages.map((page) => `<pre class="real-pre">${escapeHtml(page)}</pre>`),
    readingStyle: {
      ...defaults,
      fontFamily: mostFrequent(fontFamilies) || defaults.fontFamily,
      fontSize: bounded(mostFrequent(fontSizes), 13, 20, defaults.fontSize)
    }
  };
}

async function parseBook(file) {
  const extension = file.name.split(".").pop().toLowerCase();
  if (extension === "txt") {
    const originalText = (await file.text()).replace(/\r\n?/g, "\n");
    return { text: normalizeText(originalText), originalText, readingStyle: defaultReadingStyle(), layoutPages: [`<pre class="real-pre">${escapeHtml(originalText)}</pre>`] };
  }
  if (extension === "docx") return parseDocx(file);
  if (extension === "epub") return parseEpub(file);
  if (extension === "pdf") return parsePdf(file);
  throw new Error("请选择 TXT、PDF、DOCX 或 EPUB 文件");
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("is-visible"), 2600);
}

async function handleFile(file) {
  if (!file) return;
  els.importBook.disabled = true;
  const originalLabel = els.importButtonLabel.textContent;
  els.importButtonLabel.textContent = "正在解析…";
  try {
    const parsedBook = await parseBook(file);
    const text = parsedBook.text;
    if (!text) throw new Error("没有从文件中识别到正文");
    const extension = file.name.split(".").pop().toUpperCase();
    pendingBook = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      title: file.name.replace(/\.[^.]+$/, ""),
      format: extension,
      text,
      readingStyle: parsedBook.readingStyle,
      position: 0,
      createdAt: Date.now(),
      lastReadAt: null
    };
    els.modalBookName.textContent = `${pendingBook.title} · ${pendingBook.format}`;
    els.pageInput.value = "1";
    els.lineInput.value = "1";
    els.positionModal.hidden = false;
    requestAnimationFrame(() => els.pageInput.focus());
  } catch (error) {
    console.error(error);
    showToast(error.message || "文件解析失败，请检查文件后重试");
  } finally {
    els.importBook.disabled = false;
    els.importButtonLabel.textContent = originalLabel;
    els.fileInput.value = "";
  }
}

async function handleDisguiseFile(file) {
  if (!file) return;
  els.uploadDisguise.disabled = true;
  els.uploadDisguise.firstChild.textContent = "正在解析… ";
  try {
    const parsed = await parseBook(file);
    if (!parsed.text) throw new Error("没有从文件中识别到正文");
    realDisguiseDoc = {
      name: file.name,
      format: file.name.split(".").pop().toUpperCase(),
      text: parsed.originalText || parsed.text,
      readingStyle: parsed.readingStyle || defaultReadingStyle(),
      layoutPages: parsed.layoutPages || [`<pre class="real-pre">${escapeHtml(parsed.text)}</pre>`]
    };
    els.realDisguiseName.textContent = `${realDisguiseDoc.name} · 已准备`;
    els.realDisguisePopover.hidden = true;
    showToast("真实伪装文档已准备好");
  } catch (error) {
    console.error(error);
    els.realDisguiseName.textContent = error.message || "文件解析失败，请重试";
    showToast(error.message || "真实伪装文档解析失败");
  } finally {
    els.uploadDisguise.disabled = false;
    els.uploadDisguise.firstChild.textContent = "选择文档 ";
    els.disguiseFileInput.value = "";
  }
}

async function saveImportedPosition(event) {
  event.preventDefault();
  if (!pendingBook) return;
  const page = Math.max(1, Number.parseInt(els.pageInput.value, 10) || 1);
  const line = Math.max(1, Number.parseInt(els.lineInput.value, 10) || 1);
  const desired = ((page - 1) * LINES_PER_PAGE + (line - 1)) * CHARS_PER_LINE;
  pendingBook.position = Math.min(desired, pendingBook.text.length);
  pendingBook.startPage = page;
  pendingBook.startLine = line;
  await putBook(pendingBook);
  books.push(pendingBook);
  localStorage.setItem("moyu-selected-book", pendingBook.id);
  pendingBook = null;
  els.positionModal.hidden = true;
  renderAll();
  showToast("导入成功，阅读位置已保存");
}

function closePositionModal() {
  pendingBook = null;
  els.positionModal.hidden = true;
}

function applyBookReadingStyle(readingStyle) {
  const style = { ...defaultReadingStyle(), ...(readingStyle || {}) };
  const fontFamily = String(style.fontFamily || "PingFang SC").replace(/["'`;{}]/g, "").trim();
  els.wpsPages.style.fontFamily = `"${fontFamily}", "PingFang SC", "Microsoft YaHei", sans-serif`;
  els.wpsPages.style.fontSize = `${bounded(style.fontSize, 13, 20, 15)}px`;
  els.wpsPages.style.lineHeight = String(bounded(style.lineHeight, 1.3, 1.9, 1.56));
  els.wpsPages.style.letterSpacing = `${bounded(style.letterSpacing, 0, 1.6, .45)}px`;
}

function startWpsSession(requestedBookId, requestedWorkspace) {
  const explicitBookId = typeof requestedBookId === "string" ? requestedBookId : "";
  const book = (explicitBookId && books.find((item) => item.id === explicitBookId)) || selectedBook();
  if (!book) {
    showRoute("library");
    return;
  }
  if (els.disguiseSelect.value === "real" && !realDisguiseDoc) {
    els.realDisguisePopover.hidden = false;
    showToast("请先上传真实伪装文档");
    return;
  }
  const allowedWorkspaces = new Set(["word", "mysql", "vscode"]);
  const workspace = allowedWorkspaces.has(requestedWorkspace) ? requestedWorkspace : els.workspaceSelect.value;
  localStorage.setItem("moyu-selected-book", book.id);
  localStorage.setItem("moyu-workspace", workspace);
  book.lastWorkspace = workspace;
  wpsSession = {
    book,
    workspace,
    mode: els.disguiseSelect.value,
    fakeDocument: fakeDocuments[Math.floor(Math.random() * fakeDocuments.length)],
    fakeSqlDocument: fakeSqlDocuments[Math.floor(Math.random() * fakeSqlDocuments.length)],
    fakeCodeDocument: fakeCodeDocuments[Math.floor(Math.random() * fakeCodeDocuments.length)],
    realDocument: els.disguiseSelect.value === "real" ? realDisguiseDoc : null,
    disguise: false,
    novelScrollTop: 0,
    fakeScrollTop: 0
  };
  applyBookReadingStyle(book.readingStyle);
  showRoute(workspace);
  renderReadingSession();
  scheduleBookSave();
  requestAnimationFrame(() => {
    const caretSelector = workspace === "mysql" ? "#mysql-caret" : (workspace === "vscode" ? "#vscode-caret" : "#typing-caret");
    const caret = document.querySelector(caretSelector);
    caret?.scrollIntoView({ block: "center", inline: "nearest" });
    const scrollArea = workspace === "mysql" ? els.mysqlEditorScroll : (workspace === "vscode" ? els.vscodeEditorScroll : els.wpsScroll);
    scrollArea.focus({ preventScroll: true });
  });
}

function paginationMetrics(readingStyle) {
  const style = { ...defaultReadingStyle(), ...(readingStyle || {}) };
  const paperWidth = Math.max(620, Math.min(window.innerWidth * .62, 1240));
  const paperHeight = Math.max(877, Math.min(paperWidth * 1.4143, 1754));
  const contentWidth = paperWidth * .764;
  const contentHeight = paperHeight * .82 - 82;
  const fontSize = bounded(style.fontSize, 13, 20, 15);
  const lineHeight = bounded(style.lineHeight, 1.3, 1.9, 1.56);
  return {
    charsPerLine: Math.max(22, Math.floor(contentWidth / (fontSize + bounded(style.letterSpacing, 0, 1.6, .45)))),
    linesPerPage: Math.max(16, Math.floor(contentHeight / (fontSize * lineHeight)) - 1)
  };
}

function splitTextIntoPages(text, readingStyle) {
  const value = String(text || "");
  if (!value) return [""];
  const { charsPerLine, linesPerPage } = paginationMetrics(readingStyle);
  const pages = [];
  let page = "";
  let line = 0;
  let column = 0;
  for (const character of value) {
    page += character;
    if (character === "\n") {
      line += 1;
      column = 0;
    } else {
      column += /[\x00-\xff]/.test(character) ? .55 : 1;
      if (column >= charsPerLine) {
        line += 1;
        column = 0;
      }
    }
    if (line >= linesPerPage) {
      pages.push(page);
      page = "";
      line = 0;
      column = 0;
    }
  }
  if (page || !pages.length) pages.push(page);
  return pages;
}

function renderPage(text, options = {}) {
  const paper = document.createElement("article");
  paper.className = `wps-paper${options.real ? " real-document-page" : ""}`;
  addPageCropMarks(paper);
  const content = document.createElement("div");
  content.className = "wps-page-content";
  const textNode = document.createElement("span");
  textNode.className = "wps-text";
  textNode.textContent = text;
  content.append(textNode);
  if (options.caret) {
    const caret = document.createElement("span");
    caret.className = "typing-caret";
    caret.id = "typing-caret";
    caret.setAttribute("aria-hidden", "true");
    content.append(caret);
  }
  paper.append(content);
  return paper;
}

function addPageCropMarks(paper) {
  ["top-left", "top-right", "bottom-left", "bottom-right"].forEach((position) => {
    const mark = document.createElement("span");
    mark.className = `page-corner corner-${position}`;
    mark.setAttribute("aria-hidden", "true");
    paper.append(mark);
  });
}

function richDocumentPage(html, offset = 0) {
  const paper = document.createElement("article");
  paper.className = "wps-paper real-document-page";
  addPageCropMarks(paper);
  const content = document.createElement("div");
  content.className = "wps-page-content";
  const flow = document.createElement("div");
  flow.className = "real-document-flow";
  flow.innerHTML = html;
  if (offset) flow.style.transform = `translateY(-${offset}px)`;
  content.append(flow);
  paper.append(content);
  return paper;
}

function renderRichDocument(realDocument) {
  const rendered = [];
  for (const html of realDocument.layoutPages || []) {
    const probe = richDocumentPage(html);
    els.wpsPages.append(probe);
    const content = probe.querySelector(".wps-page-content");
    const flow = probe.querySelector(".real-document-flow");
    const linePixels = bounded(realDocument.readingStyle?.fontSize, 13, 20, 15) * bounded(realDocument.readingStyle?.lineHeight, 1.3, 1.9, 1.56);
    const sliceHeight = Math.max(linePixels, Math.floor(content.clientHeight / linePixels) * linePixels);
    const pageCount = Math.max(1, Math.ceil(flow.scrollHeight / sliceHeight));
    probe.remove();
    for (let index = 0; index < pageCount; index += 1) rendered.push(richDocumentPage(html, index * sliceHeight));
  }
  els.wpsPages.replaceChildren(...(rendered.length ? rendered : [richDocumentPage("")]));
}

function disguiseCurrentPage(novelText, workDocument) {
  const source = [...workDocument.replace(/[^\p{L}\p{N}]/gu, "")];
  const punctuation = /[，。！？；：、“”‘’（）《》〈〉—…,.!?;:'"()[\]{}\-]/;
  let cursor = 0;
  return [...novelText].map((character) => {
    if (/\s/.test(character) || punctuation.test(character)) return character;
    if (!source.length) return "文";
    const replacement = source[cursor % source.length];
    cursor += 1;
    return replacement;
  }).join("");
}

function renderWpsText() {
  if (!wpsSession) return;
  const book = wpsSession.book;
  let pages;
  let displayStyle;
  if (wpsSession.disguise) {
    if (wpsSession.mode === "real") {
      displayStyle = wpsSession.realDocument.readingStyle;
      applyBookReadingStyle(displayStyle);
      els.wpsPages.replaceChildren();
      renderRichDocument(wpsSession.realDocument);
    } else {
      displayStyle = book.readingStyle;
      pages = splitTextIntoPages(book.text.slice(0, book.position), displayStyle)
        .map((page) => disguiseCurrentPage(page, wpsSession.fakeDocument));
    }
  } else {
    displayStyle = book.readingStyle;
    pages = splitTextIntoPages(book.text.slice(0, book.position), displayStyle);
  }
  if (!(wpsSession.disguise && wpsSession.mode === "real")) {
    applyBookReadingStyle(displayStyle);
    els.wpsPages.replaceChildren(...pages.map((page, index) => renderPage(page, {
      caret: !wpsSession.disguise && index === pages.length - 1 && book.position < book.text.length
    })));
  }
  const fullNovelPages = splitTextIntoPages(book.text, book.readingStyle).length;
  const currentPage = splitTextIntoPages(book.text.slice(0, book.position), book.readingStyle).length;
  els.wpsPageIndicator.textContent = `第 ${currentPage} 页，共 ${fullNovelPages} 页`;
  els.wpsWordCount.textContent = `${book.text.slice(0, book.position).replace(/\s/g, "").length} 个字`;
}

function splitSqlSource(text, maxLength = 48) {
  const chunks = [];
  let chunk = "";
  for (const character of String(text || "")) {
    chunk += character;
    if (character === "\n" || [...chunk].length >= maxLength) {
      chunks.push(chunk);
      chunk = "";
    }
  }
  if (chunk || !chunks.length) chunks.push(chunk);
  return chunks;
}

function splitNovelCodeSource(text) {
  const widths = [28, 34, 24, 38, 31, 26, 43, 29, 36, 23, 32, 62];
  const chunks = [];
  let chunk = "";
  let widthIndex = 0;
  let targetWidth = widths[0];
  for (const character of String(text || "")) {
    chunk += character;
    if (character === "\n" || [...chunk].length >= targetWidth) {
      chunks.push(chunk);
      chunk = "";
      widthIndex = (widthIndex + 1) % widths.length;
      targetWidth = widths[widthIndex];
    }
  }
  if (chunk || !chunks.length) chunks.push(chunk);
  return chunks;
}

function sqlToken(className, text) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  return span;
}

function appendSqlLine(number, pieces, caret = false) {
  const line = document.createElement("div");
  line.className = "sql-line";
  const gutter = document.createElement("span");
  gutter.className = "sql-line-number";
  gutter.textContent = String(number);
  const code = document.createElement("span");
  code.className = "sql-line-code";
  pieces.forEach((piece) => code.append(typeof piece === "string" ? document.createTextNode(piece) : piece));
  if (caret) {
    const cursor = document.createElement("span");
    cursor.className = "sql-caret";
    cursor.id = "mysql-caret";
    code.append(cursor);
  }
  line.append(gutter, code);
  els.mysqlCode.append(line);
}

function renderDecoratedSql(sourceText, showCaret) {
  els.mysqlCode.replaceChildren();
  const chunks = splitSqlSource(sourceText);
  let lineNumber = 1;
  chunks.forEach((chunk, index) => {
    const alias = `text_${String(index + 1).padStart(3, "0")}`;
    const prefix = index === 0 ? "" : "    ";
    const pieces = [prefix];
    if (index === 0) pieces.push(sqlToken("sql-keyword", "SELECT"), "\n");
    pieces.push("    ", sqlToken("sql-function", "CONCAT"), "('", sqlToken("sql-string sql-source", chunk), "') ", sqlToken("sql-keyword", "AS"), " ", sqlToken("sql-identifier", alias));
    pieces.push(index === chunks.length - 1 ? "" : ",");
    appendSqlLine(lineNumber++, pieces, showCaret && index === chunks.length - 1);
    if ((index + 1) % 4 === 0 && index < chunks.length - 1) {
      appendSqlLine(lineNumber++, [sqlToken("sql-keyword", "FROM"), " document_archive ", sqlToken("sql-keyword", "AS"), " d"]);
      appendSqlLine(lineNumber++, [sqlToken("sql-keyword", "WHERE"), " d.is_active = 1 ", sqlToken("sql-keyword", "AND"), " d.record_id > 0;"]);
      appendSqlLine(lineNumber++, [sqlToken("sql-comment", "-- continue normalized document stream")]);
      appendSqlLine(lineNumber++, [sqlToken("sql-keyword", "SELECT")]);
    }
  });
}

function highlightedSqlPieces(lineText) {
  const fragment = [];
  const pattern = /(--.*$|'(?:''|[^'])*'|\b(?:SELECT|FROM|WHERE|AS|AND|OR|JOIN|INNER|LEFT|RIGHT|ON|GROUP|BY|ORDER|LIMIT|HAVING|CASE|WHEN|THEN|ELSE|END|IS|NOT|NULL|DESC|ASC|COUNT|SUM|AVG|MAX|MIN|ROUND|CONCAT|DATE_FORMAT|DATE_SUB|CURRENT_DATE|INTERVAL)\b)/gi;
  let cursor = 0;
  for (const match of lineText.matchAll(pattern)) {
    if (match.index > cursor) fragment.push(lineText.slice(cursor, match.index));
    const token = match[0];
    const className = token.startsWith("--") ? "sql-comment" : (token.startsWith("'") ? "sql-string" : (/^(COUNT|SUM|AVG|MAX|MIN|ROUND|CONCAT|DATE_FORMAT|DATE_SUB)$/i.test(token) ? "sql-function" : "sql-keyword"));
    fragment.push(sqlToken(className, token));
    cursor = match.index + token.length;
  }
  if (cursor < lineText.length) fragment.push(lineText.slice(cursor));
  return fragment;
}

function renderRawSql(sqlText) {
  els.mysqlCode.replaceChildren();
  String(sqlText || "").split("\n").forEach((line, index) => appendSqlLine(index + 1, highlightedSqlPieces(line)));
}

function renderMysqlText() {
  if (!wpsSession) return;
  const book = wpsSession.book;
  if (!wpsSession.disguise) {
    renderDecoratedSql(book.text.slice(0, book.position), book.position < book.text.length);
  } else if (wpsSession.mode === "real") {
    renderDecoratedSql(wpsSession.realDocument.text, false);
  } else {
    renderRawSql(wpsSession.fakeSqlDocument);
  }
  const progress = progressOf(book);
  els.mysqlProgress.textContent = `${progress}% · ${book.position} / ${book.text.length} chars`;
}

function appendCodeLine(number, pieces, options = {}) {
  const line = document.createElement("div");
  line.className = `code-line${options.current ? " is-current" : ""}`;
  const gutter = document.createElement("span");
  gutter.className = "code-line-number";
  gutter.textContent = String(number);
  const code = document.createElement("span");
  code.className = "code-line-code";
  pieces.forEach((piece) => code.append(typeof piece === "string" ? document.createTextNode(piece) : piece));
  if (options.caret) {
    const cursor = document.createElement("span");
    cursor.className = "code-caret";
    cursor.id = "vscode-caret";
    code.append(cursor);
  }
  line.append(gutter, code);
  els.vscodeCode.append(line);
}

function codeToken(className, text) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  return span;
}

function renderDecoratedCode(sourceText, showCaret, useNovelLineWidths = false) {
  els.vscodeCode.replaceChildren();
  const chunks = useNovelLineWidths ? splitNovelCodeSource(sourceText) : splitSqlSource(sourceText, 56);
  let line = 1;
  const sourceOptions = (index) => ({ current: showCaret && index === chunks.length - 1, caret: showCaret && index === chunks.length - 1 });
  const sourceString = (chunk) => codeToken("code-string code-source", `\"\"\"${chunk}\"\"\"`);
  appendCodeLine(line++, [codeToken("code-keyword", "from"), " __future__ ", codeToken("code-keyword", "import"), " annotations"]);
  appendCodeLine(line++, [codeToken("code-keyword", "from"), " dataclasses ", codeToken("code-keyword", "import"), " dataclass, field"]);
  appendCodeLine(line++, [codeToken("code-keyword", "from"), " typing ", codeToken("code-keyword", "import"), " Iterator"]);
  appendCodeLine(line++, []);
  appendCodeLine(line++, [codeToken("code-comment", "# Incremental document pipeline used by the editor preview")]);
  appendCodeLine(line++, ["@dataclass"]);
  appendCodeLine(line++, [codeToken("code-keyword", "class"), " ", codeToken("code-built-in", "DocumentPipeline"), ":"]);
  appendCodeLine(line++, ["    ", codeToken("code-variable", "enabled"), ": bool = ", codeToken("code-keyword", "True")]);
  appendCodeLine(line++, ["    ", codeToken("code-variable", "buffer"), ": list[str] = field(default_factory=list)"]);
  appendCodeLine(line++, ["    ", codeToken("code-variable", "errors"), ": list[str] = field(default_factory=list)"]);
  appendCodeLine(line++, []);
  appendCodeLine(line++, ["    ", codeToken("code-keyword", "def"), " ", codeToken("code-function", "normalize"), "(self, value: str) -> str:"]);
  appendCodeLine(line++, ["        ", codeToken("code-keyword", "if"), " value ", codeToken("code-keyword", "is"), " ", codeToken("code-keyword", "None"), ":"]);
  appendCodeLine(line++, ["            ", codeToken("code-keyword", "return"), " ", codeToken("code-string", "\"\"")]);
  appendCodeLine(line++, ["        ", codeToken("code-keyword", "return"), " value"]);
  appendCodeLine(line++, []);
  appendCodeLine(line++, ["    ", codeToken("code-keyword", "def"), " ", codeToken("code-function", "collect"), "(self) -> list[str]:"]);
  chunks.forEach((chunk, index) => {
    const suffix = String(index + 1).padStart(3, "0");
    if (index % 6 === 0) {
      appendCodeLine(line++, ["        ", codeToken("code-comment", `# collect source fragment ${suffix}`)]);
      appendCodeLine(line++, ["        ", codeToken("code-variable", `fragment_${suffix}`), " = ", sourceString(chunk)], sourceOptions(index));
      appendCodeLine(line++, ["        self.buffer.append(", codeToken("code-variable", `fragment_${suffix}`), ")"]);
    } else if (index % 6 === 1) {
      appendCodeLine(line++, ["        ", codeToken("code-keyword", "if"), " self.enabled:"]);
      appendCodeLine(line++, ["            self.buffer.append(", sourceString(chunk), ")"], sourceOptions(index));
    } else if (index % 6 === 2) {
      appendCodeLine(line++, ["        ", codeToken("code-keyword", "for"), " ", codeToken("code-variable", "item"), " ", codeToken("code-keyword", "in"), " [", sourceString(chunk), "]:"], sourceOptions(index));
      appendCodeLine(line++, ["            self.buffer.append(item)"]);
    } else if (index % 6 === 3) {
      appendCodeLine(line++, ["        ", codeToken("code-variable", `record_${suffix}`), " = {", codeToken("code-string", "\"index\""), `: ${index + 1}, `, codeToken("code-string", "\"text\""), ": ", sourceString(chunk), "}"], sourceOptions(index));
      appendCodeLine(line++, ["        self.buffer.append(", codeToken("code-variable", `record_${suffix}`), "[", codeToken("code-string", "\"text\""), "])"]);
    } else if (index % 6 === 4) {
      appendCodeLine(line++, ["        ", codeToken("code-keyword", "try"), ":"]);
      appendCodeLine(line++, ["            ", codeToken("code-variable", "value"), " = self.", codeToken("code-function", "normalize"), "(", sourceString(chunk), ")"], sourceOptions(index));
      appendCodeLine(line++, ["            self.buffer.append(value)"]);
      appendCodeLine(line++, ["        ", codeToken("code-keyword", "except"), " (TypeError, ValueError) ", codeToken("code-keyword", "as"), " error:"]);
      appendCodeLine(line++, ["            self.errors.append(str(error))"]);
    } else {
      appendCodeLine(line++, ["        self.buffer.extend([", sourceString(chunk), ",])"], sourceOptions(index));
    }
  });
  appendCodeLine(line++, ["        ", codeToken("code-keyword", "return"), " self.buffer"]);
  appendCodeLine(line++, []);
  appendCodeLine(line++, [codeToken("code-keyword", "def"), " ", codeToken("code-function", "stream_document"), "() -> Iterator[str]:"]);
  appendCodeLine(line++, ["    ", codeToken("code-variable", "pipeline"), " = DocumentPipeline()"]);
  appendCodeLine(line++, ["    ", codeToken("code-keyword", "for"), " ", codeToken("code-variable", "fragment"), " ", codeToken("code-keyword", "in"), " pipeline.collect():"]);
  appendCodeLine(line++, ["        ", codeToken("code-keyword", "yield"), " fragment"]);
  appendCodeLine(line++, []);
  appendCodeLine(line++, [codeToken("code-keyword", "if"), " __name__ == ", codeToken("code-string", "\"__main__\""), ":"]);
  appendCodeLine(line, ["    ", codeToken("code-function", "print"), "(", codeToken("code-string", "\"\""), ".join(", codeToken("code-function", "stream_document"), "()))"]);
}

function highlightedPythonPieces(lineText) {
  const pieces = [];
  const pattern = /(#.*$|'''(?:[^']|'(?!'')|''(?!'))*'''|"""(?:[^"]|"(?!"")|""(?!"))*"""|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b(?:def|class|return|yield|for|in|if|else|elif|from|import|as|try|except|with|True|False|None|and|or|not|lambda|pass|raise)\b|\b\d+(?:\.\d+)?\b)/g;
  let cursor = 0;
  for (const match of lineText.matchAll(pattern)) {
    if (match.index > cursor) pieces.push(lineText.slice(cursor, match.index));
    const token = match[0];
    const className = token.startsWith("#") ? "code-comment" : (/^["']/.test(token) ? "code-string" : (/^\d/.test(token) ? "code-number" : "code-keyword"));
    pieces.push(codeToken(className, token));
    cursor = match.index + token.length;
  }
  if (cursor < lineText.length) pieces.push(lineText.slice(cursor));
  return pieces;
}

function renderRawCode(codeText) {
  els.vscodeCode.replaceChildren();
  const lines = String(codeText || "").split("\n");
  lines.forEach((line, index) => appendCodeLine(index + 1, highlightedPythonPieces(line), { current: index === lines.length - 1 }));
}

function renderVscodeText() {
  if (!wpsSession) return;
  const book = wpsSession.book;
  if (!wpsSession.disguise) {
    renderDecoratedCode(book.text.slice(0, book.position), book.position < book.text.length, true);
  } else if (wpsSession.mode === "real") {
    renderDecoratedCode(wpsSession.realDocument.text, false);
  } else {
    renderRawCode(wpsSession.fakeCodeDocument);
  }
  const progress = progressOf(book);
  els.vscodeProgress.textContent = `${progress}% · ${book.position} / ${book.text.length} chars`;
}

function renderReadingSession() {
  if (!wpsSession) return;
  if (wpsSession.workspace === "mysql") renderMysqlText();
  else if (wpsSession.workspace === "vscode") renderVscodeText();
  else renderWpsText();
}

function scheduleBookSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    if (!wpsSession) return;
    try { await putBook(wpsSession.book); } catch (error) { console.error(error); }
  }, 100);
}

function typeNovelCharacters() {
  if (!wpsSession || wpsSession.disguise) return;
  const book = wpsSession.book;
  const amount = randomTypingAmount();
  if (book.position >= book.text.length) return;
  book.position = Math.min(book.text.length, book.position + amount);
  book.lastReadAt = Date.now();
  renderReadingSession();
  const caretSelector = wpsSession.workspace === "mysql" ? "#mysql-caret" : (wpsSession.workspace === "vscode" ? "#vscode-caret" : "#typing-caret");
  document.querySelector(caretSelector)?.scrollIntoView({ block: "center", inline: "nearest" });
  showImeCandidates();
  scheduleBookSave();
}

function expandFakeCodeToLines(baseText, targetLineCount) {
  const lines = String(baseText || "").split("\n");
  let batch = 1;
  while (lines.length < targetLineCount) {
    lines.push(
      "",
      `# background task ${String(batch).padStart(2, "0")}`,
      `def process_batch_${String(batch).padStart(2, "0")}(records: list[dict]) -> dict:`,
      "    completed: list[dict] = []",
      "    try:",
      "        for record in records:",
      "            if record.get(\"enabled\", True):",
      "                completed.append({\"id\": record.get(\"id\"), \"status\": \"ready\"})",
      "    except (KeyError, TypeError) as error:",
      "        return {\"ok\": False, \"error\": str(error), \"items\": []}",
      "    return {\"ok\": True, \"items\": completed}",
      ""
    );
    batch += 1;
  }
  return lines.slice(0, Math.max(12, targetLineCount)).join("\n");
}

function expandFakeSqlToLines(baseText, targetLineCount) {
  const lines = String(baseText || "").split("\n");
  let batch = 1;
  while (lines.length < targetLineCount) {
    const suffix = String(batch).padStart(2, "0");
    lines.push(
      "",
      `-- generated activity segment ${suffix}`,
      "SELECT",
      "    e.customer_id AS customer_id,",
      "    COUNT(e.event_id) AS event_count,",
      "    MAX(e.created_at) AS latest_activity",
      `FROM analytics.event_log_${suffix} AS e`,
      "WHERE e.is_active = 1",
      "  AND e.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)",
      "GROUP BY e.customer_id",
      "ORDER BY latest_activity DESC;"
    );
    batch += 1;
  }
  return lines.slice(0, Math.max(12, targetLineCount)).join("\n");
}

function renderedEditorLineCount(codeElement, lineSelector) {
  const style = getComputedStyle(codeElement);
  const lineHeight = Number.parseFloat(style.lineHeight) || 20;
  const padding = (Number.parseFloat(style.paddingTop) || 0) + (Number.parseFloat(style.paddingBottom) || 0);
  const heightBasedCount = Math.round(Math.max(0, codeElement.scrollHeight - padding) / lineHeight);
  return Math.max(codeElement.querySelectorAll(lineSelector).length, heightBasedCount, 12);
}

function prepareBasicDisguiseHeight() {
  if (!wpsSession || wpsSession.mode !== "basic") return;
  if (wpsSession.workspace === "vscode" && !wpsSession.fittedFakeCodeDocument) {
    const target = renderedEditorLineCount(els.vscodeCode, ".code-line");
    wpsSession.fittedFakeCodeDocument = expandFakeCodeToLines(wpsSession.fakeCodeDocument, target);
    wpsSession.fakeCodeDocument = wpsSession.fittedFakeCodeDocument;
  }
  if (wpsSession.workspace === "mysql" && !wpsSession.fittedFakeSqlDocument) {
    const target = renderedEditorLineCount(els.mysqlCode, ".sql-line");
    wpsSession.fittedFakeSqlDocument = expandFakeSqlToLines(wpsSession.fakeSqlDocument, target);
    wpsSession.fakeSqlDocument = wpsSession.fittedFakeSqlDocument;
  }
}

function toggleDisguise() {
  if (!wpsSession) return;
  els.imeCandidateOverlay.hidden = true;
  const scrollArea = wpsSession.workspace === "mysql" ? els.mysqlEditorScroll : (wpsSession.workspace === "vscode" ? els.vscodeEditorScroll : els.wpsScroll);
  if (wpsSession.disguise) {
    wpsSession.fakeScrollTop = scrollArea.scrollTop;
    wpsSession.disguise = false;
    renderReadingSession();
    scrollArea.scrollTop = wpsSession.novelScrollTop;
  } else {
    wpsSession.novelScrollTop = scrollArea.scrollTop;
    prepareBasicDisguiseHeight();
    wpsSession.disguise = true;
    renderReadingSession();
    scrollArea.scrollTop = wpsSession.fakeScrollTop;
  }
}

function endWpsSession() {
  if (!wpsSession) return;
  clearTimeout(saveTimer);
  putBook(wpsSession.book).catch(console.error);
  const index = books.findIndex((book) => book.id === wpsSession.book.id);
  if (index >= 0) books[index] = wpsSession.book;
  wpsSession = null;
  renderAll();
}

document.addEventListener("keydown", (event) => {
  if (!wpsSession || (!document.body.classList.contains("word-mode") && !document.body.classList.contains("mysql-mode") && !document.body.classList.contains("vscode-mode"))) return;
  if (event.key === "Escape") {
    event.preventDefault();
    toggleDisguise();
    return;
  }
  if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    typeNovelCharacters();
  }
});

els.bookSelect.addEventListener("change", () => {
  if (!els.bookSelect.value) return;
  localStorage.setItem("moyu-selected-book", els.bookSelect.value);
  renderHome();
});
els.workspaceSelect.addEventListener("change", () => {
  localStorage.setItem("moyu-workspace", els.workspaceSelect.value);
});
els.disguiseSelect.addEventListener("change", () => {
  if (els.disguiseSelect.value === "real") {
    els.realDisguiseName.textContent = realDisguiseDoc ? `${realDisguiseDoc.name} · 已准备` : "支持 TXT、DOCX、PDF、EPUB";
    els.realDisguisePopover.hidden = false;
  } else {
    els.realDisguisePopover.hidden = true;
  }
});
els.startWork.addEventListener("click", () => startWpsSession());
els.importBook.addEventListener("click", () => els.fileInput.click());
els.fileInput.addEventListener("change", () => handleFile(els.fileInput.files[0]));
els.uploadDisguise.addEventListener("click", () => els.disguiseFileInput.click());
els.disguiseFileInput.addEventListener("change", () => handleDisguiseFile(els.disguiseFileInput.files[0]));
els.realDisguiseClose.addEventListener("click", () => { els.realDisguisePopover.hidden = true; });
els.positionForm.addEventListener("submit", saveImportedPosition);
els.positionCancel.addEventListener("click", closePositionModal);
els.positionModal.addEventListener("click", (event) => { if (event.target === els.positionModal) closePositionModal(); });
els.deleteCancel.addEventListener("click", () => { pendingDeleteId = null; els.deleteModal.hidden = true; });
els.deleteConfirm.addEventListener("click", async () => {
  if (!pendingDeleteId) return;
  const id = pendingDeleteId;
  pendingDeleteId = null;
  els.deleteModal.hidden = true;
  await deleteBook(id);
});
els.deleteModal.addEventListener("click", (event) => { if (event.target === els.deleteModal) { pendingDeleteId = null; els.deleteModal.hidden = true; } });
document.querySelectorAll("[data-library-filter]").forEach((button) => button.addEventListener("click", () => {
  libraryFilter = button.dataset.libraryFilter;
  document.querySelectorAll("[data-library-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
  renderLibrary();
}));
document.querySelectorAll("[data-library-view]").forEach((button) => button.addEventListener("click", () => {
  libraryView = button.dataset.libraryView;
  localStorage.setItem("moyu-library-view", libraryView);
  document.querySelectorAll("[data-library-view]").forEach((item) => item.classList.toggle("is-active", item === button));
  renderLibrary();
}));
els.librarySearch.addEventListener("input", renderLibrary);
els.librarySort.addEventListener("change", renderLibrary);
document.querySelectorAll("[data-ime-style]").forEach((button) => button.addEventListener("click", () => {
  settings.imeStyle = button.dataset.imeStyle;
  localStorage.setItem("moyu-ime-style", settings.imeStyle);
  renderSettings();
  showToast("输入法候选框样式已保存");
}));
document.querySelectorAll("[data-typing-speed]").forEach((button) => button.addEventListener("click", () => {
  settings.typingSpeed = button.dataset.typingSpeed;
  localStorage.setItem("moyu-typing-speed", settings.typingSpeed);
  renderSettings();
  showToast("打字速度已保存");
}));
els.typingPreviewInput.addEventListener("keydown", (event) => {
  if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) return;
  event.preventDefault();
  const source = "窗外的雨声渐渐轻了，他放下手中的书，站起身走到窗前。城市的灯光在雨幕里安静闪烁。";
  const currentLength = Number(els.typingPreviewText.dataset.length || 0);
  const nextLength = Math.min(source.length, currentLength + randomTypingAmount());
  els.typingPreviewText.dataset.length = String(nextLength >= source.length ? 0 : nextLength);
  els.typingPreviewText.textContent = nextLength >= source.length ? source : source.slice(0, nextLength);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".book-menu,.book-menu-trigger")) document.querySelectorAll(".book-menu").forEach((menu) => { menu.hidden = true; });
});
window.addEventListener("pagehide", () => { if (wpsSession) putBook(wpsSession.book).catch(() => {}); });
window.addEventListener("hashchange", () => {
  const route = window.location.hash.slice(1);
  if (route !== "word" && route !== "mysql" && route !== "vscode") showRoute(["library", "settings"].includes(route) ? route : "home");
});
document.addEventListener("scroll", positionImeCandidates, true);
window.addEventListener("resize", () => {
  if (wpsSession) renderReadingSession();
  requestAnimationFrame(positionImeCandidates);
});

async function init() {
  bindRouteButtons();
  const savedWorkspace = localStorage.getItem("moyu-workspace");
  if (["word", "mysql", "vscode"].includes(savedWorkspace)) els.workspaceSelect.value = savedWorkspace;
  try {
    books = await getAllBooks();
  } catch (error) {
    console.error(error);
    showToast("无法打开本地书库，请检查浏览器存储权限");
  }
  renderAll();
  const initialRoute = window.location.hash.slice(1);
  document.querySelectorAll("[data-library-view]").forEach((item) => item.classList.toggle("is-active", item.dataset.libraryView === libraryView));
  showRoute(["library", "settings"].includes(initialRoute) ? initialRoute : "home");
}

init();
