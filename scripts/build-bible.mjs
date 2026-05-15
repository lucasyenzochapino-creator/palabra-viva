import fs from 'node:fs/promises';
import path from 'node:path';
import AdmZip from 'adm-zip';

const SOURCE_URL = 'https://ebible.org/Scriptures/spaRV1909_usfm.zip';
const OUT_DIR = path.resolve('public');
const OUT_FILE = path.join(OUT_DIR, 'bible.rv1909.json');

const BOOK_ORDER = [
  'GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA','1KI','2KI','1CH','2CH','EZR','NEH','EST','JOB','PSA','PRO','ECC','SNG','ISA','JER','LAM','EZK','DAN','HOS','JOL','AMO','OBA','JON','MIC','NAM','HAB','ZEP','HAG','ZEC','MAL','MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO','GAL','EPH','PHP','COL','1TH','2TH','1TI','2TI','TIT','PHM','HEB','JAS','1PE','2PE','1JN','2JN','3JN','JUD','REV'
];

const BOOK_NAMES = {
  GEN:'Génesis', EXO:'Éxodo', LEV:'Levítico', NUM:'Números', DEU:'Deuteronomio', JOS:'Josué', JDG:'Jueces', RUT:'Rut',
  '1SA':'1 Samuel', '2SA':'2 Samuel', '1KI':'1 Reyes', '2KI':'2 Reyes', '1CH':'1 Crónicas', '2CH':'2 Crónicas', EZR:'Esdras', NEH:'Nehemías', EST:'Ester', JOB:'Job', PSA:'Salmos', PRO:'Proverbios', ECC:'Eclesiastés', SNG:'Cantares', ISA:'Isaías', JER:'Jeremías', LAM:'Lamentaciones', EZK:'Ezequiel', DAN:'Daniel', HOS:'Oseas', JOL:'Joel', AMO:'Amós', OBA:'Abdías', JON:'Jonás', MIC:'Miqueas', NAM:'Nahum', HAB:'Habacuc', ZEP:'Sofonías', HAG:'Hageo', ZEC:'Zacarías', MAL:'Malaquías',
  MAT:'Mateo', MRK:'Marcos', LUK:'Lucas', JHN:'Juan', ACT:'Hechos', ROM:'Romanos', '1CO':'1 Corintios', '2CO':'2 Corintios', GAL:'Gálatas', EPH:'Efesios', PHP:'Filipenses', COL:'Colosenses', '1TH':'1 Tesalonicenses', '2TH':'2 Tesalonicenses', '1TI':'1 Timoteo', '2TI':'2 Timoteo', TIT:'Tito', PHM:'Filemón', HEB:'Hebreos', JAS:'Santiago', '1PE':'1 Pedro', '2PE':'2 Pedro', '1JN':'1 Juan', '2JN':'2 Juan', '3JN':'3 Juan', JUD:'Judas', REV:'Apocalipsis'
};

function cleanText(raw) {
  return raw
    .replace(/\\f[\s\S]*?\\f\*/g, ' ')
    .replace(/\\x[\s\S]*?\\x\*/g, ' ')
    .replace(/\\w\s+([^|\\]+)\|[^\\]*?\\w\*/g, '$1')
    .replace(/\\\+?w\s+([^|\\]+)\|[^\\]*?\\\+?w\*/g, '$1')
    .replace(/\|strong="[^"]*"/g, '')
    .replace(/\|lemma="[^"]*"/g, '')
    .replace(/\|morph="[^"]*"/g, '')
    .replace(/\|x-[^=]+="[^"]*"/g, '')
    .replace(/\\[a-zA-Z0-9+]+\*?/g, ' ')
    .replace(/\s*\|\s*/g, ' ')
    .replace(/\s+([,.;:?!])/g, '$1')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function parseUSFM(code, text) {
  const lines = text.replace(/\r/g, '').split('\n');
  const book = {
    code,
    bookName: BOOK_NAMES[code] || code,
    testament: BOOK_ORDER.indexOf(code) < 39 ? 'Antiguo Testamento' : 'Nuevo Testamento',
    chapters: []
  };
  let chapter = null;
  let currentVerse = null;

  function finishVerse() {
    if (!chapter || !currentVerse) return;
    const cleaned = cleanText(currentVerse.text);
    if (cleaned && !/strong="|lemma="|morph="/.test(cleaned)) {
      chapter.verses.push({ verse: currentVerse.verse, text: cleaned });
    } else if (cleaned) {
      chapter.verses.push({ verse: currentVerse.verse, text: cleanText(cleaned) });
    }
    currentVerse = null;
  }

  for (const line of lines) {
    const c = line.match(/^\\c\s+(\d+)/);
    if (c) {
      finishVerse();
      chapter = { chapter: Number(c[1]), verses: [] };
      book.chapters.push(chapter);
      continue;
    }

    const v = line.match(/^\\v\s+(\d+)(?:[-–]\d+)?\s*(.*)$/);
    if (v && chapter) {
      finishVerse();
      currentVerse = { verse: Number(v[1]), text: v[2] || '' };
      continue;
    }

    if (currentVerse && !line.startsWith('\\c ') && !line.startsWith('\\id ') && !line.startsWith('\\toc') && !line.startsWith('\\h ')) {
      currentVerse.text += ' ' + line;
    }
  }
  finishVerse();
  return book;
}

async function main() {
  try {
    console.log('Descargando RV1909 desde eBible...');
    const res = await fetch(SOURCE_URL);
    if (!res.ok) throw new Error(`No se pudo descargar ${SOURCE_URL}: ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries().filter(e => !e.isDirectory && /\.(usfm|sfm|SFM|USFM)$/i.test(e.entryName));

    const books = [];
    for (const entry of entries) {
      const text = entry.getData().toString('utf8');
      const id = text.match(/^\\id\s+([1-3]?[A-Z]{2,3})/m);
      const fallback = entry.entryName.toUpperCase().match(/([1-3]?[A-Z]{2,3})/);
      const code = id?.[1] || fallback?.[1];
      if (!code || !BOOK_ORDER.includes(code)) continue;
      const book = parseUSFM(code, text);
      if (book.chapters.length) books.push(book);
    }

    books.sort((a, b) => BOOK_ORDER.indexOf(a.code) - BOOK_ORDER.indexOf(b.code));
    if (books.length < 66) console.warn(`Advertencia: se generaron ${books.length} libros.`);

    await fs.mkdir(OUT_DIR, { recursive: true });
    await fs.writeFile(OUT_FILE, JSON.stringify({ source: SOURCE_URL, license: 'Public Domain', generatedAt: new Date().toISOString(), books }, null, 0));
    console.log(`Biblia RV1909 generada: ${books.length} libros en ${OUT_FILE}`);
  } catch (error) {
    console.warn('No se pudo generar bible.rv1909.json. Se usará base curada.', error.message);
    await fs.mkdir(OUT_DIR, { recursive: true });
    await fs.writeFile(OUT_FILE, JSON.stringify({ source: SOURCE_URL, license: 'Public Domain', generatedAt: new Date().toISOString(), books: [] }));
  }
}

main();
