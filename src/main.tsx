import React from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpen, CalendarDays, Cross, Heart, Home, MessageCircle, Moon, Route, Save, Search, Settings, Share2, ShieldCheck, Sparkles, Sun } from 'lucide-react';
import './styles.css';

type Tab = 'hoy' | 'biblia' | 'sentir' | 'empezar' | 'planes' | 'buscar' | 'oracion' | 'guardado' | 'ajustes' | 'compartir';
type Testament = 'Antiguo Testamento' | 'Nuevo Testamento';
type Theme = 'dark' | 'light' | 'sepia';
type Verse = { id?: string; book: string; chapter: number; verse: number; text: string; testament?: string; theme?: string[] };
type BibleBook = { code?: string; bookName: string; testament: string; chapters: { chapter: number; verses: { verse: number; text: string }[] }[] };
type Note = { verseId: string; text: string; updatedAt: string };

type MoodMatch = {
  id: string;
  name: string;
  keys: string[];
  verseIds: string[];
  note: string;
  prayer: string;
  action: string;
};

const OLD_TESTAMENT = ['Génesis','Éxodo','Levítico','Números','Deuteronomio','Josué','Jueces','Rut','1 Samuel','2 Samuel','1 Reyes','2 Reyes','1 Crónicas','2 Crónicas','Esdras','Nehemías','Ester','Job','Salmos','Proverbios','Eclesiastés','Cantares','Isaías','Jeremías','Lamentaciones','Ezequiel','Daniel','Oseas','Joel','Amós','Abdías','Jonás','Miqueas','Nahum','Habacuc','Sofonías','Hageo','Zacarías','Malaquías'];
const NEW_TESTAMENT = ['Mateo','Marcos','Lucas','Juan','Hechos','Romanos','1 Corintios','2 Corintios','Gálatas','Efesios','Filipenses','Colosenses','1 Tesalonicenses','2 Tesalonicenses','1 Timoteo','2 Timoteo','Tito','Filemón','Hebreos','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan','3 Juan','Judas','Apocalipsis'];

const curated: Verse[] = [
  { id:'sal-23-1', book:'Salmos', chapter:23, verse:1, text:'Jehová es mi pastor; nada me faltará.', testament:'Antiguo Testamento', theme:['paz','cuidado','agradecido'] },
  { id:'sal-27-1', book:'Salmos', chapter:27, verse:1, text:'Jehová es mi luz y mi salvación: ¿de quién temeré?', testament:'Antiguo Testamento', theme:['miedo','protección','valentía'] },
  { id:'sal-34-18', book:'Salmos', chapter:34, verse:18, text:'Cercano está Jehová á los quebrantados de corazón.', testament:'Antiguo Testamento', theme:['tristeza','duelo','soledad'] },
  { id:'sal-46-1', book:'Salmos', chapter:46, verse:1, text:'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.', testament:'Antiguo Testamento', theme:['miedo','protección','ansiedad'] },
  { id:'prov-3-5', book:'Proverbios', chapter:3, verse:5, text:'Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.', testament:'Antiguo Testamento', theme:['dirección','decisión','sabiduría'] },
  { id:'isa-41-10', book:'Isaías', chapter:41, verse:10, text:'No temas, porque yo soy contigo; no desmayes, porque yo soy tu Dios.', testament:'Antiguo Testamento', theme:['miedo','soledad','ánimo'] },
  { id:'mat-6-34', book:'Mateo', chapter:6, verse:34, text:'Así que, no os congojéis por el día de mañana.', testament:'Nuevo Testamento', theme:['ansiedad','futuro','preocupación'] },
  { id:'mat-11-28', book:'Mateo', chapter:11, verse:28, text:'Venid á mí todos los que estáis trabajados y cargados, que yo os haré descansar.', testament:'Nuevo Testamento', theme:['cansancio','descanso','ansiedad'] },
  { id:'juan-3-16', book:'Juan', chapter:3, verse:16, text:'Porque de tal manera amó Dios al mundo, que ha dado á su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.', testament:'Nuevo Testamento', theme:['jesús','evangelio','empezar','amor'] },
  { id:'juan-14-6', book:'Juan', chapter:14, verse:6, text:'Jesús le dice: Yo soy el camino, y la verdad, y la vida: nadie viene al Padre, sino por mí.', testament:'Nuevo Testamento', theme:['jesús','camino','empezar','dirección'] },
  { id:'juan-14-27', book:'Juan', chapter:14, verse:27, text:'La paz os dejo, mi paz os doy: no como el mundo la da, yo os la doy.', testament:'Nuevo Testamento', theme:['paz','ansiedad','miedo'] },
  { id:'rom-8-28', book:'Romanos', chapter:8, verse:28, text:'Y sabemos que á los que á Dios aman, todas las cosas les ayudan á bien.', testament:'Nuevo Testamento', theme:['esperanza','proceso','duelo'] },
  { id:'rom-12-2', book:'Romanos', chapter:12, verse:2, text:'Y no os conforméis á este siglo; mas reformaos por la renovación de vuestro entendimiento.', testament:'Nuevo Testamento', theme:['jóvenes','propósito','cambio'] },
  { id:'2cor-5-17', book:'2 Corintios', chapter:5, verse:17, text:'De modo que si alguno está en Cristo, nueva criatura es.', testament:'Nuevo Testamento', theme:['nuevo','culpa','empezar'] },
  { id:'fil-4-6', book:'Filipenses', chapter:4, verse:6, text:'Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración y ruego.', testament:'Nuevo Testamento', theme:['ansiedad','oración','paz'] },
  { id:'1tim-4-12', book:'1 Timoteo', chapter:4, verse:12, text:'Ninguno tenga en poco tu juventud; pero sé ejemplo de los fieles.', testament:'Nuevo Testamento', theme:['jóvenes','identidad','propósito'] },
  { id:'1ped-5-7', book:'1 Pedro', chapter:5, verse:7, text:'Echando toda vuestra solicitud en él, porque él tiene cuidado de vosotros.', testament:'Nuevo Testamento', theme:['ansiedad','cuidado','soledad'] },
  { id:'1juan-1-9', book:'1 Juan', chapter:1, verse:9, text:'Si confesamos nuestros pecados, él es fiel y justo para que nos perdone nuestros pecados.', testament:'Nuevo Testamento', theme:['perdón','culpa','empezar'] }
];

const moods: MoodMatch[] = [
  { id:'ansiedad', name:'Ansiedad', keys:['ansioso','ansiedad','preocupado','preocupada','nervioso','nerviosa','estresado','estresada','inquieto','inquieta','angustia','angustiado','angustiada'], verseIds:['fil-4-6','mat-6-34','1ped-5-7'], note:'No tenés que cargar todo el futuro hoy. Empezá por entregarle a Dios lo que no podés controlar.', prayer:'Señor, ordená mi mente y dame paz para este momento.', action:'Respirá lento, nombrá lo que te preocupa y orá una frase simple.' },
  { id:'miedo', name:'Miedo', keys:['miedo','temor','asustado','asustada','pánico','panico','inseguro','insegura'], verseIds:['isa-41-10','sal-27-1','sal-46-1'], note:'El miedo puede hablar fuerte, pero no tiene la última palabra sobre tu vida.', prayer:'Dios, acompañame y ayudame a no caminar dominado por el miedo.', action:'Mandale un mensaje a alguien de confianza. No te aísles.' },
  { id:'tristeza', name:'Tristeza o soledad', keys:['triste','tristeza','llorar','dolor','duelo','vacío','vacio','solo','sola','deprimido','deprimida','abandonado','abandonada'], verseIds:['sal-34-18','rom-8-28','juan-14-27'], note:'Dios no desprecia tu dolor. No tenés que fingir que estás bien para acercarte a Él.', prayer:'Señor, acercate a mi corazón y sosteneme hoy.', action:'Hablá con una persona segura. No cargues esto solo.' },
  { id:'cansancio', name:'Cansancio', keys:['cansado','cansada','agotado','agotada','sin fuerzas','quemado','quemada','fundido','fundida'], verseIds:['mat-11-28','sal-23-1','fil-4-6'], note:'Jesús no te pide aparentar fuerza. Te invita a descansar en Él.', prayer:'Señor, renová mis fuerzas y enseñame a parar a tiempo.', action:'Hacé una pausa de cinco minutos sin pantalla.' },
  { id:'culpa', name:'Culpa o perdón', keys:['culpa','culpable','fallé','falle','pecado','perdón','perdon','arrepentido','arrepentida'], verseIds:['1juan-1-9','2cor-5-17','juan-3-16'], note:'Dios no te llama para destruirte, sino para levantarte y corregir el camino.', prayer:'Dios, ayudame a pedir perdón, reparar y empezar de nuevo.', action:'Elegí una acción concreta para corregir lo que puedas corregir.' },
  { id:'direccion', name:'Dirección', keys:['decisión','decision','decidir','no sé qué hacer','no se que hacer','dirección','direccion','confundido','confundida','duda','dudas'], verseIds:['prov-3-5','juan-14-6','rom-12-2'], note:'No todas las respuestas llegan juntas. A veces Dios guía paso a paso.', prayer:'Señor, dame sabiduría para elegir bien.', action:'Anotá la decisión, pedí consejo sabio y no actúes por impulso.' },
  { id:'agradecido', name:'Agradecimiento', keys:['agradecido','agradecida','gracias','feliz','contento','contenta','bendecido','bendecida'], verseIds:['sal-23-1','rom-8-28','1tim-4-12'], note:'La gratitud también es una forma de fe: reconocer que no caminaste solo.', prayer:'Gracias, Dios, por sostenerme y acompañarme.', action:'Compartí una palabra de ánimo con alguien.' },
  { id:'empezar', name:'Acercarme a Jesús', keys:['lejos de dios','no conozco a dios','no conozco a jesus','jesús','jesus','fe','creer','empezar','dios'], verseIds:['juan-14-6','juan-3-16','2cor-5-17'], note:'No necesitás entender todo para dar el primer paso. Empezá con una oración honesta.', prayer:'Dios, si sos real, quiero conocerte. Guiame hacia Jesús.', action:'Leé Juan 3 y después Juan 14, sin apuro.' }
];

const startPath = [
  { day:1, title:'Dios te ama', reading:'Juan 3', idea:'El punto de partida no es tu perfección, sino el amor de Dios.' },
  { day:2, title:'Jesús es el camino', reading:'Juan 14', idea:'Jesús no se presenta solo como maestro, sino como camino hacia el Padre.' },
  { day:3, title:'Una nueva vida', reading:'2 Corintios 5', idea:'Acercarse a Dios también es empezar de nuevo.' },
  { day:4, title:'Entregar la ansiedad', reading:'Filipenses 4', idea:'Orar es llevarle a Dios lo que pesa.' },
  { day:5, title:'Perdón real', reading:'1 Juan 1', idea:'Dios no tapa el pecado; lo perdona y limpia al que vuelve.' },
  { day:6, title:'Propósito joven', reading:'1 Timoteo 4', idea:'Tu edad no te descalifica para vivir con fe y ejemplo.' },
  { day:7, title:'Caminar con paz', reading:'Salmos 23', idea:'Dios acompaña el camino, no solo el inicio.' }
];

const plans = [
  { id:'empezar7', title:'7 días para empezar con Jesús', days:startPath.map(d => d.reading) },
  { id:'jovenes14', title:'14 días para jóvenes con propósito', days:['1 Timoteo 4','Romanos 12','Filipenses 4','Proverbios 3'] },
  { id:'ansiedad7', title:'7 días para bajar la ansiedad', days:['Mateo 6','Filipenses 4','1 Pedro 5','Juan 14'] },
  { id:'nt90', title:'Nuevo Testamento en 90 días', days:['Mateo 1','Mateo 2','Mateo 3','Juan 1'] },
  { id:'salmos30', title:'Salmos en 30 días', days:['Salmos 1','Salmos 23','Salmos 46','Salmos 91'] }
];

const prayers = [
  ['Primera oración','Dios, no sé todo, pero quiero acercarme. Mostrame quién sos y guiame paso a paso.'],
  ['Paz mental','Señor, calmá mis pensamientos y ayudame a vivir este día con claridad.'],
  ['Familia','Dios, cuidá mi casa, saná lo que duele y enseñanos a escucharnos.'],
  ['Perdón','Señor, dame humildad para reconocer errores y fuerza para cambiar.'],
  ['Antes de dormir','Señor, dejo este día en tus manos. Dame descanso, paz y una mente tranquila.']
];

function useLocal<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(() => { try { return JSON.parse(localStorage.getItem(key) || '') as T; } catch { return initial; } });
  React.useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue] as const;
}
function normalize(s: string) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim(); }
function dayOfYear() { const now = new Date(); const start = new Date(now.getFullYear(), 0, 0); return Math.floor((Number(now) - Number(start)) / 86400000); }
function vid(v: Verse) { return v.id || `${v.book}-${v.chapter}-${v.verse}`; }
function canonicalIndex(bookName: string) { const old = OLD_TESTAMENT.indexOf(bookName); if (old >= 0) return old; const nt = NEW_TESTAMENT.indexOf(bookName); if (nt >= 0) return 100 + nt; return 999; }
function firstVerse(ids: string[]) { return ids.map(id => curated.find(v => v.id === id)).find(Boolean) || curated[0]; }
function interpretMood(text: string, fallback = moods[0]) { const input = normalize(text); if (!input) return fallback; return moods.find(m => m.keys.some(k => input.includes(normalize(k)))) || fallback; }
function Card({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) { return <section className={`card ${className}`} onClick={onClick}>{children}</section>; }
function Button({ children, onClick, variant = 'primary' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost' }) { return <button className={`btn ${variant}`} onClick={onClick}>{children}</button>; }
function VerseCard({ verse, onSave, saved, onNote }: { verse: Verse; onSave: () => void; saved: boolean; onNote?: () => void }) {
  const share = () => { const text = `${verse.book} ${verse.chapter}:${verse.verse}\n\n${verse.text}\n\nCompartido desde Palabra Viva`; navigator.share ? navigator.share({ title: `${verse.book} ${verse.chapter}:${verse.verse}`, text }) : navigator.clipboard.writeText(text).then(() => alert('Versículo copiado')); };
  return <Card><p className="ref">{verse.book} {verse.chapter}:{verse.verse}</p><p className="verse">“{verse.text}”</p><div className="row wrap"><Button variant={saved ? 'ghost' : 'primary'} onClick={onSave}><Save size={16}/> {saved ? 'Guardado' : 'Guardar'}</Button><Button variant="ghost" onClick={share}><Share2 size={16}/> Compartir</Button>{onNote && <Button variant="ghost" onClick={onNote}>Nota</Button>}</div></Card>;
}
function MoodBox({ value, setValue, result, setResult }: { value: string; setValue: (v:string)=>void; result: MoodMatch; setResult: (m:MoodMatch)=>void }) {
  const verse = firstVerse(result.verseIds);
  const run = (text = value) => setResult(interpretMood(text, result));
  return <Card className="moodBox"><p className="ref">Sentir</p><h3>¿Cómo te sentís hoy?</h3><p className="soft">Escribilo con tus palabras y la app te muestra una palabra para ese momento.</p><textarea className="moodInput" rows={3} value={value} onChange={e => setValue(e.target.value)} placeholder="Ej: me siento ansioso, cansado, triste, lejos de Dios..."/><div className="chips moodChips">{moods.slice(0,6).map(m => <button className="chip" key={m.id} onClick={() => { setValue(m.name); setResult(m); }}>{m.name}</button>)}</div><Button onClick={() => run()}>Buscar mi palabra</Button><div className="moodResult"><p className="ref">{verse.book} {verse.chapter}:{verse.verse}</p><h3>{result.name}</h3><p className="verse">“{verse.text}”</p><p>{result.note}</p><p><strong>Oración:</strong> {result.prayer}</p><p><strong>Acción pequeña:</strong> {result.action}</p></div></Card>;
}

function App() {
  const [tab, setTab] = React.useState<Tab>('hoy');
  const [theme, setTheme] = useLocal<Theme>('pv-theme', 'dark');
  const [font, setFont] = useLocal('pv-font', 18);
  const [saved, setSaved] = useLocal<string[]>('pv-saved', []);
  const [notes, setNotes] = useLocal<Note[]>('pv-notes', []);
  const [progress, setProgress] = useLocal<Record<string, string[]>>('pv-progress', {});
  const [startDone, setStartDone] = useLocal<number[]>('pv-start-done', []);
  const [query, setQuery] = React.useState('');
  const [bibleQuery, setBibleQuery] = React.useState('');
  const [moodText, setMoodText] = React.useState('');
  const [moodResult, setMoodResult] = React.useState<MoodMatch>(moods[0]);
  const [bible, setBible] = React.useState<BibleBook[]>([]);
  const [testament, setTestament] = React.useState<Testament>('Nuevo Testamento');
  const [bookName, setBookName] = React.useState('Juan');
  const [chapter, setChapter] = React.useState(3);
  const [bibleStatus, setBibleStatus] = React.useState('Cargando Biblia...');
  const todayVerse = curated[dayOfYear() % curated.length];

  React.useEffect(() => { document.body.dataset.theme = theme; document.documentElement.style.setProperty('--font-size', `${font}px`); if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => undefined); }, [theme, font]);
  React.useEffect(() => { let cancelled = false; fetch('/bible.rv1909.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject()).then(data => { if (cancelled) return; const books: BibleBook[] = Array.isArray(data.books) ? data.books.filter((b: BibleBook) => b.bookName && Array.isArray(b.chapters)).sort((a: BibleBook,b:BibleBook) => canonicalIndex(a.bookName)-canonicalIndex(b.bookName)) : []; setBible(books); if (books.length) { const john = books.find(b => normalize(b.bookName)==='juan') || books.find(b => b.testament === 'Nuevo Testamento') || books[0]; setBookName(john.bookName); setTestament(john.testament === 'Antiguo Testamento' ? 'Antiguo Testamento' : 'Nuevo Testamento'); setChapter(john.chapters[2]?.chapter || john.chapters[0]?.chapter || 1); setBibleStatus(books.length >= 66 ? 'Biblia Reina-Valera 1909 cargada.' : 'Biblia parcial cargada.'); } else setBibleStatus('Biblia completa no generada todavía. Se muestra base curada.'); }).catch(() => setBibleStatus('No se pudo cargar la Biblia completa. Se muestra base curada.')); return () => { cancelled = true; }; }, []);

  const allVerses: Verse[] = React.useMemo(() => { const generated = bible.flatMap(book => book.chapters.flatMap(ch => ch.verses.map(v => ({ book: book.bookName, chapter: ch.chapter, verse: v.verse, text: v.text, testament: book.testament })))); return generated.length ? generated : curated; }, [bible]);
  const books = React.useMemo(() => { const sourceBooks = bible.length ? bible : Array.from(new Set(curated.map(v => v.book))).map(book => ({ bookName: book, testament: curated.find(v => v.book === book)?.testament || 'Nuevo Testamento', chapters: [] })); return sourceBooks.filter(b => b.testament === testament).sort((a,b) => canonicalIndex(a.bookName)-canonicalIndex(b.bookName)).map(b => b.bookName); }, [bible, testament]);
  const selectedBook = bible.find(b => b.bookName === bookName);
  const chapters = selectedBook ? selectedBook.chapters.map(c => c.chapter) : Array.from(new Set(curated.filter(v => v.book === bookName).map(v => v.chapter))).sort((a,b)=>a-b);
  const visibleVerses: Verse[] = selectedBook ? (selectedBook.chapters.find(c => c.chapter === chapter)?.verses || []).map(v => ({ book: bookName, chapter, verse: v.verse, text: v.text, testament: selectedBook.testament })) : curated.filter(v => v.book === bookName && v.chapter === chapter);
  const bibleSearchResults = allVerses.filter(v => v.testament === testament).filter(v => { const q = normalize(bibleQuery); return q && (normalize(v.text).includes(q) || normalize(v.book).includes(q) || `${normalize(v.book)} ${v.chapter}`.includes(q)); }).slice(0,80);
  const globalSearchResults = allVerses.filter(v => { const q = normalize(query); return !q || normalize(v.text).includes(q) || normalize(v.book).includes(q) || v.theme?.some(t => q.includes(normalize(t)) || normalize(t).includes(q)); }).slice(0,80);

  const changeTestament = (next: Testament) => { setTestament(next); setBibleQuery(''); const sourceBooks = bible.length ? bible : Array.from(new Set(curated.map(v => v.book))).map(book => ({ bookName: book, testament: curated.find(v => v.book === book)?.testament || 'Nuevo Testamento', chapters: [] })); const first = sourceBooks.filter(b => b.testament === next).sort((a,b) => canonicalIndex(a.bookName)-canonicalIndex(b.bookName))[0]; if (first) { setBookName(first.bookName); setChapter(bible.find(b => b.bookName === first.bookName)?.chapters[0]?.chapter || curated.find(v => v.book === first.bookName)?.chapter || 1); } };
  const openReference = (ref: string) => { const match = ref.match(/^(.+?)\s+(\d+)/); if (!match) return; const wantedBook = normalize(match[1]); const wantedChapter = Number(match[2]); const allBooks = bible.length ? bible.map(b => b.bookName) : Array.from(new Set(curated.map(v => v.book))); const found = allBooks.find(b => normalize(b) === wantedBook || normalize(b).includes(wantedBook) || wantedBook.includes(normalize(b))); if (found) { const t = bible.find(b => b.bookName === found)?.testament || curated.find(v => v.book === found)?.testament || 'Nuevo Testamento'; setTestament(t === 'Antiguo Testamento' ? 'Antiguo Testamento' : 'Nuevo Testamento'); setBookName(found); setChapter(wantedChapter); setBibleQuery(''); setTab('biblia'); } };
  const toggleSave = (id: string) => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const writeNote = (id: string) => { const current = notes.find(n => n.verseId === id)?.text || ''; const text = prompt('Escribí tu nota personal', current); if (text !== null) setNotes(ns => [...ns.filter(n => n.verseId !== id), { verseId:id, text, updatedAt:new Date().toISOString() }]); };
  const shareApp = () => { const text = `Te comparto Palabra Viva, una app bíblica gratuita con palabra diaria, Biblia, oración y guía para empezar con Jesús. ${location.href}`; navigator.share ? navigator.share({ title:'Palabra Viva', text, url:location.href }) : navigator.clipboard.writeText(text).then(() => alert('Link copiado')); };

  return <main className="app">
    <header className="topbar"><div><span className="eyebrow">Palabra Viva</span><h1>{tab === 'hoy' ? 'Una palabra para hoy' : titleFor(tab)}</h1></div><button className="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun/> : <Moon/>}</button></header>

    {tab === 'hoy' && <div className="stack"><Card className="visualControls"><div><p className="ref">Pantalla</p><h3>Lectura cómoda</h3></div><div className="screenTools"><button className={theme==='dark'?'tool active':'tool'} onClick={() => setTheme('dark')}>Oscuro</button><button className={theme==='light'?'tool active':'tool'} onClick={() => setTheme('light')}>Claro</button><button className={theme==='sepia'?'tool active':'tool'} onClick={() => setTheme('sepia')}>Sepia</button><button className="tool" onClick={() => setFont(Math.max(16,font-1))}>A-</button><button className="tool" onClick={() => setFont(Math.min(24,font+1))}>A+</button></div></Card><section className="hero"><div className="pill"><Sparkles size={16}/> Palabra diaria</div><h2>Fe clara para el día real.</h2><p>Leé, sentí, entendé y seguí caminando con Dios.</p></section><VerseCard verse={todayVerse} saved={saved.includes(todayVerse.id || vid(todayVerse))} onSave={() => toggleSave(todayVerse.id || vid(todayVerse))}/><MoodBox value={moodText} setValue={setMoodText} result={moodResult} setResult={setMoodResult}/><Card className="introCard"><div><p className="ref">Nuevo camino</p><h3>¿No sabés por dónde empezar con Jesús?</h3><p className="soft">Una guía simple de 7 días para arrancar sin presión.</p></div><Button variant="ghost" onClick={() => setTab('empezar')}><Cross size={16}/> Ver guía</Button></Card><div className="grid2"><Card className="mini" onClick={() => setTab('biblia')}><BookOpen/> Leer Biblia</Card><Card className="mini" onClick={() => setTab('sentir')}><Heart/> Sentir</Card><Card className="mini" onClick={() => setTab('buscar')}><Search/> Buscar</Card><Card className="mini" onClick={() => setTab('planes')}><CalendarDays/> Planes</Card></div></div>}

    {tab === 'sentir' && <div className="stack"><Card className="gradient"><h2>Decilo como te salga</h2><p>No solo elijas una opción. Escribí cómo venís y buscá una palabra para ese momento.</p></Card><MoodBox value={moodText} setValue={setMoodText} result={moodResult} setResult={setMoodResult}/><Card className="warning"><ShieldCheck/><p>Palabra Viva no reemplaza ayuda médica, psicológica, pastoral ni servicios de emergencia. Si estás en peligro, pensás hacerte daño o no podés mantenerte seguro, hablá ahora con una persona de confianza o comunicate con emergencias locales.</p></Card></div>}

    {tab === 'empezar' && <div className="stack"><Card className="gradient"><h2>Primeros 7 días con Jesús</h2><p>Una ruta simple para quien está empezando o quiere volver a acercarse a Dios.</p></Card>{startPath.map(item => { const done = startDone.includes(item.day); return <Card key={item.day}><div className="row between"><div><p className="ref">Día {item.day}</p><h3>{item.title}</h3><p>{item.idea}</p><p className="soft">Lectura: {item.reading}</p></div><span className="badge">{done ? 'Hecho' : 'Nuevo'}</span></div><div className="row wrap"><Button onClick={() => openReference(item.reading)}><Route size={16}/> Leer</Button><Button variant="ghost" onClick={() => setStartDone(ds => done ? ds.filter(d => d !== item.day) : [...ds, item.day])}>{done ? 'Desmarcar' : 'Marcar como vivido'}</Button></div></Card>; })}<Card><h3>Oración para empezar</h3><p>Dios, no sé todo, pero quiero acercarme a vos. Mostrame quién sos, guiame hacia Jesús y enseñame a caminar con fe.</p></Card></div>}

    {tab === 'biblia' && <div className="stack"><Card className="gradient"><h2>Biblia</h2><p>{bibleStatus}</p></Card><Card><div className="testamentTabs"><button className={testament==='Antiguo Testamento'?'testament active':'testament'} onClick={() => changeTestament('Antiguo Testamento')}>Antiguo Testamento</button><button className={testament==='Nuevo Testamento'?'testament active':'testament'} onClick={() => changeTestament('Nuevo Testamento')}>Nuevo Testamento</button></div><input className="search" value={bibleQuery} onChange={e => setBibleQuery(e.target.value)} placeholder={`Buscar en ${testament}: paz, Jesús, Salmos, Juan 3...`}/></Card>{bibleQuery.trim() ? <>{bibleSearchResults.length===0 && <Card><p>No encontré resultados en {testament}. Probá otra palabra o una referencia.</p></Card>}{bibleSearchResults.map(v => <VerseCard key={vid(v)} verse={v} saved={saved.includes(vid(v))} onSave={() => toggleSave(vid(v))} onNote={() => writeNote(vid(v))}/>)}</> : <><Card><label className="fieldLabel">Libro<select className="select" value={bookName} onChange={e => { setBookName(e.target.value); setChapter(1); }}>{books.map(b => <option key={b} value={b}>{b}</option>)}</select></label><label className="fieldLabel">Capítulo<select className="select" value={chapter} onChange={e => setChapter(Number(e.target.value))}>{chapters.map(c => <option key={c} value={c}>Capítulo {c}</option>)}</select></label></Card>{visibleVerses.length===0 && <Card><p>No hay versículos para esta selección todavía. Probá otro libro/capítulo mientras se termina de cargar la Biblia completa.</p></Card>}{visibleVerses.map(v => <VerseCard key={vid(v)} verse={v} saved={saved.includes(vid(v))} onSave={() => toggleSave(vid(v))} onNote={() => writeNote(vid(v))}/>)}</>}</div>}

    {tab === 'planes' && <div className="stack">{plans.map(p => <Card key={p.id}><div className="row between"><h3>{p.title}</h3><span className="badge">{Math.round(((progress[p.id]?.length || 0) / p.days.length) * 100)}%</span></div>{p.days.map((d,i) => { const done = progress[p.id]?.includes(d); return <div className="planrow" key={d}><label className="check"><input type="checkbox" checked={!!done} onChange={() => setProgress(pr => ({...pr,[p.id]:done ? (pr[p.id]||[]).filter(x=>x!==d) : [...(pr[p.id]||[]),d]}))}/><span>Día {i+1}: {d}</span></label><Button variant="ghost" onClick={() => openReference(d)}>Ir</Button></div>; })}</Card>)}</div>}

    {tab === 'buscar' && <div className="stack"><Card><input className="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Ej: Jesús, ansiedad, paz, perdón, propósito..."/></Card>{globalSearchResults.map(v => <VerseCard key={vid(v)} verse={v} saved={saved.includes(vid(v))} onSave={() => toggleSave(vid(v))}/>)}</div>}
    {tab === 'oracion' && <div className="stack">{prayers.map(([t,p]) => <Card key={t}><p className="ref">{t}</p><p>{p}</p></Card>)}</div>}
    {tab === 'guardado' && <div className="stack">{saved.length===0 && <Card><p>Todavía no guardaste versículos. Cuando una palabra te hable, guardala acá.</p></Card>}{allVerses.filter(v => saved.includes(vid(v)) || (v.id && saved.includes(v.id))).slice(0,100).map(v => <VerseCard key={vid(v)} verse={v} saved onSave={() => toggleSave(vid(v))} onNote={() => writeNote(vid(v))}/>)}{notes.map(n => <Card key={n.verseId}><p className="ref">Nota personal</p><p>{n.text}</p></Card>)}</div>}
    {tab === 'compartir' && <div className="stack"><Card className="gradient"><h2>Compartí Palabra Viva</h2><p>Compartila con alguien que necesite fe, paz o empezar a conocer a Jesús.</p><Button onClick={shareApp}><MessageCircle size={16}/> Compartir o copiar link</Button></Card></div>}
    {tab === 'ajustes' && <div className="stack"><Card><h3>Apariencia</h3><div className="row wrap"><Button onClick={() => setTheme('dark')}>Oscuro</Button><Button onClick={() => setTheme('light')}>Claro</Button><Button onClick={() => setTheme('sepia')}>Sepia</Button></div><label>Tamaño de letra: {font}px<input type="range" min="16" max="24" value={font} onChange={e => setFont(Number(e.target.value))}/></label></Card><Card><h3>Licencia bíblica</h3><p>Palabra Viva utiliza Reina-Valera 1909 desde eBible como fuente de dominio público. No integrar traducciones modernas protegidas sin licencia.</p></Card></div>}

    <nav className="bottom"><Nav icon={<Home/>} label="Hoy" active={tab==='hoy'} onClick={() => setTab('hoy')}/><Nav icon={<BookOpen/>} label="Biblia" active={tab==='biblia'} onClick={() => setTab('biblia')}/><Nav icon={<Cross/>} label="Empezar" active={tab==='empezar'} onClick={() => setTab('empezar')}/><Nav icon={<Heart/>} label="Sentir" active={tab==='sentir'} onClick={() => setTab('sentir')}/><Nav icon={<CalendarDays/>} label="Planes" active={tab==='planes'} onClick={() => setTab('planes')}/></nav><div className="quick"><button onClick={() => setTab('buscar')}>Buscar</button><button onClick={() => setTab('guardado')}>Guardado</button><button onClick={() => setTab('oracion')}>Oración</button><button onClick={() => setTab('compartir')}>Compartir</button><button onClick={() => setTab('ajustes')}><Settings size={16}/></button></div>
  </main>;
}
function titleFor(tab: Tab) { return ({ hoy:'Hoy', biblia:'Biblia', sentir:'¿Cómo te sentís?', empezar:'Empezar con Jesús', planes:'Planes', buscar:'Buscar', oracion:'Oraciones', guardado:'Guardado', ajustes:'Ajustes', compartir:'Compartir app' } as Record<Tab,string>)[tab] || 'Palabra Viva'; }
function Nav({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) { return <button className={active ? 'nav active' : 'nav'} onClick={onClick}>{icon}<span>{label}</span></button>; }

createRoot(document.getElementById('root')!).render(<App />);
