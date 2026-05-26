import React from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpen, CalendarDays, Cross, Heart, Home, Save, Search, Settings, Share2, ShieldCheck, Sparkles, Sun, Moon } from 'lucide-react';
import './styles.css';

type Tab='hoy'|'biblia'|'sentir'|'empezar'|'planes'|'buscar'|'oracion'|'guardado'|'ajustes';
type Theme='dark'|'light'|'sepia';
type Testament='Antiguo Testamento'|'Nuevo Testamento';
type Verse={id:string;book:string;chapter:number;verse:number;text:string;testament:Testament;theme:string[]};
type Mood={id:string;name:string;keys:string[];verseIds:string[];note:string;prayer:string;action:string};
type BibleBook={bookName:string;testament:string;chapters:{chapter:number;verses:{verse:number;text:string}[]}[]};

const OT=['Génesis','Éxodo','Levítico','Números','Deuteronomio','Josué','Jueces','Rut','1 Samuel','2 Samuel','1 Reyes','2 Reyes','1 Crónicas','2 Crónicas','Esdras','Nehemías','Ester','Job','Salmos','Proverbios','Eclesiastés','Cantares','Isaías','Jeremías','Lamentaciones','Ezequiel','Daniel','Oseas','Joel','Amós','Abdías','Jonás','Miqueas','Nahum','Habacuc','Sofonías','Hageo','Zacarías','Malaquías'];
const NT=['Mateo','Marcos','Lucas','Juan','Hechos','Romanos','1 Corintios','2 Corintios','Gálatas','Efesios','Filipenses','Colosenses','1 Tesalonicenses','2 Tesalonicenses','1 Timoteo','2 Timoteo','Tito','Filemón','Hebreos','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan','3 Juan','Judas','Apocalipsis'];

const baseVerses:Verse[]=[
{id:'sal-23-1',book:'Salmos',chapter:23,verse:1,text:'Jehová es mi pastor; nada me faltará.',testament:'Antiguo Testamento',theme:['paz','cuidado','agradecido']},
{id:'sal-27-1',book:'Salmos',chapter:27,verse:1,text:'Jehová es mi luz y mi salvación: ¿de quién temeré?',testament:'Antiguo Testamento',theme:['miedo','proteccion']},
{id:'sal-34-18',book:'Salmos',chapter:34,verse:18,text:'Cercano está Jehová á los quebrantados de corazón.',testament:'Antiguo Testamento',theme:['tristeza','duelo','soledad']},
{id:'sal-46-1',book:'Salmos',chapter:46,verse:1,text:'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.',testament:'Antiguo Testamento',theme:['miedo','ansiedad']},
{id:'prov-3-5',book:'Proverbios',chapter:3,verse:5,text:'Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.',testament:'Antiguo Testamento',theme:['direccion','decision']},
{id:'isa-41-10',book:'Isaías',chapter:41,verse:10,text:'No temas, porque yo soy contigo; no desmayes, porque yo soy tu Dios.',testament:'Antiguo Testamento',theme:['miedo','animo']},
{id:'mat-6-34',book:'Mateo',chapter:6,verse:34,text:'Así que, no os congojéis por el día de mañana.',testament:'Nuevo Testamento',theme:['ansiedad','futuro']},
{id:'mat-11-28',book:'Mateo',chapter:11,verse:28,text:'Venid á mí todos los que estáis trabajados y cargados, que yo os haré descansar.',testament:'Nuevo Testamento',theme:['cansancio','descanso']},
{id:'juan-3-16',book:'Juan',chapter:3,verse:16,text:'Porque de tal manera amó Dios al mundo, que ha dado á su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',testament:'Nuevo Testamento',theme:['jesus','amor','empezar']},
{id:'juan-14-6',book:'Juan',chapter:14,verse:6,text:'Jesús le dice: Yo soy el camino, y la verdad, y la vida.',testament:'Nuevo Testamento',theme:['jesus','direccion']},
{id:'juan-14-27',book:'Juan',chapter:14,verse:27,text:'La paz os dejo, mi paz os doy: no como el mundo la da, yo os la doy.',testament:'Nuevo Testamento',theme:['paz','ansiedad','miedo']},
{id:'rom-8-28',book:'Romanos',chapter:8,verse:28,text:'Y sabemos que á los que á Dios aman, todas las cosas les ayudan á bien.',testament:'Nuevo Testamento',theme:['esperanza','duelo']},
{id:'rom-12-2',book:'Romanos',chapter:12,verse:2,text:'Y no os conforméis á este siglo; mas reformaos por la renovación de vuestro entendimiento.',testament:'Nuevo Testamento',theme:['jovenes','proposito']},
{id:'2cor-5-17',book:'2 Corintios',chapter:5,verse:17,text:'De modo que si alguno está en Cristo, nueva criatura es.',testament:'Nuevo Testamento',theme:['culpa','empezar','nuevo']},
{id:'fil-4-6',book:'Filipenses',chapter:4,verse:6,text:'Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración y ruego.',testament:'Nuevo Testamento',theme:['ansiedad','oracion']},
{id:'1tim-4-12',book:'1 Timoteo',chapter:4,verse:12,text:'Ninguno tenga en poco tu juventud; pero sé ejemplo de los fieles.',testament:'Nuevo Testamento',theme:['jovenes','proposito']},
{id:'1ped-5-7',book:'1 Pedro',chapter:5,verse:7,text:'Echando toda vuestra solicitud en él, porque él tiene cuidado de vosotros.',testament:'Nuevo Testamento',theme:['ansiedad','cuidado']},
{id:'1juan-1-9',book:'1 Juan',chapter:1,verse:9,text:'Si confesamos nuestros pecados, él es fiel y justo para que nos perdone nuestros pecados.',testament:'Nuevo Testamento',theme:['perdon','culpa']}
];

const moods:Mood[]=[
{id:'ansiedad',name:'Ansiedad',keys:['ansiedad','ansioso','ansiosa','preocupado','preocupada','nervioso','estresado','angustia','futuro','no puedo dormir'],verseIds:['fil-4-6','mat-6-34','1ped-5-7','juan-14-27'],note:'No tenés que cargar todo el futuro hoy. Entregale a Dios lo que no podés controlar.',prayer:'Señor, ordená mi mente y dame paz.',action:'Respirá lento y orá una frase simple.'},
{id:'miedo',name:'Miedo',keys:['miedo','temor','asustado','asustada','panico','pánico','inseguro','peligro'],verseIds:['isa-41-10','sal-27-1','sal-46-1','juan-14-27'],note:'El miedo puede hablar fuerte, pero no tiene la última palabra.',prayer:'Dios, acompañame y guardá mi camino.',action:'No te aísles; hablá con alguien de confianza.'},
{id:'tristeza',name:'Tristeza o soledad',keys:['triste','tristeza','dolor','duelo','vacio','vacío','solo','sola','soledad','deprimido','desanimado'],verseIds:['sal-34-18','rom-8-28','juan-14-27','mat-11-28'],note:'Dios no desprecia tu dolor. Podés acercarte sin fingir.',prayer:'Señor, sosteneme hoy.',action:'Hablá con una persona segura.'},
{id:'cansancio',name:'Cansancio',keys:['cansado','cansada','agotado','agotada','sin fuerzas','quemado','fundido','no puedo mas','no puedo más','exhausto'],verseIds:['mat-11-28','sal-23-1','fil-4-6','isa-41-10'],note:'Jesús no te pide aparentar fuerza. Te invita a descansar.',prayer:'Señor, renová mis fuerzas.',action:'Hacé una pausa de cinco minutos.'},
{id:'culpa',name:'Culpa o perdón',keys:['culpa','culpable','falle','fallé','pecado','perdon','perdón','arrepentido','verguenza','vergüenza'],verseIds:['1juan-1-9','2cor-5-17','juan-3-16','prov-3-5'],note:'Dios no te llama para destruirte, sino para levantarte.',prayer:'Dios, ayudame a reparar y empezar de nuevo.',action:'Corregí lo que puedas corregir.'},
{id:'direccion',name:'Dirección',keys:['decision','decisión','decidir','no se que hacer','no sé qué hacer','direccion','dirección','confundido','duda','camino','guia','guía'],verseIds:['prov-3-5','juan-14-6','rom-12-2','sal-27-1'],note:'A veces Dios guía paso a paso.',prayer:'Señor, dame sabiduría.',action:'Anotá la decisión y pedí consejo sabio.'},
{id:'agradecido',name:'Agradecimiento',keys:['agradecido','agradecida','gracias','feliz','contento','bendecido','alegre','en paz'],verseIds:['sal-23-1','rom-8-28','1tim-4-12','juan-14-27'],note:'La gratitud también es una forma de fe.',prayer:'Gracias, Dios, por acompañarme.',action:'Compartí ánimo con alguien.'},
{id:'empezar',name:'Acercarme a Jesús',keys:['jesus','jesús','dios','fe','creer','empezar','lejos de dios','quiero acercarme'],verseIds:['juan-14-6','juan-3-16','2cor-5-17','1juan-1-9'],note:'No necesitás entender todo para dar el primer paso.',prayer:'Dios, si sos real, quiero conocerte.',action:'Leé Juan 3 y Juan 14 sin apuro.'}
];

const startPath=[{day:1,title:'Dios te ama',reading:'Juan 3',idea:'El punto de partida no es tu perfección, sino el amor de Dios.'},{day:2,title:'Jesús es el camino',reading:'Juan 14',idea:'Jesús se presenta como camino hacia el Padre.'},{day:3,title:'Una nueva vida',reading:'2 Corintios 5',idea:'Acercarse a Dios también es empezar de nuevo.'},{day:4,title:'Entregar la ansiedad',reading:'Filipenses 4',idea:'Orar es llevarle a Dios lo que pesa.'},{day:5,title:'Perdón real',reading:'1 Juan 1',idea:'Dios perdona y limpia al que vuelve.'},{day:6,title:'Propósito joven',reading:'1 Timoteo 4',idea:'Tu edad no te descalifica para vivir con fe.'},{day:7,title:'Caminar con paz',reading:'Salmos 23',idea:'Dios acompaña el camino, no solo el inicio.'}];
const plans=[
  {id:'empezar7',title:'7 días para empezar con Jesús',days:startPath.map(d=>d.reading)},
  {id:'jovenes14',title:'14 días para jóvenes con propósito',days:[
    '1 Timoteo 4','Romanos 12','Filipenses 4','Proverbios 3','Eclesiastés 12','1 Corintios 13',
    'Efesios 6','Salmos 119','Daniel 1','Josué 1','Mateo 5','2 Timoteo 2','Santiago 1','Salmos 1'
  ]},
  {id:'ansiedad7',title:'7 días para bajar la ansiedad',days:[
    'Mateo 6','Filipenses 4','1 Pedro 5','Juan 14','Salmos 46','Salmos 23','Isaías 41'
  ]},
  {id:'salmos30',title:'Salmos en 30 días',days:[
    'Salmos 1','Salmos 8','Salmos 16','Salmos 19','Salmos 23','Salmos 27','Salmos 32',
    'Salmos 34','Salmos 37','Salmos 40','Salmos 42','Salmos 46','Salmos 51','Salmos 62',
    'Salmos 63','Salmos 73','Salmos 84','Salmos 86','Salmos 90','Salmos 91','Salmos 100',
    'Salmos 103','Salmos 121','Salmos 127','Salmos 130','Salmos 133','Salmos 139','Salmos 143',
    'Salmos 145','Salmos 150'
  ]},
  {id:'evangelios21',title:'21 días por los Evangelios',days:[
    'Mateo 5','Mateo 6','Mateo 7','Marcos 1','Marcos 4','Marcos 10','Lucas 6',
    'Lucas 10','Lucas 15','Lucas 18','Juan 1','Juan 3','Juan 4','Juan 6','Juan 8',
    'Juan 10','Juan 11','Juan 13','Juan 14','Juan 15','Juan 17'
  ]},
  {id:'duelo14',title:'14 días para atravesar el duelo',days:[
    'Salmos 23','Salmos 34','Salmos 42','Salmos 71','Salmos 73','Lamentaciones 3',
    'Juan 11','Juan 14','Romanos 8','2 Corintios 1','2 Corintios 4','1 Tesalonicenses 4',
    'Apocalipsis 21','Mateo 5'
  ]},
  {id:'mujeres14',title:'14 días con mujeres de fe',days:[
    'Génesis 21','Génesis 24','Éxodo 2','Rut 1','Rut 2','1 Samuel 1',
    'Ester 4','Proverbios 31','Lucas 1','Lucas 10','Juan 4','Hechos 16',
    'Hechos 18','2 Timoteo 1'
  ]},
  {id:'padres10',title:'10 días para padres y madres con propósito',days:[
    'Deuteronomio 6','Salmos 127','Salmos 128','Proverbios 22','Proverbios 31',
    'Efesios 6','Colosenses 3','1 Tesalonicenses 2','3 Juan 1','Mateo 18'
  ]},
  {id:'casados21',title:'21 días para matrimonios sanos',days:[
    'Génesis 2','Cantares 2','Cantares 8','Proverbios 5','Proverbios 18',
    'Eclesiastés 4','Malaquías 2','Mateo 5','Mateo 19','Marcos 10',
    '1 Corintios 7','1 Corintios 13','Efesios 4','Efesios 5','Filipenses 2',
    'Colosenses 3','Hebreos 13','1 Pedro 3','1 Pedro 4','1 Juan 4','Apocalipsis 19'
  ]},
  {id:'emprender14',title:'14 días para emprender con fe',days:[
    'Génesis 1','Eclesiastés 9','Eclesiastés 11','Proverbios 6','Proverbios 16',
    'Proverbios 21','Proverbios 31','Isaías 40','Mateo 25','Lucas 14',
    'Lucas 16','Romanos 12','Colosenses 3','Santiago 4'
  ]},
  {id:'sanacion14',title:'14 días de sanación interior',days:[
    'Salmos 6','Salmos 30','Salmos 51','Salmos 91','Salmos 103','Salmos 116',
    'Salmos 147','Isaías 53','Isaías 61','Jeremías 17','Mateo 11','Marcos 5',
    'Lucas 8','1 Pedro 2'
  ]},
  {id:'desanimo7',title:'7 días cuando todo cuesta',days:[
    '1 Reyes 19','Salmos 42','Salmos 88','Lamentaciones 3',
    'Mateo 11','2 Corintios 4','Hebreos 12'
  ]},
  {id:'gratitud21',title:'21 días de gratitud',days:[
    'Salmos 100','Salmos 103','Salmos 107','Salmos 116','Salmos 118',
    'Salmos 136','Salmos 138','Salmos 145','1 Crónicas 16','Daniel 6',
    'Lucas 17','Filipenses 4','Colosenses 3','1 Tesalonicenses 5',
    '2 Corintios 9','Efesios 5','Hebreos 12','Apocalipsis 7','Salmos 95',
    'Salmos 96','Salmos 150'
  ]},
  {id:'promesas30',title:'30 promesas de Dios',days:[
    'Génesis 9','Génesis 12','Génesis 28','Éxodo 14','Deuteronomio 31',
    'Josué 1','Salmos 23','Salmos 27','Salmos 34','Salmos 91',
    'Isaías 40','Isaías 41','Isaías 43','Isaías 54','Isaías 55',
    'Jeremías 29','Jeremías 31','Ezequiel 36','Mateo 6','Mateo 28',
    'Juan 10','Juan 14','Romanos 8','2 Corintios 1','Filipenses 4',
    '2 Timoteo 1','Hebreos 13','Santiago 1','1 Pedro 5','Apocalipsis 21'
  ]},
  {id:'jesus-at21',title:'21 días: Jesús en el Antiguo Testamento',days:[
    'Génesis 3','Génesis 22','Éxodo 12','Levítico 16','Números 21',
    'Deuteronomio 18','Josué 5','Rut 4','2 Samuel 7','Salmos 22',
    'Salmos 110','Isaías 7','Isaías 9','Isaías 53','Jeremías 23',
    'Ezequiel 34','Daniel 7','Miqueas 5','Zacarías 9','Zacarías 12','Malaquías 4'
  ]}
];
const prayers=[['Primera oración','Dios, no sé todo, pero quiero acercarme. Mostrame quién sos y guiame paso a paso.'],['Paz mental','Señor, calmá mis pensamientos y ayudame a vivir este día con claridad.'],['Familia','Dios, cuidá mi casa y saná lo que duele.'],['Perdón','Señor, dame humildad para reconocer errores y fuerza para cambiar.']];

function useLocal<T>(key:string,initial:T){const [v,setV]=React.useState<T>(()=>{try{return JSON.parse(localStorage.getItem(key)||'') as T}catch{return initial}});React.useEffect(()=>localStorage.setItem(key,JSON.stringify(v)),[key,v]);return [v,setV] as const;}
function norm(s:string){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();}
function hash(s:string){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h;}
function day(){const n=new Date();return Math.floor((+n-+new Date(n.getFullYear(),0,0))/86400000);}
const HOURLY_PHRASES=[
  'La gracia de Dios es nueva cada mañana. — Lamentaciones 3:23',
  'En el silencio de la noche, el Señor cuida tus pasos. — Salmo 121:3',
  'No temas, porque Yo estoy contigo. — Isaías 41:10',
  'Descansa en Él; el que guarda a Israel no se adormece. — Salmo 121:4',
  'Antes del amanecer, Dios ya preparó tu camino. — Salmo 139:16',
  'Los que buscan al Señor de madrugada lo hallan. — Proverbios 8:17',
  'Este es el día que hizo el Señor; alegrémonos en él. — Salmo 118:24',
  'Tu palabra es lámpara a mis pies y lumbrera a mi camino. — Salmo 119:105',
  'Todo lo puedo en Cristo que me fortalece. — Filipenses 4:13',
  'Buscad primero el reino de Dios y lo demás se os añadirá. — Mateo 6:33',
  'La fe es certeza de lo que se espera. — Hebreos 11:1',
  'Yo soy el camino, la verdad y la vida. — Juan 14:6',
  'Nada ni nadie nos puede separar del amor de Dios. — Romanos 8:38',
  'Porque tanto amó Dios al mundo que dio a su Hijo unigénito. — Juan 3:16',
  'No se turbe tu corazón ni tenga miedo. — Juan 14:27',
  'El amor es paciente, es benigno; no busca lo suyo. — 1 Corintios 13:4',
  'Pon tu carga sobre el Señor; Él te sostendrá. — Salmo 55:22',
  'Encomienda tus obras al Señor y tus planes se realizarán. — Proverbios 16:3',
  'Cuando pases por las aguas, yo estaré contigo. — Isaías 43:2',
  'Dad gracias en todo, porque esta es la voluntad de Dios. — 1 Tesalonicenses 5:18',
  'El Señor es mi pastor; nada me faltará. — Salmo 23:1',
  'La noche no te separa del amor del Señor. — Romanos 8:38',
  'Que tu noche sea guarecida bajo Sus alas. — Salmo 91:4',
  'Mientras duermes, Dios trabaja a tu favor. — Salmo 127:2',
];
function hourlyPhrase(){return HOURLY_PHRASES[new Date().getHours()];}
function vid(v:Verse){return v.id;}
function canon(b:string){const o=OT.indexOf(b);if(o>=0)return o;const n=NT.indexOf(b);return n>=0?100+n:999;}
function interpret(text:string,fallback:Mood){const input=norm(text);if(!input)return fallback;const scored=moods.map(m=>({m,score:m.keys.reduce((a,k)=>a+(input.includes(norm(k))?(norm(k).includes(' ')?7:3):0),0)})).sort((a,b)=>b.score-a.score);return scored[0].score>0?scored[0].m:fallback;}
function pick(ids:string[],seed:string,variant:number){const list=ids.map(id=>baseVerses.find(v=>v.id===id)).filter(Boolean) as Verse[];return list[(hash(norm(seed||'palabra viva'))+variant)%list.length]||baseVerses[0];}
function Card(p:{children:React.ReactNode;className?:string;onClick?:()=>void}){return <section className={`card ${p.className||''}`} onClick={p.onClick}>{p.children}</section>}
function Button(p:{children:React.ReactNode;onClick?:()=>void;variant?:'primary'|'ghost'}){return <button className={`btn ${p.variant||'primary'}`} onClick={p.onClick}>{p.children}</button>}
function VerseCard({verse,onSave,saved,onNote}:{verse:Verse;onSave:()=>void;saved:boolean;onNote?:()=>void}){
  const shareText=()=>{const text=`${verse.book} ${verse.chapter}:${verse.verse}\n\n${verse.text}\n\nCompartido desde Palabra Viva`;if(navigator.share)navigator.share({title:`${verse.book} ${verse.chapter}:${verse.verse}`,text});else navigator.clipboard.writeText(text);};
  const shareImage=()=>{const W=(window as any).PVShareVerse;if(W?.preview)W.preview({book:verse.book,chapter:verse.chapter,verse:verse.verse,text:verse.text});else shareText();};
  return <Card><p className="ref">{verse.book} {verse.chapter}:{verse.verse}</p><p className="verse">“{verse.text}”</p><div className="row wrap"><Button variant={saved?'ghost':'primary'} onClick={onSave}><Save size={16}/> {saved?'Guardado':'Guardar'}</Button><Button variant="ghost" onClick={shareImage} aria-label="Compartir como imagen">🖼️ Imagen</Button><Button variant="ghost" onClick={shareText} aria-label="Compartir como texto"><Share2 size={16}/> Texto</Button>{onNote&&<Button variant="ghost" onClick={onNote}>Nota</Button>}</div></Card>;
}
function MoodBox({value,setValue,result,setResult}:{value:string;setValue:(v:string)=>void;result:Mood;setResult:(m:Mood)=>void}){const [variant,setVariant]=React.useState(0);const verse=pick(result.verseIds,value||result.id,variant);const run=(txt=value)=>{setResult(interpret(txt,result));setVariant(v=>v+1)};return <Card className="moodBox"><p className="ref">Sentir</p><h3>¿Cómo te sentís hoy?</h3><p className="soft">Escribilo con tus palabras. Tocá “Otra palabra” para no repetir.</p><textarea className="moodInput" rows={3} value={value} onChange={e=>setValue(e.target.value)} placeholder="Ej: me siento ansioso, cansado, triste, lejos de Dios..."/><div className="chips moodChips">{moods.slice(0,6).map(m=><button className="chip" key={m.id} onClick={()=>{setValue(m.name);setResult(m);setVariant(v=>v+1)}}>{m.name}</button>)}</div><div className="row wrap"><Button onClick={()=>run()}>Buscar mi palabra</Button><Button variant="ghost" onClick={()=>setVariant(v=>v+1)}>Otra palabra</Button></div><div className="moodResult"><p className="ref">{verse.book} {verse.chapter}:{verse.verse}</p><h3>{result.name}</h3><p className="verse">“{verse.text}”</p><p>{result.note}</p><p><strong>Oración:</strong> {result.prayer}</p><p><strong>Acción pequeña:</strong> {result.action}</p><p className="soft">Interpretado desde: {value||result.name}</p></div></Card>}

function App(){const [tab,setTab]=React.useState<Tab>('hoy');const [theme,setTheme]=useLocal<Theme>('pv-theme','sepia');const [font,setFont]=useLocal('pv-font',18);const [saved,setSaved]=useLocal<string[]>('pv-saved',[]);const [progress,setProgress]=useLocal<Record<string,string[]>>('pv-progress',{});const [startDone,setStartDone]=useLocal<number[]>('pv-start-done',[]);const [query,setQuery]=React.useState('');const [bibleQuery,setBibleQuery]=React.useState('');const [moodText,setMoodText]=React.useState('');const [moodResult,setMoodResult]=React.useState<Mood>(moods[0]);const [bible,setBible]=React.useState<BibleBook[]>([]);const [testament,setTestament]=React.useState<Testament>('Nuevo Testamento');const [bookName,setBookName]=React.useState('Juan');const [chapter,setChapter]=React.useState(3);const [bibleStatus,setBibleStatus]=React.useState('Cargando Biblia...');const todayVerse=baseVerses[day()%baseVerses.length];
React.useEffect(()=>{document.body.dataset.theme=theme;document.documentElement.style.setProperty('--font-size',`${font}px`);if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{})},[theme,font]);
// Handler de query params del manifest (long-press del icono → ?go=biblia/sentir/radio)
React.useEffect(()=>{const p=new URLSearchParams(location.search);const g=p.get('go');if(!g)return;if(g==='biblia')setTab('biblia');else if(g==='sentir')setTab('sentir');else if(g==='radio'){setTimeout(()=>(window as any).PalabraVivaCanales?.openDial?.(),300);}if(p.has('go')){p.delete('go');const q=p.toString();history.replaceState(null,'',location.pathname+(q?'?'+q:''));}},[]);
// Rotación de tema accesible: dark → light → sepia → dark
const nextTheme=()=>setTheme(theme==='dark'?'light':theme==='light'?'sepia':'dark');
React.useEffect(()=>{fetch('/bible.rv1909.json').then(r=>r.ok?r.json():Promise.reject()).then(d=>{const books=(d.books||[]).filter((b:BibleBook)=>b.bookName&&Array.isArray(b.chapters)).sort((a:BibleBook,b:BibleBook)=>canon(a.bookName)-canon(b.bookName));setBible(books);if(books.length){const j=books.find((b:BibleBook)=>norm(b.bookName)==='juan')||books[0];setBookName(j.bookName);setTestament(j.testament==='Antiguo Testamento'?'Antiguo Testamento':'Nuevo Testamento');setChapter(j.chapters[2]?.chapter||1);setBibleStatus(books.length>=66?'Biblia Reina-Valera 1909 cargada.':'Biblia parcial cargada.')}}).catch(()=>setBibleStatus('Se muestra base curada.'))},[]);
const allVerses:Verse[]=React.useMemo(()=>{const gen=bible.flatMap(b=>b.chapters.flatMap(c=>c.verses.map(v=>({id:`${b.bookName}-${c.chapter}-${v.verse}`,book:b.bookName,chapter:c.chapter,verse:v.verse,text:v.text,testament:b.testament as Testament,theme:[]}))));return gen.length?gen:baseVerses},[bible]);
const bookOptions=(bible.length?bible.map(b=>({name:b.bookName,testament:b.testament})):Array.from(new Set(baseVerses.map(v=>v.book))).map(name=>({name,testament:baseVerses.find(v=>v.book===name)?.testament||'Nuevo Testamento'}))).filter(b=>b.testament===testament).sort((a,b)=>canon(a.name)-canon(b.name)).map(b=>b.name);
const selected=bible.find(b=>b.bookName===bookName);const chapters=selected?selected.chapters.map(c=>c.chapter):Array.from(new Set(baseVerses.filter(v=>v.book===bookName).map(v=>v.chapter))).sort((a,b)=>a-b);const visible:Verse[]=selected?(selected.chapters.find(c=>c.chapter===chapter)?.verses||[]).map(v=>({id:`${bookName}-${chapter}-${v.verse}`,book:bookName,chapter,verse:v.verse,text:v.text,testament:selected.testament as Testament,theme:[]})):baseVerses.filter(v=>v.book===bookName&&v.chapter===chapter);
const bibleResults=allVerses.filter(v=>v.testament===testament).filter(v=>{const q=norm(bibleQuery);return q&&(norm(v.text).includes(q)||norm(v.book).includes(q)||`${norm(v.book)} ${v.chapter}`.includes(q))}).slice(0,80);const globalResults=allVerses.filter(v=>{const q=norm(query);return !q||norm(v.text).includes(q)||norm(v.book).includes(q)||v.theme.some(t=>norm(t).includes(q)||q.includes(norm(t)))}).slice(0,80);
const toggleSave=(id:string)=>setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);const openRef=(ref:string)=>{const m=ref.match(/^(.+?)\s+(\d+)/);if(!m)return;const found=(bible.length?bible.map(b=>b.bookName):Array.from(new Set(baseVerses.map(v=>v.book)))).find(b=>norm(b)===norm(m[1])||norm(b).includes(norm(m[1])));if(found){const t=bible.find(b=>b.bookName===found)?.testament||baseVerses.find(v=>v.book===found)?.testament||'Nuevo Testamento';setTestament(t as Testament);setBookName(found);setChapter(Number(m[2]));setBibleQuery('');setTab('biblia')}};const changeTestament=(t:Testament)=>{setTestament(t);setBibleQuery('');const first=(bible.length?bible.map(b=>({name:b.bookName,testament:b.testament})):Array.from(new Set(baseVerses.map(v=>v.book))).map(name=>({name,testament:baseVerses.find(v=>v.book===name)?.testament||'Nuevo Testamento'}))).filter(b=>b.testament===t).sort((a,b)=>canon(a.name)-canon(b.name))[0];if(first){setBookName(first.name);setChapter(1)}};
return <main className="app"><header className="topbar"><div><span className="eyebrow">Palabra Viva</span><h1>{tab==='hoy'?'Una palabra para hoy':titleFor(tab)}</h1></div><button className="icon" onClick={nextTheme} aria-label={`Cambiar tema, actual: ${theme}`} title="Cambiar tema (oscuro / claro / sepia)">{theme==='dark'?<Sun/>:theme==='light'?<Moon/>:<Sparkles/>}</button></header>{tab==='hoy'&&<div className="stack"><Card className="visualControls"><div><p className="ref">Pantalla</p><h3>Lectura cómoda</h3></div><div className="screenTools"><button className={theme==='dark'?'tool active':'tool'} onClick={()=>setTheme('dark')}>Oscuro</button><button className={theme==='light'?'tool active':'tool'} onClick={()=>setTheme('light')}>Claro</button><button className={theme==='sepia'?'tool active':'tool'} onClick={()=>setTheme('sepia')}>Sepia</button><button className="tool" onClick={()=>setFont(Math.max(16,font-1))}>A-</button><button className="tool" onClick={()=>setFont(Math.min(24,font+1))}>A+</button></div></Card><section className="hero"><div className="pill"><Sparkles size={16}/> Palabra diaria</div><h2>Fe clara para el día real.</h2><p>{hourlyPhrase()}</p></section><VerseCard verse={todayVerse} saved={saved.includes(vid(todayVerse))} onSave={()=>toggleSave(vid(todayVerse))}/><MoodBox value={moodText} setValue={setMoodText} result={moodResult} setResult={setMoodResult}/><div className="grid2"><Card className="mini" onClick={()=>setTab('biblia')}><BookOpen/> Leer Biblia</Card><Card className="mini" onClick={()=>setTab('sentir')}><Heart/> Sentir</Card><Card className="mini" onClick={()=>setTab('empezar')}><Cross/> Empezar</Card><Card className="mini" onClick={()=>setTab('planes')}><CalendarDays/> Planes</Card></div></div>}{tab==='sentir'&&<div className="stack"><Card className="gradient"><h2>Decilo como te salga</h2><p>Escribí cómo venís. Tocá “Otra palabra” para cambiar el versículo relacionado.</p></Card><MoodBox value={moodText} setValue={setMoodText} result={moodResult} setResult={setMoodResult}/><Card className="warning"><ShieldCheck/><p>Palabra Viva no reemplaza ayuda médica, psicológica, pastoral ni emergencias. Si estás en peligro, hablá ahora con una persona de confianza o emergencias locales.</p></Card></div>}{tab==='empezar'&&<div className="stack"><Card className="gradient"><h2>Primeros 7 días con Jesús</h2><p>Una ruta simple para empezar o volver.</p></Card>{startPath.map(i=>{const done=startDone.includes(i.day);return <Card key={i.day}><p className="ref">Día {i.day}</p><h3>{i.title}</h3><p>{i.idea}</p><p className="soft">Lectura: {i.reading}</p><div className="row wrap"><Button onClick={()=>openRef(i.reading)}>📖 Leer</Button><Button variant="ghost" onClick={()=>(window as any).PalabraVivaAudioBible?.play?.(i.reading)}>🎧 Escuchar</Button><Button variant="ghost" onClick={()=>setStartDone(ds=>done?ds.filter(d=>d!==i.day):[...ds,i.day])}>{done?'Desmarcar':'Marcar como vivido'}</Button></div></Card>})}</div>}{tab==='biblia'&&<div className="stack"><Card className="gradient"><h2>Biblia</h2><p>{bibleStatus}</p></Card><Card><div className="testamentTabs"><button className={testament==='Antiguo Testamento'?'testament active':'testament'} onClick={()=>changeTestament('Antiguo Testamento')}>Antiguo Testamento</button><button className={testament==='Nuevo Testamento'?'testament active':'testament'} onClick={()=>changeTestament('Nuevo Testamento')}>Nuevo Testamento</button></div><input className="search" value={bibleQuery} onChange={e=>setBibleQuery(e.target.value)} placeholder={`Buscar en ${testament}`}/></Card>{bibleQuery.trim()?<>{bibleResults.length===0&&<Card><p>No encontré resultados.</p></Card>}{bibleResults.map(v=><VerseCard key={vid(v)} verse={v} saved={saved.includes(vid(v))} onSave={()=>toggleSave(vid(v))}/>)}</>:<><Card><label className="fieldLabel">Libro<select className="select" value={bookName} onChange={e=>{setBookName(e.target.value);setChapter(1)}}>{bookOptions.map(b=><option key={b}>{b}</option>)}</select></label><label className="fieldLabel">Capítulo<select className="select" value={chapter} onChange={e=>setChapter(Number(e.target.value))}>{chapters.map(c=><option key={c} value={c}>Capítulo {c}</option>)}</select></label></Card>{visible.map(v=><VerseCard key={vid(v)} verse={v} saved={saved.includes(vid(v))} onSave={()=>toggleSave(vid(v))}/>)}</>}</div>}{tab==='planes'&&<div className="stack">{plans.map(p=><Card key={p.id}><div className="row between"><h3>{p.title}</h3><span className="badge">{Math.round(((progress[p.id]?.length||0)/p.days.length)*100)}%</span></div><p className="soft" style={{margin:'4px 0 10px',fontSize:13}}>{p.days.length} lecturas — tocá 🎧 para escuchar o ➜ para leer</p>{p.days.map((d,i)=>{const done=progress[p.id]?.includes(d);return <div className="planrow" key={p.id+'-'+i}><label className="check"><input type="checkbox" checked={!!done} onChange={()=>setProgress(pr=>({...pr,[p.id]:done?(pr[p.id]||[]).filter(x=>x!==d):[...(pr[p.id]||[]),d]}))}/><span>Día {i+1}: {d}</span></label><div className="row" style={{gap:6}}><Button variant="ghost" onClick={()=>(window as any).PalabraVivaAudioBible?.play?.(d)} title="Escuchar en audio">🎧</Button><Button variant="ghost" onClick={()=>openRef(d)} title="Leer">➜</Button></div></div>})}</Card>)}</div>}{tab==='buscar'&&<div className="stack"><Card><input className="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ej: Jesús, ansiedad, paz, perdón..."/></Card>{globalResults.map(v=><VerseCard key={vid(v)} verse={v} saved={saved.includes(vid(v))} onSave={()=>toggleSave(vid(v))}/>)}</div>}{tab==='oracion'&&<div className="stack">{prayers.map(([t,p])=><Card key={t}><p className="ref">{t}</p><p>{p}</p></Card>)}</div>}{tab==='guardado'&&<div className="stack">{saved.length===0&&<Card><p>Todavía no guardaste versículos.</p></Card>}{allVerses.filter(v=>saved.includes(vid(v))).slice(0,100).map(v=><VerseCard key={vid(v)} verse={v} saved onSave={()=>toggleSave(vid(v))}/>)}</div>}{tab==='ajustes'&&<div className="stack"><Card><h3>👤 Mi cuenta</h3><AuthBlock/></Card><AdminCard/><Card><h3>Apariencia</h3><div className="row wrap"><Button onClick={()=>setTheme('dark')}>🌙 Oscuro</Button><Button onClick={()=>setTheme('light')}>☀️ Claro</Button><Button onClick={()=>setTheme('sepia')}>📜 Sepia</Button></div></Card><Card><h3>Tamaño de letra</h3><p className="soft">Actual: {font}px</p><div className="row wrap"><Button onClick={()=>setFont(Math.max(16,font-1))}>A-  Reducir</Button><Button onClick={()=>setFont(Math.min(28,font+1))}>A+ Agrandar</Button><Button variant="ghost" onClick={()=>setFont(18)}>Volver al normal</Button></div></Card><Card><h3>Ayuda</h3><div className="row wrap"><Button onClick={()=>(window as any).PVFeedback?.open?.()}>💌 Enviar sugerencia</Button><Button variant="ghost" onClick={()=>(window as any).PVOnboarding?.show?.()}>👋 Ver tour</Button><Button variant="ghost" onClick={()=>(window as any).PVAuth?.shareInviteLink?.()}>📤 Compartir</Button></div></Card><Card><h3>Legal y privacidad</h3><p className="soft">Cómo cuidamos tus datos y los términos para usar la app.</p><div className="row wrap"><Button variant="ghost" onClick={()=>(window as any).PVLegal?.openPrivacy?.()}>🔐 Política de privacidad</Button><Button variant="ghost" onClick={()=>(window as any).PVLegal?.openTerms?.()}>📜 Términos de uso</Button></div></Card><Card><h3>Acerca de</h3><p>Palabra Viva — versión 0.3</p><p className="soft">App cristiana gratuita: Biblia Reina-Valera 1909, audio narrado, radios cristianas en vivo, planes de lectura y oración.</p><p className="soft">Hecha con ❤️ por Mariela Alejandra Masmu. Todos los derechos reservados.</p></Card></div>}<nav className="bottom" aria-label="Navegación principal"><Nav icon={<Home/>} label="Hoy" active={tab==='hoy'} onClick={()=>setTab('hoy')}/><Nav icon={<BookOpen/>} label="Biblia" active={tab==='biblia'} onClick={()=>setTab('biblia')}/><Nav icon={<Cross/>} label="Empezar" active={tab==='empezar'} onClick={()=>setTab('empezar')}/><Nav icon={<Heart/>} label="Sentir" active={tab==='sentir'} onClick={()=>setTab('sentir')}/><Nav icon={<CalendarDays/>} label="Planes" active={tab==='planes'} onClick={()=>setTab('planes')}/></nav><div className="quick" aria-label="Acciones rápidas"><button onClick={()=>setTab('buscar')} aria-label="Buscar en la Biblia">Buscar</button><button onClick={()=>setTab('guardado')} aria-label="Versículos guardados">Guardado</button><button onClick={()=>setTab('oracion')} aria-label="Oraciones">Oración</button><button onClick={()=>setTab('ajustes')} aria-label="Ajustes"><Settings size={16}/></button></div></main>}
function titleFor(t:Tab){return ({hoy:'Hoy',biblia:'Biblia',sentir:'¿Cómo te sentís?',empezar:'Empezar con Jesús',planes:'Planes',buscar:'Buscar',oracion:'Oraciones',guardado:'Guardado',ajustes:'Ajustes'} as Record<Tab,string>)[t]}
function Nav(p:{icon:React.ReactNode;label:string;active:boolean;onClick:()=>void}){return <button className={p.active?'nav active':'nav'} onClick={p.onClick} aria-label={p.label} aria-current={p.active?'page':undefined}>{p.icon}<span>{p.label}</span></button>}

// Bloque de cuenta para Ajustes: muestra usuario logueado y botón Cerrar sesión,
// o bien botones Entrar / Crear cuenta si no hay sesión.
function AuthBlock(){
  const [user,setUser]=React.useState<any>(null);
  React.useEffect(()=>{
    const W=window as any;
    const sync=()=>setUser(W.PVAuth?.getUser?.()||null);
    sync();
    document.addEventListener('pv-auth-change',sync);
    const t=setInterval(sync,1500);
    return ()=>{document.removeEventListener('pv-auth-change',sync);clearInterval(t);};
  },[]);
  const W=window as any;
  if(!user){
    return <div className="stack" style={{gap:10}}>
      <p className="soft">No iniciaste sesión. Iniciá sesión para guardar tus versículos y progreso entre dispositivos.</p>
      <div className="row wrap">
        <Button onClick={()=>W.PVAuth?.openModal?.('login')}>▶ Entrar</Button>
        <Button variant="ghost" onClick={()=>W.PVAuth?.openModal?.('register')}>✨ Crear cuenta</Button>
      </div>
    </div>;
  }
  const name=user.profile?.display_name||user.email?.split('@')[0]||'Vos';
  return <div className="stack" style={{gap:10}}>
    <p style={{margin:0}}><strong>👤 {name}</strong></p>
    <p className="soft" style={{margin:0,fontSize:14}}>{user.email}</p>
    <div className="row wrap">
      <Button variant="ghost" onClick={()=>{if(confirm(`¿Cerrar sesión de ${name}?`))W.PVAuth?.signOut?.()}} aria-label="Cerrar sesión">🚪 Cerrar sesión</Button>
      <Button variant="ghost" onClick={()=>W.PVAuth?.shareInviteLink?.()}>📤 Compartir</Button>
    </div>
  </div>;
}
// Card de Panel Admin: solo visible si el usuario actual es admin.
// La pongo en Ajustes para que siempre exista una vía CLARA de abrir el panel
// aunque los botones de la barra inferior fallen por overlays huérfanos.
function AdminCard(){
  const [isAdm,setIsAdm]=React.useState(false);
  React.useEffect(()=>{
    const W=window as any;
    const sync=()=>setIsAdm(!!W.PVAuth?.isAdmin?.());
    sync();
    document.addEventListener('pv-auth-change',sync);
    const t=setInterval(sync,2000);
    return ()=>{document.removeEventListener('pv-auth-change',sync);clearInterval(t);};
  },[]);
  if(!isAdm) return null;
  const W=window as any;
  return <Card className="adminCard">
    <h3 style={{color:'var(--brand)'}}>⚙️ Panel de administración</h3>
    <p className="soft" style={{margin:'4px 0 12px'}}>Gestioná usuarios, sugerencias, peticiones de oración, errores y métricas del sistema.</p>
    <Button onClick={()=>{
      // Intentar abrir el panel; si falla, usar URL hash como fallback
      try {
        if(W.PVAdmin?.open) W.PVAdmin.open();
        else location.hash='#admin';
      } catch(e){
        console.warn('[Admin] error abriendo:',e);
        location.hash='#admin';
      }
    }}>⚙️ Abrir panel admin</Button>
  </Card>;
}
createRoot(document.getElementById('root')!).render(<App/>);
