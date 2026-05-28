(() => {
  // ── Biblioteca emocional bíblica — v3 ─────────────────────────────────────
  // Versículos agrupados por tema emocional, más de 120 entradas
  const V = {
    // ── Paz / Descanso ──────────────────────────────────────────────────────
    sal4_8:   ['Salmos 4:8',    'En paz me acostaré y dormiré; porque solo tú, Señor, me haces vivir confiado.'],
    sal16_8:  ['Salmos 16:8',   'A Jehová he puesto siempre delante de mí; porque está a mi diestra, no seré movido.'],
    sal16_11: ['Salmos 16:11',  'En tu presencia hay plenitud de gozo; a tu diestra hay delicias para siempre.'],
    sal23_1:  ['Salmos 23:1',   'El Señor es mi pastor; nada me faltará.'],
    sal23_4:  ['Salmos 23:4',   'Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo.'],
    sal29_11: ['Salmos 29:11',  'Jehová dará poder a su pueblo; Jehová bendecirá a su pueblo con paz.'],
    sal46_10: ['Salmos 46:10',  'Estad quietos y conoced que yo soy Dios.'],
    sal62_1:  ['Salmos 62:1',   'En Dios solamente está acallada mi alma; de él viene mi salvación.'],
    sal116_7: ['Salmos 116:7',  'Vuelve, oh alma mía, a tu reposo, porque el Señor te ha hecho bien.'],
    sal131_2: ['Salmos 131:2',  'He acallado y aquietado mi alma; como un niño destetado de su madre, como un niño destetado está mi alma.'],
    isa26_3:  ['Isaías 26:3',   'Tú guardarás en completa paz a aquel cuyo pensamiento en ti persevera, porque en ti ha confiado.'],
    mat11_28: ['Mateo 11:28',   'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.'],
    mat11_29: ['Mateo 11:29',   'Llevad mi yugo sobre vosotros… y hallaréis descanso para vuestras almas.'],
    juan14_27:['Juan 14:27',    'La paz os dejo, mi paz os doy; no como el mundo la da, yo os la doy.'],
    fil4_7:   ['Filipenses 4:7','La paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos.'],
    fil4_6:   ['Filipenses 4:6','Por nada estéis afanosos; sino sean conocidas vuestras peticiones delante de Dios.'],
    // ── Fortaleza / Ánimo ───────────────────────────────────────────────────
    sal18_2:  ['Salmos 18:2',   'Jehová, roca mía y castillo mío, mi libertador; Dios mío, fortaleza mía.'],
    sal27_14: ['Salmos 27:14',  'Aguarda a Jehová; esfuérzate, y aliéntese tu corazón; espera en Jehová.'],
    sal28_7:  ['Salmos 28:7',   'Jehová es mi fortaleza y mi escudo; en él confió mi corazón y fui ayudado.'],
    sal31_24: ['Salmos 31:24',  'Esforzaos todos vosotros los que esperáis en Jehová, y tome aliento vuestro corazón.'],
    sal73_26: ['Salmos 73:26',  'Mi carne y mi corazón desfallecen, pero la roca de mi corazón y mi porción es Dios para siempre.'],
    sal46_1:  ['Salmos 46:1',   'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.'],
    isa40_29: ['Isaías 40:29',  'El da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningunas.'],
    isa40_31: ['Isaías 40:31',  'Los que esperan en Jehová tendrán nuevas fuerzas; levantarán alas como las águilas.'],
    isa41_10: ['Isaías 41:10',  'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo.'],
    fil4_13:  ['Filipenses 4:13','Todo lo puedo en Cristo que me fortalece.'],
    ef6_10:   ['Efesios 6:10',  'Fortaleceos en el Señor y en el poder de su fuerza.'],
    tim2_1_7: ['2 Timoteo 1:7', 'Dios no nos ha dado espíritu de cobardía, sino de poder, de amor y de dominio propio.'],
    zac4_6:   ['Zacarías 4:6',  'No con ejército, ni con fuerza, sino con mi Espíritu, dice Jehová de los ejércitos.'],
    // ── Miedo / Inseguridad ─────────────────────────────────────────────────
    sal23_4b: ['Salmos 23:4',   'Aunque ande en sombra de muerte, no temeré mal alguno; tu vara y tu cayado me infundirán aliento.'],
    sal27_1:  ['Salmos 27:1',   'Jehová es mi luz y mi salvación; ¿de quién temeré? Jehová es la fortaleza de mi vida; ¿de quién me esternaré?'],
    sal34_4:  ['Salmos 34:4',   'Busqué a Jehová y él me oyó, y me libró de todos mis temores.'],
    sal56_3:  ['Salmos 56:3',   'En el día que temo, yo en ti confío.'],
    sal91_1:  ['Salmos 91:1',   'El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente.'],
    sal91_2:  ['Salmos 91:2',   'Diré yo a Jehová: Esperanza mía y castillo mío; mi Dios, en quien confiaré.'],
    prov29_25:['Proverbios 29:25','El temor al hombre es un lazo; mas el que confía en Jehová estará seguro.'],
    isa43_2:  ['Isaías 43:2',   'Cuando pases por las aguas, yo estaré contigo; y si por los ríos, no te anegarán.'],
    juan1_4_18:['1 Juan 4:18',  'En el amor no hay temor; el perfecto amor echa fuera el temor.'],
    heb13_6:  ['Hebreos 13:6',  'El Señor es mi ayudador; no temeré lo que me pueda hacer el hombre.'],
    // ── Tristeza / Dolor ────────────────────────────────────────────────────
    sal30_5:  ['Salmos 30:5',   'Por la noche durará el lloro, y a la mañana vendrá la alegría.'],
    sal34_18: ['Salmos 34:18',  'Cercano está Jehová a los quebrantados de corazón, y salvará a los contritos de espíritu.'],
    sal42_11: ['Salmos 42:11',  '¿Por qué te abates, oh alma mía, y por qué te turbas dentro de mí? Espera en Dios.'],
    sal147_3: ['Salmos 147:3',  'Él sana a los quebrantados de corazón y venda sus heridas.'],
    rom8_28:  ['Romanos 8:28',  'Sabemos que a los que aman a Dios, todas las cosas les ayudan a bien.'],
    apoc21_4: ['Apocalipsis 21:4','Enjugará Dios toda lágrima de los ojos de ellos; y ya no habrá muerte, ni habrá llanto.'],
    sal34_19: ['Salmos 34:19',  'Muchas son las aflicciones del justo, pero de todas ellas lo librará Jehová.'],
    sal69_20: ['Salmos 69:20',  'Busqué quien se compadeciera, y no lo hallé… solo Dios.'],
    lam3_22:  ['Lamentaciones 3:22','Por la misericordia de Jehová no hemos sido consumidos, porque nunca decayeron sus misericordias.'],
    lam3_23:  ['Lamentaciones 3:23','Son nuevas cada mañana; grande es tu fidelidad.'],
    juan11_35:['Juan 11:35',    'Jesús lloró.'],
    cor2_1_3: ['2 Corintios 1:3','Bendito el Dios y Padre… Padre de misericordias y Dios de toda consolación.'],
    // ── Soledad / Abandono ──────────────────────────────────────────────────
    sal22_24: ['Salmos 22:24',  'No menospreció ni abominó la aflicción del afligido, ni le ocultó su rostro; sino que cuando clamó a él, le oyó.'],
    sal139_7: ['Salmos 139:7',  '¿A dónde me iré de tu Espíritu? ¿Y a dónde huiré de tu presencia?'],
    isa49_16: ['Isaías 49:16',  'En las palmas de mis manos te tengo esculpida; tus muros están siempre delante de mí.'],
    mat28_20: ['Mateo 28:20',   'Y yo estoy con vosotros todos los días, hasta el fin del mundo.'],
    heb13_5:  ['Hebreos 13:5',  'No te desampararé ni te dejaré.'],
    rom8_38:  ['Romanos 8:38-39','Ni la muerte, ni la vida… ni ninguna otra cosa creada nos podrá separar del amor de Dios.'],
    juan10_27:['Juan 10:27',    'Mis ovejas oyen mi voz, y yo las conozco, y me siguen.'],
    // ── Ansiedad / Estrés ───────────────────────────────────────────────────
    sal55_22: ['Salmos 55:22',  'Echa sobre Jehová tu carga y él te sustentará; no dejará para siempre caído al justo.'],
    sal94_19: ['Salmos 94:19',  'En la multitud de mis pensamientos dentro de mí, tus consolaciones alegraban mi alma.'],
    ped1_5_7: ['1 Pedro 5:7',   'Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.'],
    mat6_34:  ['Mateo 6:34',    'No os afanéis por el día de mañana; el día de mañana traerá su afán.'],
    mat6_27:  ['Mateo 6:27',    '¿Y quién de vosotros podrá añadir a su estatura un codo por mucho que se afane?'],
    sal37_5:  ['Salmos 37:5',   'Encomienda a Jehová tu camino, y confía en él; y él hará.'],
    juan14_1: ['Juan 14:1',     'No se turbe vuestro corazón; creéis en Dios, creed también en mí.'],
    // ── Esperanza ───────────────────────────────────────────────────────────
    jer29_11: ['Jeremías 29:11','Yo sé los pensamientos que tengo acerca de vosotros… pensamientos de paz, para daros el fin que esperáis.'],
    jer31_17: ['Jeremías 31:17','Hay esperanza para tu porvenir, dice Jehová.'],
    sal42_5:  ['Salmos 42:5',   'Espera en Dios, porque aún he de alabarle, salvación mía y Dios mío.'],
    sal71_14: ['Salmos 71:14',  'Mas yo esperaré siempre, y te alabaré más y más.'],
    sal130_5: ['Salmos 130:5',  'Esperé yo a Jehová, esperó mi alma; en su palabra he esperado.'],
    rom15_13: ['Romanos 15:13', 'El Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza.'],
    rom8_24:  ['Romanos 8:24',  'En esperanza fuimos salvos; pero la esperanza que se ve ya no es esperanza.'],
    cor2_4_17:['2 Corintios 4:17','Leve tribulación momentánea produce para nosotros un eterno y más que todo peso de gloria.'],
    juan16_33:['Juan 16:33',    'En el mundo tendréis aflicción; pero confiad, yo he vencido al mundo.'],
    // ── Culpa / Perdón ──────────────────────────────────────────────────────
    sal51_10: ['Salmos 51:10',  'Crea en mí, oh Dios, un corazón limpio, y renueva un espíritu recto dentro de mí.'],
    sal103_12:['Salmos 103:12', 'Cuanto está lejos el oriente del occidente, hizo alejar de nosotros nuestras rebeliones.'],
    isa1_18:  ['Isaías 1:18',   'Venid luego, dice Jehová, y estemos a cuenta: si vuestros pecados fueren como la grana, como la nieve serán emblanquecidos.'],
    isa44_22: ['Isaías 44:22',  'Yo deshice como una nube tus rebeliones, y como niebla tus pecados; vuélvete a mí, porque yo te redimí.'],
    juan1_1_9:['1 Juan 1:9',    'Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados y limpiar toda maldad.'],
    rom8_1:   ['Romanos 8:1',   'Ahora pues, ninguna condenación hay para los que están en Cristo Jesús.'],
    miq7_18:  ['Miqueas 7:18',  'Tú arrojarás en lo profundo del mar todos nuestros pecados.'],
    cor2_5_17:['2 Corintios 5:17','Si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron, todas son hechas nuevas.'],
    heb4_16:  ['Hebreos 4:16',  'Acerquémonos pues confiadamente al trono de la gracia, para alcanzar misericordia.'],
    // ── Enojo / Relaciones ──────────────────────────────────────────────────
    prov15_1: ['Proverbios 15:1','La respuesta suave aplaca la ira; pero la palabra hiriente hace subir el furor.'],
    prov16_32:['Proverbios 16:32','Mejor es el que tarda en airarse que el fuerte; el que gobierna su espíritu, que el que toma una ciudad.'],
    efe4_26:  ['Efesios 4:26',  'Airaos, pero no pequéis; no se ponga el sol sobre vuestro enojo.'],
    efe4_31:  ['Efesios 4:31',  'Quítense de vosotros toda amargura, enojo, ira, gritería y maledicencia.'],
    efe4_32:  ['Efesios 4:32',  'Antes sed benignos unos con otros, misericordiosos, perdonándoos unos a otros.'],
    col3_13:  ['Colosenses 3:13','Soportándoos unos a otros, y perdonándoos unos a otros si alguno tuviere queja contra otro.'],
    sant1_19: ['Santiago 1:19', 'Sea todo hombre pronto para oír, tardo para hablar, tardo para airarse.'],
    rom12_21: ['Romanos 12:21', 'No seas vencido de lo malo, sino vence con el bien el mal.'],
    prov21_23:['Proverbios 21:23','El que guarda su boca y su lengua guarda de angustias su alma.'],
    mat5_9:   ['Mateo 5:9',     'Bienaventurados los pacificadores, porque ellos serán llamados hijos de Dios.'],
    // ── Propósito / Dirección ───────────────────────────────────────────────
    prov3_5:  ['Proverbios 3:5','Confía en Jehová con todo tu corazón, y no te apoyes en tu propia prudencia.'],
    prov3_6:  ['Proverbios 3:6','Reconócelo en todos tus caminos, y él enderezará tus veredas.'],
    prov16_3: ['Proverbios 16:3','Encomienda a Jehová tus obras, y tus pensamientos serán afirmados.'],
    sal119_105:['Salmos 119:105','Lámpara es a mis pies tu palabra, y lumbrera a mi camino.'],
    sant1_5:  ['Santiago 1:5',  'Si alguno de vosotros tiene falta de sabiduría, pídala a Dios, quien da a todos abundantemente.'],
    juan14_6: ['Juan 14:6',     'Yo soy el camino, y la verdad, y la vida.'],
    jer1_5:   ['Jeremías 1:5',  'Antes que te formase en el vientre te conocí, y antes que nacieses te santifiqué.'],
    rom12_2:  ['Romanos 12:2',  'Transformaos por la renovación de vuestro entendimiento, para que comprobéis cuál sea la buena voluntad de Dios.'],
    sal37_23: ['Salmos 37:23',  'Por Jehová son ordenados los pasos del hombre, y él aprueba su camino.'],
    // ── Fe / Confianza ──────────────────────────────────────────────────────
    sal9_10:  ['Salmos 9:10',   'Los que conocen tu nombre pondrán en ti su confianza, porque tú, Jehová, no desamparaste a los que te buscaron.'],
    sal112_7: ['Salmos 112:7',  'No tendrá temor de malas noticias; su corazón está firme, confiado en Jehová.'],
    hab2_4:   ['Habacuc 2:4',   'El justo vivirá por su fe.'],
    heb11_1:  ['Hebreos 11:1',  'La fe es la certeza de lo que se espera, la convicción de lo que no se ve.'],
    juan3_16: ['Juan 3:16',     'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito.'],
    rom1_17:  ['Romanos 1:17',  'El justo por la fe vivirá.'],
    mar9_23:  ['Marcos 9:23',   'Si puedes creer, al que cree todo le es posible.'],
    prov16_20:['Proverbios 16:20','El que confía en Jehová, bienaventurado es.'],
    // ── Alegría / Gratitud ──────────────────────────────────────────────────
    sal118_24:['Salmos 118:24', 'Este es el día que hizo Jehová; regocijémonos y alegrémonos en él.'],
    sal100_4: ['Salmos 100:4',  'Entrad por sus puertas con acción de gracias, por sus atrios con alabanza; alabadle, bendecid su nombre.'],
    fil4_4:   ['Filipenses 4:4','Regocijaos en el Señor siempre. Otra vez digo: ¡Regocijaos!'],
    neh8_10:  ['Nehemías 8:10', 'El gozo de Jehová es vuestra fuerza.'],
    sal33_1:  ['Salmos 33:1',   'Alegraos, oh justos, en Jehová; en los íntegros es hermosa la alabanza.'],
    sal103_2: ['Salmos 103:2',  'Bendice, alma mía, a Jehová, y no olvides ninguno de sus beneficios.'],
    // ── Cansancio / Desgaste ────────────────────────────────────────────────
    isa40_28: ['Isaías 40:28',  'No se cansa ni se fatiga el Creador… da esfuerzo al cansado.'],
    gal6_9:   ['Gálatas 6:9',   'No nos cansemos de hacer bien, porque a su tiempo segaremos, si no desmayamos.'],
    sal23_2:  ['Salmos 23:2-3', 'En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará.'],
    mat11_30: ['Mateo 11:30',   'Porque mi yugo es fácil y ligera mi carga.'],
    sal18_16: ['Salmos 18:16',  'Extendió desde lo alto su mano y me tomó; me sacó de las muchas aguas.'],
    // ── Tentación / Lucha ───────────────────────────────────────────────────
    cor1_10_13:['1 Corintios 10:13','No os ha sobrevenido ninguna tentación que no sea humana; fiel es Dios, que no os dejará ser tentados más de lo que podéis resistir.'],
    heb4_15:  ['Hebreos 4:15',  'No tenemos un sumo sacerdote que no pueda compadecerse de nuestras debilidades, sino uno que fue tentado en todo.'],
    sant4_7:  ['Santiago 4:7',  'Someteos a Dios. Resistid al diablo y huirá de vosotros.'],
    juan8_36: ['Juan 8:36',     'Si el Hijo os libertare, seréis verdaderamente libres.'],
    rom6_14:  ['Romanos 6:14',  'El pecado no se enseñoreará de vosotros.'],
    // ── Identidad / Autoestima ──────────────────────────────────────────────
    sal139_14:['Salmos 139:14', 'Te alabaré; porque formidables y maravillosas son tus obras.'],
    ef2_10:   ['Efesios 2:10',  'Somos hechura suya, creados en Cristo Jesús para buenas obras.'],
    gal3_26:  ['Gálatas 3:26',  'Todos sois hijos de Dios por la fe en Cristo Jesús.'],
    rom8_16:  ['Romanos 8:16',  'El Espíritu mismo da testimonio a nuestro espíritu de que somos hijos de Dios.'],
    juan1_12: ['Juan 1:12',     'A todos los que le recibieron, les dio potestad de ser hechos hijos de Dios.'],
    isa43_1:  ['Isaías 43:1',   'No temas, porque yo te redimí; te puse nombre, mío eres tú.'],
    isa62_4:  ['Isaías 62:4',   'Nunca más te llamarán Desamparada… sino que serás llamada Mi deleite.'],
    // ── Economía / Provisión ────────────────────────────────────────────────
    sal37_25: ['Salmos 37:25',  'Fui joven, y he envejecido, y no he visto justo desamparado, ni su descendencia que mendigue pan.'],
    mat6_33:  ['Mateo 6:33',    'Buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.'],
    fil4_19:  ['Filipenses 4:19','Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús.'],
    luc12_24: ['Lucas 12:24',   'Considerad los cuervos, que ni siembran ni siegan; Dios los alimenta. ¿Cuánto más valéis vosotros que las aves?'],
    prov28_25:['Proverbios 28:25','El que confía en Jehová prosperará.'],
    // ── Renovación / Nuevo comienzo ─────────────────────────────────────────
    rom12_2b: ['Romanos 12:2',  'Transformaos por la renovación de vuestro entendimiento, para discernir la buena y perfecta voluntad de Dios.'],
    isa43_19: ['Isaías 43:19',  'He aquí que yo hago cosa nueva; pronto saldrá a luz. ¿No la conoceréis?'],
    lam3_22:  ['Lamentaciones 3:22','Por la misericordia de Jehová no hemos sido consumidos.'],
    apoc21_5: ['Apocalipsis 21:5','He aquí, yo hago nuevas todas las cosas.'],
    juan8_32: ['Juan 8:32',     'Y conoceréis la verdad, y la verdad os libertará.'],
    tim1_4_12:['1 Timoteo 4:12','Ninguno tenga en poco tu juventud; sé ejemplo de los creyentes.']
  };

  // ── Agrupación de estados emocionales → versículos ───────────────────────
  const r = (...ids) => ids.map(i => V[i]).filter(Boolean);
  const DATA = [
    // URGENTE
    { g:'🚨 Urgente', id:'crisis', label:'No puedo más / peligro', urgent:true,
      keys:['no quiero vivir','me quiero matar','suicidio','hacerme daño','no aguanto más','no aguanto mas','quiero desaparecer','estoy en peligro','quiero morir'],
      refs:r('sal34_18','sal46_1','mat11_28','juan14_27','heb13_5','apoc21_4','sal147_3','rom8_38'),
      note:'Esto es serio. Una app no puede reemplazar la ayuda humana.',
      prayer:'Dios, sosteneme en este minuto y acercá a alguien que pueda ayudarme.',
      action:'Llamá a emergencias o hablá ahora mismo con una persona de confianza.' },
    // PAZ
    { g:'🕊 Paz y descanso', id:'ansiedad', label:'Ansiedad / preocupación',
      keys:['ansiedad','ansioso','ansiosa','preocupado','preocupada','nervioso','nerviosa','estresado','estresada','angustia','no puedo dormir','mente acelerada'],
      refs:r('fil4_6','fil4_7','ped1_5_7','mat6_34','sal55_22','juan14_27','sal62_1','isa26_3','sal94_19','sal37_5','juan14_1'),
      note:'No tenés que cargar el futuro entero hoy.',
      prayer:'Señor, ordená mi mente y dame tu paz.',
      action:'Respirá lento y entregale a Dios lo que no podés controlar.' },
    { g:'🕊 Paz y descanso', id:'paz', label:'Necesito paz / quietud',
      keys:['necesito paz','no tengo paz','quiero calma','mi mente no para','quietud','tranquilidad'],
      refs:r('juan14_27','fil4_7','sal4_8','sal46_10','sal116_7','sal131_2','sal62_1','isa26_3','mat11_28','mat11_29'),
      note:'La paz de Dios puede sostenerte por dentro aunque afuera no cambie todo.',
      prayer:'Señor, aquietá mi corazón.',
      action:'Hacé silencio un minuto y repetí una oración corta.' },
    { g:'🕊 Paz y descanso', id:'dormir', label:'No puedo dormir',
      keys:['dormir','insomnio','no puedo descansar','noche','me desvelo','quiero descansar'],
      refs:r('sal4_8','juan14_27','sal23_1','ped1_5_7','fil4_7','sal116_7','sal131_2'),
      note:'No necesitás llevar todas las cargas a la cama.',
      prayer:'Señor, recibo tu paz. Dejo este día en tus manos.',
      action:'Apagá pantallas unos minutos y orá en silencio.' },
    // FORTALEZA
    { g:'💪 Fortaleza', id:'cansancio', label:'Cansancio / agotamiento',
      keys:['cansado','cansada','agotado','agotada','sin fuerzas','quemado','quemada','exhausto','exhausta','no puedo más','fundido'],
      refs:r('mat11_28','mat11_29','isa40_29','isa40_31','sal73_26','fil4_13','gal6_9','sal23_2','mat11_30','sal18_16'),
      note:'Jesús no te pide aparentar fuerza. Te invita a descansar en él.',
      prayer:'Señor, renová mis fuerzas.',
      action:'Hacé una pausa real de cinco minutos.' },
    { g:'💪 Fortaleza', id:'debilidad', label:'Me siento débil / sin ánimo',
      keys:['debil','débil','sin animo','sin ánimo','me siento débil','no tengo fuerzas','frágil'],
      refs:r('fil4_13','isa40_31','sal18_2','sal46_1','tim2_1_7','zac4_6','sal28_7','sal31_24','cor1_10_13'),
      note:'La debilidad puede ser el lugar donde Dios te sostiene.',
      prayer:'Señor, sé mi fuerza hoy.',
      action:'Elegí solo el próximo paso, no todo el camino.' },
    { g:'💪 Fortaleza', id:'miedo', label:'Miedo / inseguridad',
      keys:['miedo','temor','asustado','asustada','pánico','panico','inseguro','insegura','no me animo','temblando'],
      refs:r('isa41_10','sal27_1','sal34_4','sal56_3','sal91_1','sal91_2','juan1_4_18','isa43_2','heb13_6','prov29_25','tim2_1_7'),
      note:'El miedo puede hablar fuerte, pero no tiene la última palabra.',
      prayer:'Dios, acompañame y guardá mi camino.',
      action:'No te aísles; hablá con alguien de confianza.' },
    // DOLOR
    { g:'💔 Dolor emocional', id:'tristeza', label:'Tristeza / llanto',
      keys:['triste','tristeza','llorar','llorando','deprimido','deprimida','bajoneado','sin ganas','me siento mal'],
      refs:r('sal34_18','sal30_5','sal147_3','rom8_28','apoc21_4','lam3_22','lam3_23','cor2_1_3','juan11_35','sal34_19'),
      note:'Dios no desprecia tu dolor. Podés acercarte sin fingir.',
      prayer:'Señor, sosteneme hoy.',
      action:'Hablá con una persona segura.' },
    { g:'💔 Dolor emocional', id:'soledad', label:'Soledad / abandono',
      keys:['solo','sola','soledad','abandonado','abandonada','nadie me entiende','aislado','aislada','me siento solo','me siento sola'],
      refs:r('isa41_10','sal22_24','sal34_18','sal139_7','mat28_20','heb13_5','rom8_38','isa49_16','juan10_27'),
      note:'Estar solo no significa estar olvidado por Dios.',
      prayer:'Señor, haceme sentir tu cercanía.',
      action:'Mandá un mensaje corto a alguien confiable.' },
    { g:'💔 Dolor emocional', id:'duelo', label:'Duelo / pérdida',
      keys:['duelo','perdida','pérdida','murió','murio','falleció','fallecio','luto','extraño','se fue','perdí a alguien'],
      refs:r('sal34_18','apoc21_4','rom8_28','juan14_27','sal30_5','cor2_1_3','juan11_35','sal147_3','lam3_22'),
      note:'El duelo necesita tiempo. Dios no apura tu dolor.',
      prayer:'Señor, acompañame en esta pérdida.',
      action:'Permitite llorar y buscá compañía sana.' },
    // RELACIONES
    { g:'🤝 Relaciones', id:'enojo', label:'Enojo / ira / bronca',
      keys:['enojo','enojado','enojada','bronca','ira','rabia','furia','resentido','resentida','discusión','discusion'],
      refs:r('prov15_1','prov16_32','efe4_26','efe4_31','efe4_32','sant1_19','rom12_21','col3_13','mat5_9','prov21_23'),
      note:'Sentir enojo no te obliga a actuar desde el enojo.',
      prayer:'Señor, dame dominio propio y palabras sabias.',
      action:'No respondas en caliente. Esperá y bajá el tono.' },
    { g:'🤝 Relaciones', id:'perdon', label:'Necesito perdonar',
      keys:['perdonar','perdón','perdon','me hirieron','me lastimaron','resentimiento','rencor','no puedo perdonar'],
      refs:r('col3_13','efe4_32','mat5_9','rom12_21','sal103_12','miq7_18','sal51_10'),
      note:'Perdonar no niega el daño; ayuda a no vivir preso de él.',
      prayer:'Señor, ayudame a soltar el rencor con sabiduría.',
      action:'No fuerces todo hoy; empezá pidiendo ayuda a Dios.' },
    { g:'🤝 Relaciones', id:'familia', label:'Problemas familiares',
      keys:['familia','familiar','mi casa','mis hijos','mi esposa','mi esposo','mis padres','mi mamá','mi papá','pelea familiar'],
      refs:r('prov15_1','mat5_9','col3_13','efe4_32','sant1_19','rom12_21','sal23_1'),
      note:'Dios también quiere trabajar en tus palabras y tu paciencia.',
      prayer:'Señor, traé paz y sabiduría a mi familia.',
      action:'Buscá una conversación tranquila, no una pelea.' },
    { g:'🤝 Relaciones', id:'amor', label:'Corazón roto / amor',
      keys:['amor','pareja','novio','novia','relación','relacion','corazón roto','me dejaron','amar bien'],
      refs:r('juan3_16','col3_13','mat5_9','juan1_4_18','rom8_38','sal34_18','isa49_16'),
      note:'El amor sano no destruye tu paz ni tu identidad.',
      prayer:'Señor, enseñame a amar con verdad y sabiduría.',
      action:'No tomes decisiones desde la herida del momento.' },
    // INTERIOR
    { g:'🔦 Vida interior', id:'culpa', label:'Culpa / vergüenza',
      keys:['culpa','culpable','fallé','falle','pecado','vergüenza','verguenza','me equivoqué','no merezco','arrepentido'],
      refs:r('juan1_1_9','sal51_10','rom8_1','cor2_5_17','heb4_16','isa1_18','isa44_22','sal103_12','miq7_18'),
      note:'Dios no te llama para destruirte, sino para levantarte.',
      prayer:'Dios, perdóname y ayudame a empezar de nuevo.',
      action:'Corregí lo que puedas corregir y seguí adelante.' },
    { g:'🔦 Vida interior', id:'tentacion', label:'Tentación / adicción',
      keys:['tentación','tentacion','tentado','tentada','vicio','adicción','adiccion','caigo otra vez','no puedo dejar'],
      refs:r('cor1_10_13','heb4_15','sant4_7','juan8_36','rom6_14','fil4_13','isa41_10'),
      note:'Una caída no tiene que ser tu identidad.',
      prayer:'Dios, dame salida, fuerza y honestidad.',
      action:'Alejate de la situación que te empuja a caer.' },
    { g:'🔦 Vida interior', id:'identidad', label:'Quién soy / autoestima',
      keys:['quién soy','quien soy','no valgo','no sirvo','me siento feo','me siento fea','no me acepto','me odio','autoestima'],
      refs:r('sal139_14','ef2_10','gal3_26','rom8_16','juan1_12','isa43_1','isa62_4','jer1_5'),
      note:'Tu valor no depende de cómo te sentís hoy.',
      prayer:'Señor, ayudame a verme como vos me ves.',
      action:'Nombrá una cosa que Dios valora en vos.' },
    // RUMBO
    { g:'🧭 Rumbo y decisiones', id:'decisiones', label:'No sé qué hacer',
      keys:['decisión','decision','decidir','no sé qué hacer','no se que hacer','confundido','confundida','dudas','guía','guia','elección','eleccion'],
      refs:r('prov3_5','prov3_6','sant1_5','juan14_6','jer29_11','sal119_105','prov16_3','sal37_23','rom12_2'),
      note:'A veces Dios guía paso a paso, no de golpe.',
      prayer:'Señor, dame sabiduría.',
      action:'Anotá la decisión y pedí consejo sabio.' },
    { g:'🧭 Rumbo y decisiones', id:'proposito', label:'Sin propósito / desmotivado',
      keys:['sin propósito','sin proposito','desmotivado','desmotivada','para qué','para que','nada tiene sentido','vacío','vacio'],
      refs:r('jer29_11','ef2_10','jer1_5','rom12_2','tim1_4_12','sal119_105','gal6_9','sal37_23'),
      note:'El propósito vuelve con pasos pequeños, no siempre con grandes emociones.',
      prayer:'Dios, reordená mi corazón y mi camino.',
      action:'Hacé una cosa pequeña que te acerque a la vida.' },
    { g:'🧭 Rumbo y decisiones', id:'nuevo', label:'Quiero empezar de nuevo',
      keys:['empezar de nuevo','nuevo comienzo','quiero cambiar','volver a empezar','renovar','nueva vida'],
      refs:r('cor2_5_17','sal51_10','rom12_2b','isa43_19','apoc21_5','lam3_22','juan8_32','heb4_16'),
      note:'Dios puede trabajar con una vida que decide volver.',
      prayer:'Señor, renová mi corazón y mis pasos.',
      action:'Elegí un cambio pequeño y concreto para hoy.' },
    // VIDA PRÁCTICA
    { g:'⚡ Vida práctica', id:'dinero', label:'Problemas económicos',
      keys:['dinero','plata','deuda','deudas','económico','economico','no llego','cuentas','pagar','finanzas'],
      refs:r('sal55_22','mat6_33','fil4_19','luc12_24','prov28_25','sal37_25','sal37_5','prov16_3'),
      note:'La preocupación económica pesa, pero no tenés que resolver todo en pánico.',
      prayer:'Señor, dame provisión, orden y sabiduría.',
      action:'Anotá prioridades reales y evitá decisiones impulsivas.' },
    { g:'⚡ Vida práctica', id:'trabajo', label:'Trabajo / presión laboral',
      keys:['trabajo','jefe','presión','laboral','empresa','exigido','exigida','turno','laburo','cansancio laboral'],
      refs:r('prov16_3','sal55_22','gal6_9','fil4_13','mat11_28','isa40_29','sal37_5'),
      note:'Tu valor no depende solo de tu rendimiento.',
      prayer:'Señor, dame orden, fuerza y calma para trabajar bien.',
      action:'Separá lo urgente de lo importante hoy.' },
    { g:'⚡ Vida práctica', id:'estudio', label:'Estudio / exámenes',
      keys:['estudio','estudiar','examen','facultad','escuela','no entiendo','me cuesta aprender','aprender'],
      refs:r('sant1_5','prov3_5','sal119_105','rom12_2','tim1_4_12','ef6_10'),
      note:'Aprender también requiere paciencia, humildad y constancia.',
      prayer:'Señor, dame claridad y disciplina.',
      action:'Estudiá 20 minutos sin distracciones.' },
    // MOMENTOS DEL DÍA
    { g:'🌅 Momentos', id:'despertar', label:'Al despertar / comenzar el día',
      keys:['al despertar','buenos días','buen dia','mañana','comenzar el día','nuevo día','hoy empiezo'],
      refs:r('sal118_24','lam3_23','sal23_1','prov16_3','rom12_2','sal119_105','mat6_33'),
      note:'El día no tiene que empezar en automático.',
      prayer:'Señor, guiá mis pasos hoy.',
      action:'Elegí una intención simple para este día.' },
    { g:'🌅 Momentos', id:'agradecido', label:'Agradecimiento / alegría',
      keys:['agradecido','agradecida','gracias','feliz','contento','contenta','bendecido','alegre','alegría','en paz'],
      refs:r('sal118_24','sal100_4','fil4_4','neh8_10','sal33_1','sal103_2','rom8_28','lam3_23'),
      note:'La gratitud también es una forma de fe.',
      prayer:'Gracias, Dios, por acompañarme.',
      action:'Compartí ánimo con alguien hoy.' },
    // FE
    { g:'✝ Fe', id:'fe', label:'Me cuesta creer',
      keys:['me cuesta creer','dudo','duda de dios','no siento a dios','perdí la fe','perdi la fe','crisis de fe'],
      refs:r('juan14_6','sal42_5','heb11_1','heb4_16','mar9_23','sal9_10','rom1_17','hab2_4'),
      note:'La fe también puede empezar con una oración honesta.',
      prayer:'Dios, ayudame en mi incredulidad.',
      action:'Leé un pasaje corto y hablá con Dios sin actuar.' },
    { g:'✝ Fe', id:'esperanza', label:'Sin esperanza / todo va mal',
      keys:['sin esperanza','no veo salida','todo va mal','desesperanza','futuro oscuro','todo está mal'],
      refs:r('jer29_11','jer31_17','sal42_5','sal71_14','rom15_13','rom8_24','cor2_4_17','juan16_33','sal130_5'),
      note:'La esperanza bíblica no niega la realidad; mira más allá de ella.',
      prayer:'Señor, encendé esperanza en mí.',
      action:'Hacé una cosa pequeña que te acerque a la vida.' },
    { g:'✝ Fe', id:'jesus', label:'Acercarme a Jesús / empezar',
      keys:['jesus','jesús','quiero acercarme','no conozco a dios','lejos de dios','empezar con dios','quiero creer'],
      refs:r('juan3_16','juan14_6','cor2_5_17','heb4_16','juan8_32','isa43_1','juan1_12'),
      note:'No necesitás entender todo para dar el primer paso.',
      prayer:'Dios, si sos real, quiero conocerte.',
      action:'Leé Juan 3 y Juan 14 sin apuro.' }
  ];

  const clean = t => (t||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim();
  const hash  = t => { let h=0; for(let i=0;i<t.length;i++) h=(h*31+t.charCodeAt(i))>>>0; return h; };

  function interpret(text) {
    const input = clean(text);
    if (!input) return null;
    const scored = DATA.map(m => {
      let sc = m.urgent ? 0 : 0;
      m.keys.forEach(k => {
        const key = clean(k);
        if (input === key) sc += (m.urgent ? 50 : 30);
        else if (input.includes(key)) sc += key.includes(' ') ? 16 : 7;
      });
      return { m, sc };
    }).sort((a,b) => b.sc - a.sc);
    return scored[0].sc > 0 ? scored[0].m : null;
  }

  // ── Estilos ─────────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('sentir-v3-style')) return;
    const st = document.createElement('style');
    st.id = 'sentir-v3-style';
    st.textContent = `
      /* Barra de búsqueda superior */
      .sv3-search-wrap{position:relative;margin-bottom:14px}
      .sv3-search{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:18px;padding:13px 42px 13px 16px;font:inherit;font-size:16px;outline:none;box-sizing:border-box}
      .sv3-search:focus{border-color:var(--brand)}
      .sv3-search-clear{position:absolute;right:12px;top:50%;transform:translateY(-50%);border:0;background:none;color:var(--muted);font-size:18px;cursor:pointer;padding:4px;display:none}
      .sv3-search-clear.show{display:block}

      /* Grupos de estados */
      .sv3-groups{display:flex;flex-direction:column;gap:14px;margin-bottom:16px}
      .sv3-group-title{font-size:12px;font-weight:900;color:var(--brand);text-transform:uppercase;letter-spacing:.1em;margin:0 0 7px}
      .sv3-chips{display:flex;flex-wrap:wrap;gap:7px}
      .sv3-chip{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:14px;padding:10px 13px;font-size:14px;font-weight:700;cursor:pointer;transition:background .15s,border-color .15s;text-align:left;line-height:1.15}
      .sv3-chip:active{transform:scale(.97)}
      .sv3-chip.on{background:linear-gradient(135deg,var(--brand),var(--brand2));border-color:transparent;color:#fff}
      .sv3-chip.urgent{border-color:rgba(251,113,133,.5);color:#fb7185}
      .sv3-chip.urgent.on{background:linear-gradient(135deg,#ef4444,#dc2626)}

      /* Panel de resultado */
      .sv3-result{margin-top:4px;display:none}
      .sv3-result.show{display:block}
      .sv3-result-head{background:var(--card2);border:1px solid var(--line);border-radius:20px;padding:14px 16px;margin-bottom:10px}
      .sv3-result-label{font-size:13px;font-weight:900;color:var(--brand);text-transform:uppercase;letter-spacing:.07em;margin:0 0 4px}
      .sv3-result-note{font-size:14px;color:var(--text);margin:0 0 8px}
      .sv3-result-prayer{font-size:13px;color:var(--muted);margin:0 0 4px}
      .sv3-result-action{font-size:13px;color:var(--muted)}
      .sv3-result-action strong{color:var(--text)}

      /* Lista de versículos */
      .sv3-verses{display:flex;flex-direction:column;gap:8px}
      .sv3-verse-card{border-radius:16px;padding:0;overflow:hidden;position:relative;min-height:130px;background:#1a1a2e}
      .sv3-verse-bg{position:absolute;inset:0;background-size:cover;background-position:center;z-index:0}
      .sv3-verse-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.42),rgba(0,0,0,.70));z-index:1}
      .sv3-verse-content{position:relative;z-index:2;padding:14px}
      .sv3-verse-ref{font-size:12px;font-weight:900;color:rgba(255,255,255,.8);text-transform:uppercase;letter-spacing:.06em;margin:0 0 5px}
      .sv3-verse-txt{font-size:15px;line-height:1.5;margin:0;color:#fff;font-style:italic;text-shadow:0 1px 4px rgba(0,0,0,.6)}
      .sv3-verse-btns{display:flex;gap:6px;margin-top:10px}
      .sv3-verse-copy,.sv3-verse-share{border:1px solid rgba(255,255,255,.4);background:rgba(0,0,0,.35);color:rgba(255,255,255,.9);border-radius:999px;padding:4px 10px;font-size:11px;font-weight:900;cursor:pointer;backdrop-filter:blur(4px)}
      .sv3-verse-copy:active,.sv3-verse-share:active{background:rgba(255,255,255,.2)}

      /* Urgente */
      /* Urgente */
      .sv3-urgent-box{border:1px solid rgba(251,113,133,.4);background:rgba(251,113,133,.08);border-radius:16px;padding:14px;margin-bottom:10px}
      .sv3-urgent-box p{color:#fb7185;font-size:14px;margin:4px 0}

      /* Contador */
      .sv3-count{font-size:12px;color:var(--muted);margin:0 0 14px;display:block}

      @media(max-width:420px){.sv3-chip{font-size:13px;padding:9px 11px}}
    `;
    document.head.appendChild(st);
  }

  // ── Render principal ────────────────────────────────────────────────────
  function render(box) {
    if (box.dataset.sv === 'v3') return;
    box.dataset.sv = 'v3';
    injectStyles();

    const totalVerses = Object.keys(V).length;
    const totalStates = DATA.length;

    box.innerHTML = `
      <p class="ref">Biblioteca emocional bíblica</p>
      <h3>¿Cómo te sentís hoy?</h3>
      <p class="soft">Tocá cómo te sentís o escribilo y recibís todos los versículos relacionados.</p>
      <span class="sv3-count">${totalStates} estados · ${totalVerses}+ versículos</span>
      <div class="sv3-search-wrap">
        <input class="sv3-search" placeholder="🔍 Escribí cómo te sentís…" autocomplete="off">
        <button class="sv3-search-clear" title="Limpiar">✕</button>
      </div>
      <div class="sv3-groups"></div>
      <div class="sv3-result"></div>
    `;

    const searchEl  = box.querySelector('.sv3-search');
    const clearBtn  = box.querySelector('.sv3-search-clear');
    const groupsEl  = box.querySelector('.sv3-groups');
    const resultEl  = box.querySelector('.sv3-result');

    let selected = null;

    // ── Construir grupos y chips ────────────────────────────────────────
    const groups = {};
    DATA.forEach(m => { (groups[m.g] ||= []).push(m); });
    const chipMap = {};

    Object.entries(groups).forEach(([gname, list]) => {
      const wrap = document.createElement('div');
      wrap.innerHTML = `<div class="sv3-group-title">${gname}</div><div class="sv3-chips"></div>`;
      const chipsDiv = wrap.querySelector('.sv3-chips');
      list.forEach(m => {
        const btn = document.createElement('button');
        btn.className = 'sv3-chip' + (m.urgent ? ' urgent' : '');
        btn.textContent = m.label;
        btn.type = 'button';
        btn.onclick = () => selectMood(m, btn);
        chipsDiv.appendChild(btn);
        chipMap[m.id] = btn;
      });
      groupsEl.appendChild(wrap);
    });

    // ── Mostrar resultado ───────────────────────────────────────────────
    function selectMood(m, chipEl) {
      selected = m;
      // Deseleccionar todos, marcar éste
      Object.values(chipMap).forEach(b => b.classList.remove('on'));
      chipEl?.classList.add('on');
      searchEl.value = '';
      clearBtn.classList.remove('show');
      showResult(m);
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function showResult(m) {
      let html = '';

      if (m.urgent) {
        html += `<div class="sv3-urgent-box">
          <p><strong>⚠️ ${m.note}</strong></p>
          <p>${m.action}</p>
        </div>`;
      }

      html += `<div class="sv3-result-head">
        <p class="sv3-result-label">${m.label}</p>
        <p class="sv3-result-note">${m.note}</p>
        <p class="sv3-result-prayer">🙏 <em>${m.prayer}</em></p>
        <p class="sv3-result-action"><strong>Paso pequeño:</strong> ${m.action}</p>
      </div>`;

      const PEACE_IMGS = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=70',
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=70',
        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=70',
        'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&w=600&q=70',
        'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=600&q=70',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=70',
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=70',
        'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?auto=format&fit=crop&w=600&q=70',
        'https://images.unsplash.com/photo-1548679847-1d4ff48016c0?auto=format&fit=crop&w=600&q=70',
        'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=600&q=70',
        'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&w=600&q=70',
        'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600&q=70',
        'https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=600&q=70',
        'https://images.unsplash.com/photo-1518791841217-8f162f1912da?auto=format&fit=crop&w=600&q=70',
        'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=600&q=70',
        'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=600&q=70'
      ];
      html += `<div class="sv3-verses">`;
      m.refs.forEach(([ref, txt], idx) => {
        const img = PEACE_IMGS[(idx + m.refs.length * 3) % PEACE_IMGS.length];
        const safeRef = ref;
        const safeTxt = txt.replace(/"/g, '&quot;');
        html += `<div class="sv3-verse-card">
          <div class="sv3-verse-bg" style="background-image:url('${img}')"></div>
          <div class="sv3-verse-overlay"></div>
          <div class="sv3-verse-content">
            <p class="sv3-verse-ref">${ref}</p>
            <p class="sv3-verse-txt">&ldquo;${txt}&rdquo;</p>
            <div class="sv3-verse-btns">
              <button class="sv3-verse-copy" data-copy="${safeRef}: ${safeTxt}">📋 Copiar</button>
              <button class="sv3-verse-share" data-ref="${safeRef}" data-txt="${safeTxt}" data-img="${img}">🖼️ Compartir imagen</button>
            </div>
          </div>
        </div>`;
      });
      html += `</div>`;

      resultEl.innerHTML = html;
      resultEl.classList.add('show');

      resultEl.querySelectorAll('.sv3-verse-copy').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const text = btn.dataset.copy;
          if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).then(() => { btn.textContent = '✅ Copiado'; setTimeout(() => { btn.textContent = '📋 Copiar'; }, 1500); });
          } else {
            btn.textContent = '✅';
          }
        });
      });
      resultEl.querySelectorAll('.sv3-verse-share').forEach(btn => {
        btn.addEventListener('click', async e => {
          e.stopPropagation();
          const ref    = btn.dataset.ref;
          const txt    = btn.dataset.txt.replace(/&quot;/g, '"');
          const imgUrl = btn.dataset.img || '';
          const orig   = btn.innerHTML;
          btn.disabled = true;
          btn.innerHTML = '⏳ Generando…';

          // Intentar compartir como IMAGEN (WhatsApp status, Instagram, etc.)
          let ok = false;
          if (imgUrl && navigator.canShare) {
            try {
              const blob = await _buildVerseImg(imgUrl, ref, txt);
              const file = new File([blob], 'versiculo-palabraviva.jpg', { type: 'image/jpeg' });
              if (navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: ref });
                ok = true;
              }
            } catch(err) {
              console.warn('[Sentir] share imagen falló, usando texto:', err);
            }
          }

          // Fallback: texto + link
          if (!ok) {
            const shareText = ref + ': "' + txt + '" — Palabra Viva';
            if (navigator.share) {
              try { await navigator.share({ title: ref, text: shareText, url: 'https://palabraviva-ar.vercel.app' }); } catch {}
            } else if (navigator.clipboard?.writeText) {
              await navigator.clipboard.writeText(shareText);
              btn.innerHTML = '✅ Copiado';
              setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 1800);
              return;
            }
          }
          btn.innerHTML = orig;
          btn.disabled = false;
        });
      });

      // ── Canvas: genera JPEG 1080x1920 con fondo bíblico + versículo ──────
      async function _buildVerseImg(imgUrl, ref, txt) {
        const W = 1080, H = 1920;
        const cv = document.createElement('canvas');
        cv.width = W; cv.height = H;
        const ctx = cv.getContext('2d');

        // Cargar imagen de fondo (alta resolución, CORS habilitado en Unsplash)
        const bg = new Image();
        bg.crossOrigin = 'anonymous';
        const hiRes = imgUrl.replace(/w=\d+/, 'w=1080').replace(/q=\d+/, 'q=85');
        await new Promise((res, rej) => {
          bg.onload = res;
          bg.onerror = () => {
            // 2do intento sin CORS (canvas quedará tainted pero podemos intentar)
            const bg2 = new Image();
            bg2.onload = () => { ctx.drawImage(bg2, 0, 0, W, H); res(); };
            bg2.onerror = rej;
            bg2.src = imgUrl;
          };
          bg.src = hiRes;
        });

        // Dibujar imagen (cover)
        const sc = Math.max(W / bg.width, H / bg.height);
        const sw = bg.width * sc, sh = bg.height * sc;
        ctx.drawImage(bg, (W - sw) / 2, (H - sh) / 2, sw, sh);

        // Degradado oscuro
        const gr = ctx.createLinearGradient(0, 0, 0, H);
        gr.addColorStop(0,    'rgba(0,0,0,0.20)');
        gr.addColorStop(0.35, 'rgba(0,0,0,0.35)');
        gr.addColorStop(0.65, 'rgba(0,0,0,0.68)');
        gr.addColorStop(1,    'rgba(0,0,0,0.90)');
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, W, H);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Cruz decorativa
        ctx.font = '100px serif';
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fillText('✝', W / 2, H * 0.22);

        // Referencia (dorada)
        ctx.font = 'bold 54px sans-serif';
        ctx.fillStyle = 'rgba(245,158,11,0.95)';
        ctx.fillText(ref, W / 2, H * 0.43);

        // Versículo con word-wrap
        ctx.font = 'italic 60px Georgia, serif';
        ctx.fillStyle = '#ffffff';
        _wrapText(ctx, '“' + txt + '”', W / 2, H * 0.50, W - 140, 82);

        // Branding
        ctx.font = 'bold 38px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.50)';
        ctx.textBaseline = 'bottom';
        ctx.fillText('— Palabra Viva —', W / 2, H - 100);

        return new Promise(resolve => cv.toBlob(resolve, 'image/jpeg', 0.91));
      }

      function _wrapText(ctx, text, x, y, maxW, lineH) {
        const words = text.split(' ');
        let line = '';
        for (let i = 0; i < words.length; i++) {
          const test = line + words[i] + ' ';
          if (i > 0 && ctx.measureText(test).width > maxW) {
            ctx.fillText(line.trim(), x, y); y += lineH; line = words[i] + ' ';
          } else { line = test; }
        }
        if (line.trim()) ctx.fillText(line.trim(), x, y);
      }
    }


    // ── Búsqueda por texto ──────────────────────────────────────────────
    searchEl.addEventListener('input', () => {
      const q = searchEl.value.trim();
      clearBtn.classList.toggle('show', q.length > 0);
      if (!q) { return; }
      const m = interpret(q);
      if (m) {
        Object.values(chipMap).forEach(b => b.classList.remove('on'));
        chipMap[m.id]?.classList.add('on');
        selected = m;
        showResult(m);
      }
    });

    clearBtn.addEventListener('click', () => {
      searchEl.value = '';
      clearBtn.classList.remove('show');
      Object.values(chipMap).forEach(b => b.classList.remove('on'));
      resultEl.classList.remove('show');
      selected = null;
    });
  }

  function boot() { document.querySelectorAll('.moodBox').forEach(render); }
  setInterval(boot, 2500);
  boot();
})();
