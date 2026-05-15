import React from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpen, Heart, Home, Search, CalendarDays, Settings, Share2, Download, Moon, Sun, Save, MessageCircle, Sparkles, Flame, Compass, ShieldCheck } from 'lucide-react';
import './styles.css';

type Tab = 'hoy' | 'biblia' | 'sentir' | 'buscar' | 'planes' | 'oracion' | 'guardado' | 'ajustes' | 'instalar' | 'compartir';
type Verse = { id: string; book: string; chapter: number; verse: number; text: string; testament: 'Antiguo Testamento' | 'Nuevo Testamento'; theme?: string[] };
type Note = { verseId: string; text: string; updatedAt: string };

const verses: Verse[] = [
  { id: 'sal-23-1', book: 'Salmos', chapter: 23, verse: 1, testament: 'Antiguo Testamento', text: 'Jehová es mi pastor; nada me faltará.', theme: ['paz', 'miedo', 'protección'] },
  { id: 'sal-46-1', book: 'Salmos', chapter: 46, verse: 1, testament: 'Antiguo Testamento', text: 'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.', theme: ['miedo', 'protección', 'ansiedad'] },
  { id: 'prov-3-5', book: 'Proverbios', chapter: 3, verse: 5, testament: 'Antiguo Testamento', text: 'Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.', theme: ['decisión', 'dirección', 'fe'] },
  { id: 'isa-41-10', book: 'Isaías', chapter: 41, verse: 10, testament: 'Antiguo Testamento', text: 'No temas, porque yo soy contigo; no desmayes, porque yo soy tu Dios.', theme: ['miedo', 'ánimo', 'soledad'] },
  { id: 'mat-11-28', book: 'Mateo', chapter: 11, verse: 28, testament: 'Nuevo Testamento', text: 'Venid a mí todos los que estáis trabajados y cargados, que yo os haré descansar.', theme: ['cansancio', 'ansiedad', 'paz'] },
  { id: 'juan-14-27', book: 'Juan', chapter: 14, verse: 27, testament: 'Nuevo Testamento', text: 'La paz os dejo, mi paz os doy: no como el mundo la da, yo os la doy.', theme: ['paz', 'miedo', 'ansiedad'] },
  { id: 'rom-8-28', book: 'Romanos', chapter: 8, verse: 28, testament: 'Nuevo Testamento', text: 'Y sabemos que a los que a Dios aman, todas las cosas les ayudan a bien.', theme: ['esperanza', 'duelo', 'fe'] },
  { id: 'fil-4-6', book: 'Filipenses', chapter: 4, verse: 6, testament: 'Nuevo Testamento', text: 'Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración y ruego.', theme: ['ansiedad', 'oración', 'paz'] },
  { id: '1ped-5-7', book: '1 Pedro', chapter: 5, verse: 7, testament: 'Nuevo Testamento', text: 'Echando toda vuestra solicitud en él, porque él tiene cuidado de vosotros.', theme: ['ansiedad', 'cuidado', 'soledad'] },
  { id: '1juan-1-9', book: '1 Juan', chapter: 1, verse: 9, testament: 'Nuevo Testamento', text: 'Si confesamos nuestros pecados, él es fiel y justo para que nos perdone nuestros pecados.', theme: ['perdón', 'culpa', 'fe'] }
];

const moods = [
  { name: 'Ansiedad', keys: ['ansiedad', 'paz'], text: 'Bajá un cambio. No tenés que resolver toda tu vida hoy.', prayer: 'Dios, te entrego lo que no puedo controlar.', action: 'Respirá profundo y leé este versículo dos veces.' },
  { name: 'Miedo', keys: ['miedo', 'protección'], text: 'El miedo grita fuerte, pero Dios sigue siendo refugio.', prayer: 'Señor, guardá mi mente y mi camino.', action: 'Mandale un mensaje a alguien de confianza.' },
  { name: 'Bajón', keys: ['esperanza', 'duelo'], text: 'No estás roto. Estás atravesando algo, y podés caminarlo con Dios.', prayer: 'Señor, sosteneme en este momento.', action: 'Hacé una pausa corta sin pantalla.' },
  { name: 'Cansancio', keys: ['cansancio', 'paz'], text: 'Jesús no te pide aparentar fuerza. Te invita a descansar.', prayer: 'Señor, renová mis fuerzas.', action: 'Tomá agua y descansá cinco minutos.' },
  { name: 'Culpa', keys: ['perdón', 'culpa'], text: 'Dios no te llama para humillarte, sino para levantarte y corregir camino.', prayer: 'Ayudame a pedir perdón y empezar de nuevo.', action: 'Elegí una acción concreta de reparación.' },
  { name: 'Soledad', keys: ['soledad', 'cuidado'], text: 'Sentirte solo no significa estar abandonado.', prayer: 'Padre, haceme sentir tu compañía.', action: 'Escribile a alguien que te haga bien.' },
  { name: 'Decisiones', keys: ['dirección', 'decisión'], text: 'No todas las respuestas llegan juntas. A veces Dios guía paso a paso.', prayer: 'Dame sabiduría para elegir bien.', action: 'Anotá pros, contras y una decisión prudente.' },
  { name: 'Paz', keys: ['paz'], text: 'La paz de Dios no es escape: es fuerza interior para seguir.', prayer: 'Jesús, ordená mi interior.', action: 'Leé en silencio y apagá el ruido por un momento.' },
  { name: 'Fe encendida', keys: ['fe', 'esperanza'], text: 'La fe también se entrena: un paso, una oración, una decisión.', prayer: 'Dios, fortalecé mi fe hoy.', action: 'Compartí una palabra con alguien.' }
];

const plans = [
  { id: 'nt90', title: 'Nuevo Testamento en 90 días', days: ['Mateo 1-2', 'Mateo 3-4', 'Mateo 5-6'] },
  { id: 'salmos30', title: 'Salmos en 30 días', days: ['Salmos 1-3', 'Salmos 4-6', 'Salmos 7-9'] },
  { id: 'ansiedad7', title: '7 días para bajar la ansiedad', days: ['Filipenses 4', 'Juan 14', '1 Pedro 5'] },
  { id: 'jovenes14', title: '14 días para jóvenes con propósito', days: ['Proverbios 3', 'Romanos 12', 'Mateo 5'] }
];

const prayers = [
  ['Paz mental', 'Señor, calmá mis pensamientos y ayudame a vivir este día con claridad.'],
  ['Familia', 'Dios, cuidá mi casa, saná lo que duele y enseñanos a escucharnos.'],
  ['Futuro', 'Padre, guiá mis decisiones y ayudame a no desesperarme por lo que todavía no veo.'],
  ['Perdón', 'Señor, dame humildad para reconocer errores y fuerza para cambiar.']
];

const books = Array.from(new Set(verses.map(v => v.book)));
const todayVerse = verses[new Date().getDate() % verses.length];

function useLocal<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(() => {
    try { return JSON.parse(localStorage.getItem(key) || '') as T; } catch { return initial; }
  });
  React.useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue] as const;
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

function Button({ children, onClick, variant = 'primary' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost' }) {
  return <button className={`btn ${variant}`} onClick={onClick}>{children}</button>;
}

function VerseCard({ verse, onSave, saved, onNote }: { verse: Verse; onSave: () => void; saved: boolean; onNote?: () => void }) {
  return <Card>
    <p className="ref">{verse.book} {verse.chapter}:{verse.verse}</p>
    <p className="verse">“{verse.text}”</p>
    <div className="row wrap">
      <Button variant={saved ? 'ghost' : 'primary'} onClick={onSave}><Save size={16}/> {saved ? 'Guardado' : 'Guardar'}</Button>
      {onNote && <Button variant="ghost" onClick={onNote}>Nota</Button>}
    </div>
  </Card>;
}

function App() {
  const [tab, setTab] = React.useState<Tab>('hoy');
  const [theme, setTheme] = useLocal('pv-theme', 'dark');
  const [font, setFont] = useLocal('pv-font', 18);
  const [saved, setSaved] = useLocal<string[]>('pv-saved', []);
  const [notes, setNotes] = useLocal<Note[]>('pv-notes', []);
  const [progress, setProgress] = useLocal<Record<string, string[]>>('pv-progress', {});
  const [query, setQuery] = React.useState('');
  const [book, setBook] = React.useState(books[0]);
  const [selectedMood, setSelectedMood] = React.useState(moods[0]);

  React.useEffect(() => {
    document.body.dataset.theme = theme;
    document.documentElement.style.setProperty('--font-size', `${font}px`);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }, [theme, font]);

  const toggleSave = (id: string) => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const writeNote = (verseId: string) => {
    const current = notes.find(n => n.verseId === verseId)?.text || '';
    const text = prompt('Escribí tu nota personal', current);
    if (text === null) return;
    setNotes(ns => [...ns.filter(n => n.verseId !== verseId), { verseId, text, updatedAt: new Date().toISOString() }]);
  };
  const related = (keys: string[]) => verses.filter(v => v.theme?.some(t => keys.includes(t))).slice(0, 4);
  const searchResults = verses.filter(v => {
    const q = query.toLowerCase();
    return v.text.toLowerCase().includes(q) || v.book.toLowerCase().includes(q) || v.theme?.some(t => q.includes(t) || t.includes(q));
  });
  const shareApp = () => {
    const text = `Te comparto Palabra Viva, una app bíblica gratuita con palabra diaria, oración y lectura según cómo te sentís. ${location.href}`;
    if (navigator.share) navigator.share({ title: 'Palabra Viva', text, url: location.href });
    else navigator.clipboard.writeText(text).then(() => alert('Link copiado'));
  };
  const shareVerse = () => navigator.share ? navigator.share({ title: 'Palabra para hoy', text: `${todayVerse.book} ${todayVerse.chapter}:${todayVerse.verse} — ${todayVerse.text}` }) : navigator.clipboard.writeText(todayVerse.text);

  return <main className="app">
    <header className="topbar">
      <div>
        <span className="eyebrow">Palabra Viva</span>
        <h1>{tab === 'hoy' ? 'Una palabra para hoy' : titleFor(tab)}</h1>
      </div>
      <button className="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun/> : <Moon/>}</button>
    </header>

    {tab === 'hoy' && <div className="stack">
      <section className="hero">
        <div className="pill"><Sparkles size={16}/> Devocional diario</div>
        <h2>No tenés que tener todo resuelto para acercarte a Dios.</h2>
        <p>Leé una palabra, orá simple y seguí tu día con más paz.</p>
      </section>
      <Card className="today">
        <div className="row between"><p className="ref">{todayVerse.book} {todayVerse.chapter}:{todayVerse.verse}</p><Flame size={22}/></div>
        <p className="verse big">“{todayVerse.text}”</p>
        <p className="soft">Hoy no corras solo. Llevá esta palabra como una señal de calma, dirección y fe.</p>
        <p><strong>Oración breve:</strong> Señor, hablame con claridad y ayudame a vivir este día con sabiduría.</p>
        <div className="row wrap">
          <Button onClick={() => toggleSave(todayVerse.id)}>Guardar</Button>
          <Button variant="ghost" onClick={shareVerse}><Share2 size={16}/> Compartir</Button>
          <Button variant="ghost" onClick={() => setTab('instalar')}><Download size={16}/> Instalar</Button>
        </div>
      </Card>
      <div className="grid2">
        <Card className="mini" onClick={() => setTab('sentir') as never}><Heart/> ¿Cómo estás hoy?</Card>
        <Card className="mini" onClick={() => setTab('buscar') as never}><Search/> Buscá una palabra</Card>
        <Card className="mini" onClick={() => setTab('compartir') as never}><Share2/> Compartir app</Card>
        <Card className="mini" onClick={() => setTab('planes') as never}><Compass/> Plan joven</Card>
      </div>
    </div>}

    {tab === 'biblia' && <div className="stack">
      <Card><p className="soft"><strong>Base demo legal.</strong> La estructura ya está lista para cargar Reina-Valera 1909 completa en <code>src/data/bible.rv1909.json</code>. No integrar RVR1960 u otras traducciones modernas sin licencia.</p></Card>
      <div className="chips">{books.map(b => <button className={book === b ? 'chip active' : 'chip'} onClick={() => setBook(b)} key={b}>{b}</button>)}</div>
      {verses.filter(v => v.book === book).map(v => <VerseCard key={v.id} verse={v} saved={saved.includes(v.id)} onSave={() => toggleSave(v.id)} onNote={() => writeNote(v.id)} />)}
    </div>}

    {tab === 'sentir' && <div className="stack">
      <Card className="gradient"><h2>¿Cómo venís hoy?</h2><p>No tenés que ordenar todo ahora. Elegí cómo estás y leamos una palabra juntos.</p></Card>
      <div className="chips">{moods.map(m => <button className={selectedMood.name === m.name ? 'chip active' : 'chip'} onClick={() => setSelectedMood(m)} key={m.name}>{m.name}</button>)}</div>
      <Card><h3>{selectedMood.name}</h3><p>{selectedMood.text}</p><p><strong>Oración:</strong> {selectedMood.prayer}</p><p><strong>Una acción pequeña:</strong> {selectedMood.action}</p></Card>
      {related(selectedMood.keys).map(v => <VerseCard key={v.id} verse={v} saved={saved.includes(v.id)} onSave={() => toggleSave(v.id)} />)}
      <Card className="warning"><ShieldCheck/><p>Palabra Viva no reemplaza ayuda médica, psicológica, pastoral ni servicios de emergencia. Si estás en peligro, pensás hacerte daño o no podés mantenerte seguro, hablá ahora con una persona de confianza o comunicate con emergencias locales.</p></Card>
    </div>}

    {tab === 'buscar' && <div className="stack">
      <Card><input className="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Ej: tengo miedo, necesito paz, perdón, ansiedad..." /></Card>
      {(query ? searchResults : verses).map(v => <VerseCard key={v.id} verse={v} saved={saved.includes(v.id)} onSave={() => toggleSave(v.id)} />)}
    </div>}

    {tab === 'planes' && <div className="stack">
      {plans.map(p => <Card key={p.id}><div className="row between"><h3>{p.title}</h3><span className="badge">{Math.round(((progress[p.id]?.length || 0) / p.days.length) * 100)}%</span></div>{p.days.map((d, i) => { const done = progress[p.id]?.includes(d); return <label className="check" key={d}><input type="checkbox" checked={!!done} onChange={() => setProgress(pr => ({...pr, [p.id]: done ? (pr[p.id] || []).filter(x => x !== d) : [...(pr[p.id] || []), d]}))}/><span>Día {i + 1}: {d}</span></label>; })}</Card>)}
    </div>}

    {tab === 'oracion' && <div className="stack">{prayers.map(([t, p]) => <Card key={t}><p className="ref">{t}</p><p>{p}</p></Card>)}</div>}

    {tab === 'guardado' && <div className="stack">
      {saved.length === 0 && <Card><p>Todavía no guardaste versículos. Cuando una palabra te hable, guardala acá.</p></Card>}
      {verses.filter(v => saved.includes(v.id)).map(v => <VerseCard key={v.id} verse={v} saved onSave={() => toggleSave(v.id)} onNote={() => writeNote(v.id)} />)}
      {notes.map(n => <Card key={n.verseId}><p className="ref">Nota personal</p><p>{n.text}</p></Card>)}
    </div>}

    {tab === 'instalar' && <div className="stack">
      <Card className="gradient"><h2>Instalá Palabra Viva</h2><p>Así te queda como app en el celular, sin buscar el link cada vez.</p></Card>
      <Card><h3>Android</h3><ol><li>Abrí el link en Chrome.</li><li>Tocá los tres puntitos.</li><li>Tocá Instalar app o Agregar a pantalla principal.</li><li>Confirmá.</li></ol></Card>
      <Card><h3>iPhone</h3><ol><li>Abrí el link en Safari.</li><li>Tocá Compartir.</li><li>Tocá Agregar a pantalla de inicio.</li><li>Confirmá.</li></ol></Card>
    </div>}

    {tab === 'compartir' && <div className="stack">
      <Card className="gradient"><h2>Compartí una palabra</h2><p>Compartí Palabra Viva con alguien que necesite fe, paz o esperanza.</p><Button onClick={shareApp}><MessageCircle size={16}/> Compartir o copiar link</Button></Card>
    </div>}

    {tab === 'ajustes' && <div className="stack">
      <Card><h3>Apariencia</h3><div className="row wrap"><Button onClick={() => setTheme('dark')}>Oscuro</Button><Button onClick={() => setTheme('light')}>Claro</Button><Button onClick={() => setTheme('sepia')}>Sepia</Button></div><label>Tamaño de letra: {font}px<input type="range" min="16" max="24" value={font} onChange={e => setFont(Number(e.target.value))}/></label></Card>
      <Card><h3>Palabra diaria</h3><p>Te vamos a enviar una palabra diaria si das permiso. Podés desactivarlo cuando quieras. En PWA web puede variar según navegador; en app nativa se usará Capacitor Local Notifications.</p><Button onClick={() => Notification?.requestPermission?.()}>Pedir permiso</Button></Card>
      <Card><h3>Licencia bíblica</h3><p>Palabra Viva utiliza textos bíblicos de dominio público o con licencia válida. No integrar traducciones modernas protegidas por derechos de autor sin la licencia correspondiente.</p></Card>
    </div>}

    <nav className="bottom">
      <Nav icon={<Home/>} label="Hoy" active={tab==='hoy'} onClick={() => setTab('hoy')}/>
      <Nav icon={<BookOpen/>} label="Biblia" active={tab==='biblia'} onClick={() => setTab('biblia')}/>
      <Nav icon={<Heart/>} label="Sentir" active={tab==='sentir'} onClick={() => setTab('sentir')}/>
      <Nav icon={<Search/>} label="Buscar" active={tab==='buscar'} onClick={() => setTab('buscar')}/>
      <Nav icon={<CalendarDays/>} label="Planes" active={tab==='planes'} onClick={() => setTab('planes')}/>
    </nav>
    <div className="quick"><button onClick={() => setTab('guardado')}>Guardado</button><button onClick={() => setTab('oracion')}>Oración</button><button onClick={() => setTab('compartir')}>Compartir</button><button onClick={() => setTab('ajustes')}><Settings size={16}/></button></div>
  </main>;
}

function titleFor(tab: Tab) { return ({ biblia:'Biblia', sentir:'¿Cómo te sentís?', buscar:'Buscar', planes:'Planes', oracion:'Oraciones', guardado:'Guardado', ajustes:'Ajustes', instalar:'Instalar app', compartir:'Compartir app', hoy:'Hoy' } as Record<Tab,string>)[tab]; }
function Nav({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) { return <button className={active ? 'nav active' : 'nav'} onClick={onClick}>{icon}<span>{label}</span></button>; }

createRoot(document.getElementById('root')!).render(<App />);
