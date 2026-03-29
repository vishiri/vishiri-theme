/**
 * Reorganize Vishiri theme JSON (JSON5-safe for // comments).
 * Does not reorder tokenColors (TextMate precedence); adds section comments only.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import JSON5 from "json5";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const themePath = path.join(__dirname, "..", "themes", "Vishiri Theme-color-theme.json");

const COLOR_ORDER = [
	// Window & focus
	"focusBorder",
	"window.activeBorder",
	"window.inactiveBorder",
	// Editor — core
	"editor.background",
	"editor.foreground",
	"editorUnnecessaryCode.border",
	"editorUnnecessaryCode.opacity",
	// Activity bar
	"activityBar.background",
	"activityBar.foreground",
	"activityBar.inactiveForeground",
	"activityBarBadge.background",
	"activityBarBadge.foreground",
	// Badges & icons
	"badge.background",
	"badge.foreground",
	"icon.foreground",
	// Side bar
	"sideBar.background",
	"sideBar.foreground",
	"sideBarTitle.foreground",
	"sideBarTitle.background",
	"sideBarSectionHeader.foreground",
	"sideBarSectionHeader.background",
	"sideBar.dropBackground",
	// Lists (explorer, SCM, etc.)
	"list.foreground",
	"list.hoverForeground",
	"list.hoverIconForeground",
	"list.activeSelectionForeground",
	"list.inactiveSelectionForeground",
	"list.focusForeground",
	"list.highlightForeground",
	"list.focusHighlightForeground",
	"list.hoverBackground",
	"list.activeSelectionBackground",
	"list.inactiveSelectionBackground",
	"list.focusBackground",
	// Toolbar
	"toolbar.hoverBackground",
	"toolbar.activeBackground",
	"toolbar.hoverOutline",
	// Menus
	"menu.background",
	"menubar.selectionBackground",
	"menu.selectionBackground",
	"menu.separatorBackground",
	// Tabs
	"tab.activeBackground",
	"tab.inactiveBackground",
	"tab.activeModifiedBorder",
	"tab.inactiveModifiedBorder",
	"editorGroupHeader.tabsBackground",
	"editorGroup.border",
	"editorGutter.background",
	"breadcrumb.foreground",
	// Title bar
	"titleBar.activeBackground",
	"titleBar.inactiveBackground",
	// Status bar
	"statusBar.background",
	"statusBar.foreground",
	"statusBar.noFolderBackground",
	"statusBar.noFolderForeground",
	"statusBar.debuggingBackground",
	"statusBar.debuggingForeground",
	"statusBar.debuggingBorder",
	"statusBarItem.remoteBackground",
	"statusBarItem.remoteForeground",
	"statusBarItem.remoteHoverBackground",
	"statusBarItem.remoteHoverForeground",
	"statusBarItem.errorForeground",
	"statusBarItem.warningForeground",
	"statusBarItem.prominentForeground",
	// Panel & terminal
	"panel.background",
	"panel.border",
	"terminal.background",
	// Dropdowns
	"dropdown.background",
	"dropdown.listBackground",
	"dropdown.border",
	"dropdown.foreground",
	// Links & secondary text
	"textLink.foreground",
	"textLink.activeForeground",
	"editorLink.activeForeground",
	"notificationLink.foreground",
	"descriptionForeground",
	// Scrollbars
	"scrollbarSlider.background",
	"scrollbarSlider.hoverBackground",
	"scrollbarSlider.activeBackground",
	// Editor — editing surface
	"editor.lineHighlightBackground",
	"editor.selectionBackground",
	"editor.selectionHighlightBackground",
	"editor.findMatchHighlightBackground",
	"editor.wordHighlightBackground",
	"editor.wordHighlightBorder",
	"editor.wordHighlightStrongBackground",
	"editor.wordHighlightStrongBorder",
	"editorBracketMatch.background",
	"editorBracketMatch.border",
	"editorBracketHighlight.foreground1",
	"editorBracketHighlight.foreground2",
	"editorBracketHighlight.foreground3",
	"editorBracketHighlight.foreground4",
	"editorBracketHighlight.foreground5",
	"editorBracketHighlight.foreground6",
	"editorBracketHighlight.unexpectedBracket.foreground",
	"editorBracketPairGuide.background1",
	"editorBracketPairGuide.background2",
	"editorBracketPairGuide.background3",
	"editorBracketPairGuide.background4",
	"editorBracketPairGuide.background5",
	"editorBracketPairGuide.background6",
	"editorBracketPairGuide.activeBackground1",
	"editorBracketPairGuide.activeBackground2",
	"editorBracketPairGuide.activeBackground3",
	"editorBracketPairGuide.activeBackground4",
	"editorBracketPairGuide.activeBackground5",
	"editorBracketPairGuide.activeBackground6",
	"editorOverviewRuler.border",
	// Overlays & widgets
	"notificationCenterHeader.background",
	"editorWidget.background",
	"editorSuggestWidget.background",
	"editorSuggestWidget.selectedBackground",
	"editorHoverWidget.background",
	"editorHoverWidget.foreground",
	"editorHoverWidget.statusBarBackground",
	// Peek view
	"peekView.border",
	"peekViewTitle.background",
	"peekViewTitleLabel.foreground",
	"peekViewTitleDescription.foreground",
	"peekViewEditor.background",
	"peekViewEditorGutter.background",
	"peekViewResult.background",
	"peekViewEditor.matchHighlightBackground",
	// Chat / agent UI (e.g. +N −M line stats in sidebar)
	"chat.linesAddedForeground",
	"chat.linesRemovedForeground",
	// Git & extensions
	"gitDecoration.addedResourceForeground",
	"gitDecoration.modifiedResourceForeground",
	"gitDecoration.deletedResourceForeground",
	"gitDecoration.renamedResourceForeground",
	"gitDecoration.untrackedResourceForeground",
	"gitlens.openAutolinkedIssueIconColor",
	"gitlens.closedAutolinkedIssueIconColor",
	"gitlens.openPullRequestIconColor",
	"gitlens.closedPullRequestIconColor",
	"gitlens.mergedPullRequestIconColor",
];

const SEMANTIC_ORDER = [
	"type",
	"type.defaultLibrary",
	"interface",
	"typeParameter",
	"variable.defaultLibrary",
	"variable.readonly.defaultLibrary",
	"property.defaultLibrary",
	"property",
	"parameter",
	"function",
	"function.defaultLibrary",
	"function.declaration",
	"method",
	"method.defaultLibrary",
	"method.declaration",
	"class.defaultLibrary",
];

function buildColors(source) {
	const out = {};
	const seen = new Set();
	for (const k of COLOR_ORDER) {
		if (Object.prototype.hasOwnProperty.call(source, k)) {
			out[k] = source[k];
			seen.add(k);
		}
	}
	for (const k of Object.keys(source)) {
		if (!seen.has(k)) out[k] = source[k];
	}
	return out;
}

function buildSemantic(source) {
	const out = {};
	const seen = new Set();
	for (const k of SEMANTIC_ORDER) {
		if (source && Object.prototype.hasOwnProperty.call(source, k)) {
			out[k] = source[k];
			seen.add(k);
		}
	}
	if (source) {
		for (const k of Object.keys(source)) {
			if (!seen.has(k)) out[k] = source[k];
		}
	}
	return out;
}

/**
 * First occurrence of each label (by rule name). Prefix-style matches are avoided
 * so we do not label the shared grammar block as "JavaScript" next to CSS.
 */
const TOKEN_SECTION_RULES = [
	{ name: "Comment", label: "Core / shared syntax" },
	{ name: "CSS Class and Support", label: "CSS property names" },
	{ name: "JSON Key - Level 0", label: "JSON" },
	{ name: "Markdown - Plain", label: "Markdown & markup" },
	{ name: "PHP Functions, Keywords and storage modifiers", label: "PHP" },
	{ name: "VUE component tags", label: "Vue" },
	{ name: "HTML tags", label: "HTML templates" },
	{ name: "CSS source", label: "CSS, SCSS, Sass, Less" },
	{ name: "TS import/export", label: "TypeScript" },
	{ name: "JS classes", label: "JavaScript" },
	{ name: "XML Namespace", label: "XML" },
	{ name: "Console class", label: "Console & misc" },
];

function tokenSectionLabel(name) {
	for (const { name: trigger, label } of TOKEN_SECTION_RULES) {
		if (name === trigger) return label;
	}
	return null;
}

function escapeString(s) {
	return JSON.stringify(s);
}

/** One tokenColors entry, indented for placement inside `"tokenColors": [ ... ]`. */
function formatTokenEntry(rule) {
	const inner = JSON.stringify(rule, null, "\t");
	return inner
		.split("\n")
		.map((line) => "\t\t" + line)
		.join("\n");
}

function formatTheme(theme) {
	const colors = buildColors(theme.colors);
	const semantic = buildSemantic(theme.semanticTokenColors);

	let out = "{\n";
	out += `\t"name": ${escapeString(theme.name)},\n`;
	out += `\t"semanticHighlighting": ${theme.semanticHighlighting},\n`;
	out += `\t"semanticTokenColors": ${JSON.stringify(semantic, null, "\t").replace(/\n/g, "\n\t")},\n`;

	out += `\t"colors": ${JSON.stringify(colors, null, "\t").replace(/\n/g, "\n\t")},\n`;

	out += `\t"tokenColors": [\n`;

	const placedSections = new Set();
	let first = true;
	for (const rule of theme.tokenColors) {
		const label = tokenSectionLabel(rule.name || "");
		if (label && !placedSections.has(label)) {
			placedSections.add(label);
			if (!first) out += ",\n";
			out += `\t\t// --- ${label} ---\n`;
			out += formatTokenEntry(rule);
			first = false;
			continue;
		}
		if (!first) out += ",\n";
		out += formatTokenEntry(rule);
		first = false;
	}
	out += "\n\t]\n";
	out += "}\n";
	return out;
}

const raw = fs.readFileSync(themePath, "utf8");
const theme = JSON5.parse(raw);
const next = formatTheme(theme);
fs.writeFileSync(themePath, next, "utf8");
console.log("Wrote", themePath);
