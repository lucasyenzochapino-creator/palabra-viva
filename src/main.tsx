import React from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpen, Heart, Home, Search, CalendarDays, Settings, Share2, Download, Moon, Sun, Save, MessageCircle, Sparkles, Flame, Compass, ShieldCheck, ExternalLink, Cross, Route } from 'lucide-react';
import './styles.css';

type Tab = 'hoy' | 'biblia' | 'sentir' | 'buscar' | 'planes' | 'oracion' | 'guardado' | 'ajustes' | 'instalar' | 'compartir' | 'empezar';
type Verse = { id: string; book: string; chapter: number; verse: number; text: string; testament: string; theme?: string[] };
type BibleBook = { code: string; bookName: string; testament: string; chapters: { chapter: number; verses: { verse: number; text: string }[] }[] };
type Note = { verseId: string; text: string; updatedAt: string };

const curated: Verse[] = [
  { id:'sal-23-1', book:'Salmos', chapter:23, verse:1, testament:'Antiguo Testamento', text:'Jehová es mi pastor; nada me faltará.', theme:['paz','cuidado'] },
  { id:'sal-27-1', book:'Salmos', chapter:27, verse:1, testament:'Antiguo Testamento', text:'Jehová es mi luz y mi salvación: ¿de quién temeré?', theme:['miedo','valentia'] },
  { id:'sal-34-18', book:'Salmos', chapter:34, verse:18, testament:'Antiguo Testamento', text:'Cercano está Jehová á los quebrantados de corazón.', theme:['tristeza','duelo'] },
  { id:'sal-46-1', book:'Salmos', chapter:46, verse:1, testament:'Antiguo Testamento', text:'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.', theme:['proteccion','miedo'] },
  { id:'prov-3-5', book:'Proverbios', chapter:3, verse:5, testament:'Antiguo Testamento', text:'Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.', theme:['decision','direccion'] },
  { id:'isa-41-10', book:'Isaías', chapter:41, verse:10, testament:'Antiguo Testamento', text:'No temas, porque yo soy contigo; no desmayes, porque yo soy tu Dios.', theme:['soledad','miedo'] },
  { id:'mat-6-34', book:'Mateo', chapter:6, verse:34, testament:'Nuevo Testamento', text:'Así que, no os congojéis por el día de mañana.', theme:['ansiedad','futuro'] },
  { id:'mat-11-28', book:'Mateo', chapter:11, verse:28, testament:'Nuevo Testamento', text:'Venid á mí todos los que estáis trabajados y cargados, que yo os haré descansar.', theme:['cansancio','descanso'] },
  { id:'juan-3-16', book:'Juan', chapter:3, verse:16, testament:'Nuevo Testamento', text:'Porque de tal manera amó Dios al mundo, que ha dado á su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.', theme:['jesus','evangelio','empezar'] },
  { id:'juan-14-6', book:'Juan', chapter:14, verse:6, testament:'Nuevo Testamento', text:'Jesús le dice: Yo soy el camino, y la verdad, y la vida: nadie viene al Padre, sino por mí.', theme:['jesus','camino','empezar'] },
  { id:'juan-14-27', book:'Juan', chapter:14, verse:27, testament:'Nuevo Testamento', text:'La paz os dejo, mi paz os doy: no como el mundo la da, yo os la doy.', theme:['paz','ansiedad'] },
  { id:'rom-8-28', book:'Romanos', chapter:8, verse:28, testament:'Nuevo Testamento', text:'Y sabemos que á los que á Dios aman, todas las cosas les ayudan á bien.', theme:['esperanza','proceso'] },
  { id:'rom-12-2', book:'Romanos', chapter:12, verse:2, testament:'Nuevo Testamento', text:'Y no os conforméis á este siglo; mas reformaos por la renovación de vuestro entendimiento.', theme:['jovenes','proposito'] },
  { id:'2cor-5-17', book:'2 Corintios', chapter:5, verse:17, testament:'Nuevo Testamento', text:'De modo que si alguno está en Cristo, nueva criatura es.', theme:['nuevo','culpa','empezar'] },
  { id:'fil-4-6', book:'Filipenses', chapter:4, verse:6, testament:'Nuevo Testamento', text:'Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración y ruego.', theme:['ansiedad','oracion'] },
  { id:'1tim-4-12', book:'1 Timoteo', chapter:4, verse:12, testament:'Nuevo Testamento', text:'Ninguno tenga en poco tu juventud; pero sé ejemplo de los fieles.', theme:['jovenes','identidad'] },
  { id:'1ped-5-7', book:'1 Pedro', chapter:5, verse:7, testament:'Nuevo Testamento', text:'Echando toda vuestra solicitud en él, porque él tiene cuidado de vosotros.', theme:['ansiedad','cuidado'] },
  { id:'1juan-1-9', book:'1 Juan', chapter:1, verse:9, testament:'Nuevo Testamento', text:'Si confesamos nuestros pecados, él es fiel y justo para que nos perdone nuestros pecados.', theme:['perdon','culpa'] }
];

const moods = [
  { name:'Ansiedad', ids:['mat-6-34','fil-4-6','1ped-5-7'], text:'Respirá. No tenés que cargar el futuro entero hoy.', prayer:'Dios, te entrego lo que no puedo controlar.', action:'Respirá lento y orá una frase simple.' },
  { name:'Miedo', ids:['sal-27-1','sal-46-1','isa-41-10'], text:'El miedo grita, pero no manda sobre tu vida.', prayer:'Señor, guardá mi mente y mi camino.', action:'Nombrá tu miedo y entregáselo a Dios.' },
  { name:'Tristeza', ids:['sal-34-18','rom-8-28','juan-14-27'], text:'Dios se acerca al corazón herido, no lo desprecia.', prayer:'Señor, sosteneme en este momento.', action:'Hablá con alguien que te quiera bien.' },
  { name:'Cansancio', ids:['mat-11-28','sal-23-1','fil-4-6'], text:'No sos una máquina. También necesitás pausa y descanso.', prayer:'Dios, renová mis fuerzas.', action:'Tomá cinco minutos sin pantalla.' },
  { name:'Culpa', ids:['1juan-1-9','2cor-5-17','juan-3-16'], text:'La culpa puede ser una señal para volver, no una cadena para quedarte tirado.', prayer:'Dame humildad para pedir perdón y cambiar.', action:'Elegí una acción concreta de reparación.' },
  { name:'Jóvenes con propósito', ids:['1tim-4-12','rom-12-2','fil-4-6'], text:'Tu edad no te descalifica. Tu vida puede ser ejemplo desde ahora.', prayer:'Dios, encendé propósito y carácter en mí.', action:'Hacé hoy algo pequeño que te acerque a la persona que querés ser.' }
];

const plans = [
  { id:'empezar7', title:'7 días para empezar con Jesús', days:['Juan 3','Juan 14','Romanos 8','2 Corintios 5','1 Juan 1','Salmos 23','Mateo 11'] },
  { id:'jovenes14', title:'14 días para jóvenes con propósito', days:['1 Timoteo 4','Romanos 12','Filipenses 4','Proverbios 3'] },
  { id:'ansiedad7', title:'7 días para bajar la ansiedad', days:['Mateo 6','Filipenses 4','1 Pedro 5','Juan 14'] },
  { id:'nt90', title:'Nuevo Testamento en 90 días', days:['Mateo 1','Mateo 2','Mateo 3','Juan 1'] },
  { id:'salmos30', title:'Salmos en 30 días', days:['Salmos 1','Salmos 23','Salmos 46','Salmos 91'] }
];

const prayers = [
  ['Primera oración', 'Dios, no sé todo, pero quiero acercarme. Mostrame quién sos y guiame paso a paso.'],
  ['Paz mental','Señor, calmá mis pensamientos y ayudame a vivir este día con claridad.'],
  ['Familia','Dios, cuidá mi casa, saná lo que duele y enseñanos a escucharnos.'],
  ['Perdón','Señor, dame humildad para reconocer errores y fuerza para cambiar.']
];

const todayVerse = curated[new Date().getDate() % curated.length];

function useLocal<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(() => { try { return JSON.parse(localStorage.getItem(key) || '') as T; } catch { return initial; } });
  React.useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue] as const;
}
function normalize(s: string) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/á/g,'a').trim(); }
function verseId(v: Verse) { return `${v.book}-${v.chapter}-${v.verse}`; }
function Card({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) { return <section className={`card ${className}`} onClick={onClick}>{children}</section>; }
function Button({ children, onClick, variant = 'primary' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost' }) { return <button className={`btn ${variant}`} onClick={onClick}>{children}</button>; }
function VerseCard({ verse, onSave, saved, onNote }: { verse: Verse; onSave: () => void; saved: boolean; onNote?: () => void }) {
  const share = () => {
    const text = `${verse.book} ${verse.chapter}:${verse.verse}\n\n${verse.text}\n\nCompartido desde Palabra Viva`;
    if (navigator.share) navigator.share({ title: `${verse.book} ${verse.chapter}:${verse.verse}`, text });
    else navigator.clipboard.writeText(text).then(() => alert('Versículo copiado'));
  };
  return <Card><p className="ref">{verse.book} {verse.chapter}:{verse.verse}</p><p className="verse">“{verse.text}”</p><div className="row wrap"><Button variant={saved ? 'ghost' : 'primary'} onClick={onSave}><Save size={16}/> {saved ? 'Guardado' : 'Guardar'}</Button><Button variant="ghost" onClick={share}><Share2 size={16}/> Compartir</Button>{onNote && <Button variant="ghost" onClick={onNote}>Nota</Button>}</div></Card>;
}

function App() {
  const [tab, setTab] = React.useState<Tab>('hoy');
  const [theme, setTheme] = useLocal('pv-theme', 'dark');
  const [font, setFont] = useLocal('pv-font', 18);
  const [saved, setSaved] = useLocal<string[]>('pv-saved', []);
  const [notes, setNotes] = useLocal<Note[]>('pv-notes', []);
  const [progress, setProgress] = useLocal<Record<string, string[]>>('pv-progress', {});
  const [query, setQuery] = React.useState('');
  const [selectedMood, setSelectedMood] = React.useState(moods[0]);
  const [bible, setBible] = React.useState<BibleBook[]>([]);
  const [bookName, setBookName] = React.useState('Juan');
  const [chapter, setChapter] = React.useState(3);
  const [bibleStatus, setBibleStatus] = React.useState('Cargando Biblia completa...');

  React.useEffect(() => {
    document.body.dataset.theme = theme;
    document.documentElement.style.setProperty('--font-size', `${font}px`);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }, [theme, font]);

  React.useEffect(() => {
    fetch('/bible.rv1909.json')
      .then(r => r.json())
      .then(data => {
        const books = data.books || [];
        setBible(books);
        setBibleStatus(books.length >= 66 ? 'Biblia completa RV1909 cargada offline.' : 'Biblia completa aún no disponible; usando base curada.');
        if (books.length) { setBookName(books[43]?.bookName || books[0].bookName); setChapter(1); }
      })
      .catch(() => setBibleStatus('No se pudo cargar el archivo bíblico. Usando base curada.'));
  }, []);

  const allVerses: Verse[] = React.useMemo(() => {
    const generated = bible.flatMap(book => book.chapters.flatMap(ch => ch.verses.map(v => ({ id:`${book.bookName}-${ch.chapter}-${v.verse}`, book:book.bookName, chapter:ch.chapter, verse:v.verse, text:v.text, testament:book.testament }))));
    return generated.length ? generated : curated;
  }, [bible]);

  const books = bible.length ? bible.map(b => b.bookName) : Array.from(new Set(curated.map(v => v.book)));
  const selectedBook = bible.find(b => b.bookName === bookName);
  const chapters = selectedBook ? selectedBook.chapters.map(c => c.chapter) : Array.from(new Set(curated.filter(v => v.book === bookName).map(v => v.chapter)));
  const visibleVerses = selectedBook ? (selectedBook.chapters.find(c => c.chapter === chapter)?.verses || []).map(v => ({ id:`${bookName}-${chapter}-${v.verse}`, book:bookName, chapter, verse:v.verse, text:v.text, testament:selectedBook.testament })) : curated.filter(v => v.book === bookName && v.chapter === chapter);

  const openReference = (ref: string) => {
    const match = ref.match(/^(.+?)\s+(\d+)/);
    if (!match) return;
    const wantedBook = normalize(match[1]);
    const wantedChapter = Number(match[2]);
    const found = books.find(b => normalize(b) === wantedBook || normalize(b).includes(wantedBook));
    if (found) { setBookName(found); setChapter(wantedChapter); setTab('biblia'); }
  };

  const toggleSave = (id: string) => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const writeNote = (id: string) => { const current = notes.find(n => n.verseId === id)?.text || ''; const text = prompt('Escribí tu nota personal', current); if (text !== null) setNotes(ns => [...ns.filter(n => n.verseId !== id), { verseId:id, text, updatedAt:new Date().toISOString() }]); };
  const moodVerses = selectedMood.ids.map(id => curated.find(v => v.id === id)).filter(Boolean) as Verse[];
  const searchResults = allVerses.filter(v => { const q = normalize(query); return !q || normalize(v.text).includes(q) || normalize(v.book).includes(q) || v.theme?.some(t => q.includes(t) || t.includes(q)); }).slice(0, 80);
  const shareApp = () => { const text = `Te comparto Palabra Viva, una app bíblica gratuita con palabra diaria, Biblia, oración y guía para empezar con Jesús. ${location.href}`; navigator.share ? navigator.share({ title:'Palabra Viva', text, url:location.href }) : navigator.clipboard.writeText(text).then(() => alert('Link copiado')); };

  return <main className="app">
    <header className="topbar"><div><span className="eyebrow">Palabra Viva</span><h1>{tab === 'hoy' ? 'Una palabra para hoy' : titleFor(tab)}</h1></div><button className="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun/> : <Moon/>}</button></header>

    {tab === 'hoy' && <div className="stack"><section className="hero"><div className="pill"><Sparkles size={16}/> Fe para empezar</div><h2>Una app para leer, entender, orar y acercarte a Jesús.</h2><p>Simple, gratuita, instalable y pensada también para quien recién empieza.</p></section><Card className="today"><div className="row between"><p className="ref">{todayVerse.book} {todayVerse.chapter}:{todayVerse.verse}</p><Flame size={22}/></div><p className="verse big">“{todayVerse.text}”</p><p className="soft">No corras solo. Llevá esta palabra como una señal de calma, dirección y fe.</p><p><strong>Oración breve:</strong> Señor, hablame con claridad y ayudame a vivir este día con sabiduría.</p><div className="row wrap"><Button onClick={() => toggleSave(todayVerse.id)}>Guardar</Button><Button variant="ghost" onClick={() => navigator.share ? navigator.share({title:'Palabra para hoy', text:`${todayVerse.book} ${todayVerse.chapter}:${todayVerse.verse}\n\n${todayVerse.text}`}) : navigator.clipboard.writeText(todayVerse.text)}><Share2 size={16}/> Compartir palabra</Button><Button variant="ghost" onClick={() => setTab('empezar')}><Cross size={16}/> Empezar</Button></div></Card><div className="grid2"><Card className="mini" onClick={() => setTab('empezar')}><Cross/> No conozco a Jesús</Card><Card className="mini" onClick={() => setTab('sentir')}><Heart/> ¿Cómo venís?</Card><Card className="mini" onClick={() => setTab('biblia')}><BookOpen/> Leer Biblia</Card><Card className="mini" onClick={() => setTab('compartir')}><Share2/> Compartir app</Card></div></div>}

    {tab === 'empezar' && <div className="stack"><Card className="gradient"><h2>Por dónde empezar si no conocés a Jesús</h2><p>No necesitás saber todo. Empezá con una pregunta honesta: “Dios, si sos real, quiero conocerte”.</p></Card>{['Juan 3','Juan 14','Romanos 8','2 Corintios 5'].map(ref => <Card key={ref}><div className="row between"><div><p className="ref">Lectura inicial</p><h3>{ref}</h3></div><Button onClick={() => openReference(ref)}><Route size={16}/> Leer</Button></div></Card>)}<Card><h3>Una oración simple</h3><p>Dios, no sé todo, pero quiero acercarme a vos. Mostrame quién sos, guiame hacia Jesús y enseñame a caminar con fe.</p></Card><Card><h3>Ruta sugerida</h3><ol><li>Leé Juan 3.</li><li>Orá con tus palabras, sin actuar.</li><li>Guardá un versículo que te hable.</li><li>Seguí el plan “7 días para empezar con Jesús”.</li><li>Hablá con una persona cristiana madura si necesitás acompañamiento.</li></ol></Card></div>}

    {tab === 'biblia' && <div className="stack"><Card className="gradient"><h2>Biblia RV1909</h2><p>{bibleStatus}</p><Button variant="ghost" onClick={() => window.open('https://ebible.org/spaRV1909/', '_blank')}><ExternalLink size={16}/> Fuente legal eBible</Button></Card><div className="chips">{books.map(b => <button className={bookName === b ? 'chip active' : 'chip'} onClick={() => { setBookName(b); setChapter(1); }} key={b}>{b}</button>)}</div><div className="chips">{chapters.map(c => <button className={chapter === c ? 'chip active' : 'chip'} onClick={() => setChapter(c)} key={c}>Cap. {c}</button>)}</div>{visibleVerses.map(v => <VerseCard key={verseId(v)} verse={v} saved={saved.includes(verseId(v))} onSave={() => toggleSave(verseId(v))} onNote={() => writeNote(verseId(v))} />)}</div>}

    {tab === 'sentir' && <div className="stack"><Card className="gradient"><h2>¿Cómo venís hoy?</h2><p>No tenés que ordenar todo ahora. Elegí cómo estás y leamos una palabra juntos.</p></Card><div className="chips">{moods.map(m => <button className={selectedMood.name === m.name ? 'chip active' : 'chip'} onClick={() => setSelectedMood(m)} key={m.name}>{m.name}</button>)}</div><Card><h3>{selectedMood.name}</h3><p>{selectedMood.text}</p><p><strong>Oración:</strong> {selectedMood.prayer}</p><p><strong>Una acción pequeña:</strong> {selectedMood.action}</p></Card>{moodVerses.map(v => <VerseCard key={v.id} verse={v} saved={saved.includes(v.id)} onSave={() => toggleSave(v.id)} />)}<Card className="warning"><ShieldCheck/><p>Palabra Viva no reemplaza ayuda médica, psicológica, pastoral ni servicios de emergencia. Si estás en peligro, pensás hacerte daño o no podés mantenerte seguro, hablá ahora con una persona de confianza o comunicate con emergencias locales.</p></Card></div>}

    {tab === 'buscar' && <div className="stack"><Card><input className="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Ej: Jesús, ansiedad, paz, perdón, propósito..." /></Card>{searchResults.map(v => <VerseCard key={verseId(v)} verse={v} saved={saved.includes(verseId(v))} onSave={() => toggleSave(verseId(v))} />)}</div>}

    {tab === 'planes' && <div className="stack">{plans.map(p => <Card key={p.id}><div className="row between"><h3>{p.title}</h3><span className="badge">{Math.round(((progress[p.id]?.length || 0) / p.days.length) * 100)}%</span></div>{p.days.map((d, i) => { const done = progress[p.id]?.includes(d); return <div className="planrow" key={d}><label className="check"><input type="checkbox" checked={!!done} onChange={() => setProgress(pr => ({...pr, [p.id]: done ? (pr[p.id] || []).filter(x => x !== d) : [...(pr[p.id] || []), d]}))}/><span>Día {i + 1}: {d}</span></label><Button variant="ghost" onClick={() => openReference(d)}>Ir</Button></div>; })}</Card>)}</div>}

    {tab === 'oracion' && <div className="stack">{prayers.map(([t, p]) => <Card key={t}><p className="ref">{t}</p><p>{p}</p></Card>)}</div>}
    {tab === 'guardado' && <div className="stack">{saved.length === 0 && <Card><p>Todavía no guardaste versículos. Cuando una palabra te hable, guardala acá.</p></Card>}{allVerses.filter(v => saved.includes(verseId(v)) || saved.includes(v.id)).slice(0,100).map(v => <VerseCard key={verseId(v)} verse={v} saved onSave={() => toggleSave(verseId(v))} onNote={() => writeNote(verseId(v))} />)}{notes.map(n => <Card key={n.verseId}><p className="ref">Nota personal</p><p>{n.text}</p></Card>)}</div>}
    {tab === 'instalar' && <div className="stack"><Card className="gradient"><h2>Instalá Palabra Viva</h2><p>Así te queda como app en el celular.</p></Card><Card><h3>Android</h3><ol><li>Abrí el link en Chrome.</li><li>Tocá los tres puntitos.</li><li>Tocá Instalar app o Agregar a pantalla principal.</li></ol></Card><Card><h3>iPhone</h3><ol><li>Abrí el link en Safari.</li><li>Tocá Compartir.</li><li>Tocá Agregar a pantalla de inicio.</li></ol></Card></div>}
    {tab === 'compartir' && <div className="stack"><Card className="gradient"><h2>Compartí Palabra Viva</h2><p>Compartila con alguien que necesite fe, paz o empezar a conocer a Jesús.</p><Button onClick={shareApp}><MessageCircle size={16}/> Compartir o copiar link</Button></Card></div>}
    {tab === 'ajustes' && <div className="stack"><Card><h3>Apariencia</h3><div className="row wrap"><Button onClick={() => setTheme('dark')}>Oscuro</Button><Button onClick={() => setTheme('light')}>Claro</Button><Button onClick={() => setTheme('sepia')}>Sepia</Button></div><label>Tamaño de letra: {font}px<input type="range" min="16" max="24" value={font} onChange={e => setFont(Number(e.target.value))}/></label></Card><Card><h3>Licencia bíblica</h3><p>Palabra Viva utiliza Reina-Valera 1909 desde eBible como fuente de dominio público. No integrar traducciones modernas protegidas sin licencia.</p></Card></div>}

    <nav className="bottom"><Nav icon={<Home/>} label="Hoy" active={tab==='hoy'} onClick={() => setTab('hoy')}/><Nav icon={<BookOpen/>} label="Biblia" active={tab==='biblia'} onClick={() => setTab('biblia')}/><Nav icon={<Heart/>} label="Sentir" active={tab==='sentir'} onClick={() => setTab('sentir')}/><Nav icon={<Search/>} label="Buscar" active={tab==='buscar'} onClick={() => setTab('buscar')}/><Nav icon={<CalendarDays/>} label="Planes" active={tab==='planes'} onClick={() => setTab('planes')}/></nav><div className="quick"><button onClick={() => setTab('empezar')}>Empezar</button><button onClick={() => setTab('guardado')}>Guardado</button><button onClick={() => setTab('oracion')}>Oración</button><button onClick={() => setTab('ajustes')}><Settings size={16}/></button></div>
  </main>;
}
function titleFor(tab: Tab) { return ({ biblia:'Biblia', sentir:'¿Cómo te sentís?', buscar:'Buscar', planes:'Planes', oracion:'Oraciones', guardado:'Guardado', ajustes:'Ajustes', instalar:'Instalar app', compartir:'Compartir app', empezar:'Empezar con Jesús', hoy:'Hoy' } as Record<Tab,string>)[tab]; }
function Nav({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) { return <button className={active ? 'nav active' : 'nav'} onClick={onClick}>{icon}<span>{label}</span></button>; }
createRoot(document.getElementById('root')!).render(<App />);
