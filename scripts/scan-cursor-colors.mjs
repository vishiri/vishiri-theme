import fs from "fs";

const cssPath =
	"C:/Users/xfeni/AppData/Local/Programs/Cursor/resources/app/out/vs/workbench/workbench.desktop.main.css";
const s = fs.readFileSync(cssPath, "utf8");
const re = /--vscode-([a-zA-Z0-9.-]+)/g;
const out = new Set();
let m;
while ((m = re.exec(s))) {
	const id = m[1].replace(/-/g, ".");
	if (/composer|Composer|agent|Agent/i.test(id)) out.add(id);
}
console.log([...out].sort().join("\n"));
