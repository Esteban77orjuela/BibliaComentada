// Migración v5: re-parsea segmentos con HTML crudo (etiquetas anidadas) en los comentarios
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, '..', 'assets', 'bible.db');

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/\u200B|\u200C|\u200D/g, '');
}

function parseInlineRec(text) {
  const segments = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] !== '<') {
      const nextIdx = text.indexOf('<', i);
      const chunk = nextIdx !== -1 ? text.slice(i, nextIdx) : text.slice(i);
      if (chunk) segments.push(chunk);
      i = nextIdx !== -1 ? nextIdx : text.length;
      continue;
    }
    const closeIdx = text.indexOf('>', i);
    if (closeIdx === -1) { segments.push(text.slice(i)); break; }
    const raw = text.slice(i + 1, closeIdx);
    const tagName = raw.split(/\s/)[0].toLowerCase();

    if (tagName === 'strong' || tagName === 'b') {
      const endTag = `</${tagName}>`;
      const end = text.indexOf(endTag, closeIdx + 1);
      const inner = end !== -1 ? text.slice(closeIdx + 1, end) : text.slice(closeIdx + 1);
      const parsed = cleanSegments(parseInlineRec(decodeEntities(inner)));
      if (parsed.length === 1 && typeof parsed[0] === 'string') {
        segments.push(['b', parsed[0]]);
      } else if (parsed.length > 0) {
        segments.push(['b', parsed]);
      }
      i = end !== -1 ? end + endTag.length : text.length;
      continue;
    }
    if (tagName === 'em' || tagName === 'i') {
      const endTag = `</${tagName}>`;
      const end = text.indexOf(endTag, closeIdx + 1);
      const inner = end !== -1 ? text.slice(closeIdx + 1, end) : text.slice(closeIdx + 1);
      const parsed = cleanSegments(parseInlineRec(decodeEntities(inner)));
      if (parsed.length === 1 && typeof parsed[0] === 'string') {
        segments.push(['i', parsed[0]]);
      } else if (parsed.length > 0) {
        segments.push(['i', parsed]);
      }
      i = end !== -1 ? end + endTag.length : text.length;
      continue;
    }
    if (tagName === 'br') {
      segments.push('\n');
      i = closeIdx + 1;
      continue;
    }
    // etiqueta desconocida: omitir la etiqueta pero conservar el contenido
    i = closeIdx + 1;
  }
  return segments;
}

function cleanSegments(segs) {
  const out = [];
  for (const s of segs) {
    if (typeof s === 'string') {
      if (!s.trim()) continue;
      out.push(s);
    } else {
      const inner = s[1];
      const isEmpty = Array.isArray(inner) ? inner.length === 0 : !inner.trim();
      if (isEmpty) continue;
      out.push(s);
    }
  }
  const merged = [];
  for (const s of out) {
    const last = merged[merged.length - 1];
    if (typeof s === 'string' && typeof last === 'string') {
      merged[merged.length - 1] = last + s;
    } else if (Array.isArray(s) && Array.isArray(last) && last[0] === s[0]) {
      const prevInner = last[1];
      const curInner = s[1];
      merged[merged.length - 1] = [s[0], prevInner + (typeof curInner === 'string' ? curInner : '')];
    } else {
      merged.push(s);
    }
  }
  return merged;
}

function fixParagraph(paragraph) {
  if (!Array.isArray(paragraph)) return paragraph;
  const out = [];
  for (const seg of paragraph) {
    if (typeof seg === 'string') {
      if (seg.indexOf('<') !== -1) {
        const parsed = cleanSegments(parseInlineRec(decodeEntities(seg)));
        out.push(...parsed);
      } else {
        out.push(seg);
      }
    } else if (Array.isArray(seg) && typeof seg[1] === 'string' && seg[1].indexOf('<') !== -1) {
      const parsed = cleanSegments(parseInlineRec(decodeEntities(seg[1])));
      if (parsed.length === 1 && typeof parsed[0] === 'string') {
        out.push([seg[0], parsed[0]]);
      } else if (parsed.length > 0) {
        out.push([seg[0], parsed]);
      }
    } else {
      out.push(seg);
    }
  }
  return cleanSegments(out);
}

function fixCommentJson(jsonText) {
  try {
    const parsed = JSON.parse(jsonText);
    if (!Array.isArray(parsed)) return jsonText;
    const fixed = parsed.map(p => (Array.isArray(p) ? fixParagraph(p) : p));
    return JSON.stringify(fixed);
  } catch {
    return jsonText;
  }
}

async function main() {
  const SQL = await initSqlJs();
  const db = new SQL.Database(fs.readFileSync(DB_PATH));

  let fixedComments = 0;
  let fixedRanges = 0;

  for (const table of ['comments', 'range_comments']) {
    const rows = db.exec(`SELECT id, text FROM ${table}`);
    if (!rows.length) continue;
    for (const [id, text] of rows[0].values) {
      if (text.indexOf('<') === -1) continue;
      const newText = fixCommentJson(text);
      if (newText !== text) {
        db.run(`UPDATE ${table} SET text = ? WHERE id = ?`, [newText, id]);
        if (table === 'comments') fixedComments++;
        else fixedRanges++;
      }
    }
  }

  db.run("INSERT OR REPLACE INTO _metadata (key, value) VALUES ('db_version', '5')");
  const today = new Date().toISOString().split('T')[0];
  db.run('INSERT OR REPLACE INTO _metadata (key, value) VALUES (?, ?)', ['updated_at', today]);

  const outBuffer = Buffer.from(db.export());
  fs.writeFileSync(DB_PATH, outBuffer);

  const remaining = db.exec("SELECT COUNT(*) FROM comments WHERE text LIKE '%<%'");
  const rRemaining = db.exec("SELECT COUNT(*) FROM range_comments WHERE text LIKE '%<%'");
  const v = db.exec("SELECT value FROM _metadata WHERE key = 'db_version'");
  console.log(`Fixed comments: ${fixedComments}, fixed ranges: ${fixedRanges}`);
  console.log(`Comments con HTML crudo restantes: ${remaining[0].values[0][0]}`);
  console.log(`Ranges con HTML crudo restantes: ${rRemaining[0].values[0][0]}`);
  console.log(`DB version: ${v[0].values[0][0]}`);
  console.log(`DB size: ${(outBuffer.length / 1024 / 1024).toFixed(1)} MB`);
  db.close();
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
