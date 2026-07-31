const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'assets', 'bible.db');

const SEED_ARTICLES = [
  {
    title: 'Oraron',
    summary: '¿Sabías que la mayoría de las veces que se habla de hombres de Dios en las escrituras, podemos ver que siempre oraron?',
    content: `Orar es el acto más poderoso que un creyente puede realizar. A través de las Escrituras, vemos consistentemente que los hombres y mujeres de Dios eran personas de oración.

Cuando enfrentaban desafíos, oraban. Cuando estaban agradecidos, oraban. Cuando necesitaban dirección, oraban. La oración no era un ritual para ellos, sino un estilo de vida.

Jesús mismo nos dio el ejemplo perfecto. Se levantaba temprano para orar, pasaba noches enteras en comunión con el Padre, y en los momentos más críticos de su ministerio, recurría a la oración.

Hoy, Dios nos invita a acercarnos a Él mediante la oración. No necesitas palabras elocuentes ni fórmulas especiales. Solo necesitas un corazón sincero que busca a su Creador.

"Orad sin cesar" (1 Tesalonicenses 5:17) no es un mandamiento imposible, sino una invitación a mantener una conversación continua con Aquel que nos ama incondicionalmente.`,
    category: 'Meditaciones',
    date: '05/12/2022',
  },
  {
    title: 'Cuando Dios guiña los ojos',
    summary: 'Hay momentos donde no oímos a Dios, pero Él sí nos oye. Basado en testimonio de una madre.',
    content: `Hay momentos en la vida en los que sentimos que Dios guarda silencio. Oramos, clamamos, pero parece que el cielo está de bronce. Sin embargo, en esos momentos de aparente silencio, Dios está obrando.

Una madre compartió su testimonio: había orado durante años por sus hijos, sin ver resultados aparentes. En los momentos de mayor desesperación, cuando pensaba que Dios no escuchaba, Él actuaba de maneras inesperadas.

Dios no siempre responde de la manera que esperamos, pero siempre responde. A veces, cuando menos lo esperamos, vemos una "señal" que nos recuerda que Él está allí, cuidando de nosotros. Es como si Dios nos guiñara un ojo para decirnos: "Estoy aquí. No te he olvidado".

No importa cuán larga sea la espera, Dios es fiel. Él nunca abandona a sus hijos.`,
    category: 'Meditaciones',
    date: '15/06/2021',
  },
  {
    title: 'La poda de Dios',
    summary: 'Dios nos poda a través de personas y situaciones difíciles, así que agradece por ellas.',
    content: `En Juan 15, Jesús nos enseña acerca de la vid y los pámpanos. El Padre es el labrador que poda cada rama para que dé más fruto. La poda es un proceso necesario, aunque doloroso.

Dios utiliza personas y situaciones difíciles para podar nuestras vidas. A veces son críticas que hieren nuestro orgullo, otras veces son pérdidas que nos enseñan a valorar lo esencial, y en ocasiones son fracasos que nos recuerdan nuestra dependencia de Él.

La poda no es un castigo, es una bendición disfrazada. Dios nos poda para que seamos más fructíferos, no menos. Cada dificultad que enfrentamos tiene el potencial de producir en nosotros un carácter más semejante a Cristo.

Así que, cuando enfrentes tiempos de poda, recuerda que el Labrador sabe lo que hace. Confía en sus manos amorosas y permite que Él corte todo lo que impide tu crecimiento espiritual.`,
    category: 'Meditaciones',
    date: '25/03/2021',
  },
  {
    title: '¿Tú me amas?',
    summary: 'La negación de Pedro, su gravedad y la forma tan diferente como el hombre y Jesús lo tratarían.',
    content: `Después de la resurrección, Jesús se encontró con Pedro junto al mar de Tiberíades. Tres veces Pedro había negado conocer a Jesús, y tres veces Jesús le preguntó: "Simón, hijo de Jonás, ¿me amas?"

La restauración de Pedro es una de las historias más conmovedoras de la Biblia. Jesús no reprendió a Pedro por su negación, sino que lo restauró. No le recordó su fracaso, sino que lo reafirmó en su llamado.

La pregunta "¿Me amas?" era fundamental. Pedro necesitaba enfrentar su amor por Jesús antes de poder pastorear las ovejas. El amor a Cristo es la base de todo ministerio y servicio.

Jesús trata nuestros fracasos de manera radicalmente diferente a como los trata el mundo. El mundo te condena por tus errores; Jesús te restaura y te da una nueva oportunidad. La gracia no solo perdona, sino que también restaura el propósito.`,
    category: 'Meditaciones',
    date: '15/04/2021',
  },
  {
    title: 'Isaías 56:12 - Mejor explicación',
    summary: '¿Qué significa Isaías 56:12? Echa un vistazo a la explicación dada por los mejores comentarios bíblicos.',
    content: `"Vengan, busquemos vino y emborrachémonos con cerveza, y será este día como ayer, y mucho más excelente." (Isaías 56:12)

Este versículo contrasta fuertemente con el llamado de Dios a la fidelidad y la justicia. Aquí vemos a líderes ciegos que buscan solo su propio placer, ignorando sus responsabilidades espirituales.

El profeta Isaías denuncia a aquellos que, en lugar de velar por el pueblo de Dios, buscan satisfacer sus propios deseos. Es una advertencia contra el egoísmo espiritual y la negligencia en el liderazgo.

Dios llama a sus siervos a ser vigilantes y responsables, no a buscar el placer egoísta mientras el pueblo perece. Este pasaje nos recuerda que el liderazgo espiritual es un llamado al servicio, no un privilegio para el autoengaño.`,
    category: 'Comentarios Bíblicos',
    date: '01/11/2023',
  },
  {
    title: 'El amor es una cosa de pastor coach',
    summary: 'El péndulo de las visiones teológicas que traen tantas divisiones y desequilibrios. Los nuevos jóvenes predicadores.',
    content: `En los últimos años, hemos visto surgir una nueva generación de líderes que mezclan el evangelio con técnicas de coaching y autoayuda. Si bien hay aspectos positivos en este enfoque, también hay peligros.

El amor de Dios no es una técnica de motivación personal. Es el fundamento mismo de nuestra fe. Reducir el evangelio a un mensaje de éxito personal o bienestar emocional es perder de vista la profundidad del amor sacrificial de Cristo.

Necesitamos predicar el evangelio completo: el amor de Dios que nos acepta tal como somos, pero que también nos transforma a la imagen de Cristo. No es solo un mensaje de consuelo, sino también de convicción y cambio.

Busquemos un equilibrio bíblico: ni un evangelio frío y legalista, ni un evangelio superficial que ignora el costo del discipulado.`,
    category: 'Evangelio actual',
    date: '13/04/2021',
  },
  {
    title: 'Viento u oxígeno',
    summary: 'A veces la vida del hombre, principalmente el joven, se resume en buscar emoción y en realidad lo que necesitamos es paz.',
    content: `Vivimos en una sociedad que valora la emoción por encima de la paz. Los jóvenes buscan experiencias extremas, adrenalina, emociones fuertes. Pero lo que el alma realmente necesita no es más viento, sino oxígeno.

El viento representa el movimiento constante, la agitación, el ruido. El oxígeno representa la vida, la calma, lo esencial. Podemos pasar toda la vida persiguiendo el viento de las emociones pasajeras y morir espiritualmente por falta de oxígeno.

Jesús ofrece agua viva al sediento. No promete una vida de emociones constantes, sino una vida de paz profunda que sobrepasa todo entendimiento. Esa paz no depende de las circunstancias, sino de la presencia de Cristo en nosotros.

"Estad quietos, y conoced que yo soy Dios" (Salmo 46:10). En la quietud encontramos el oxígeno que nuestras almas necesitan.`,
    category: 'Meditaciones',
    date: '01/04/2021',
  },
  {
    title: '¿Y si no consigues cumplir tus sueños?',
    summary: 'La mayoría sueñan tanto con la llegada que no disfrutan el viaje.',
    content: `Vivimos en una cultura obsesionada con el éxito y el logro de metas. Constantemente escuchamos mensajes sobre "persigue tus sueños" y "nunca te rindas". Pero ¿qué pasa cuando no logramos alcanzar lo que soñamos?

La Biblia nos enseña que nuestros caminos no son los caminos de Dios. Muchos héroes de la fe murieron sin ver cumplidas todas las promesas, pero su fe fue aprobada por Dios (Hebreos 11).

El verdadero propósito de la vida no es cumplir nuestros sueños, sino conocer a Dios y ser transformados a la imagen de Cristo. A veces Dios no nos da lo que queremos porque tiene algo mejor.

No se trata de dejar de soñar, sino de someter nuestros sueños a la voluntad de Dios. Y mientras caminamos hacia ellos, aprendamos a disfrutar la presencia de Dios en el viaje.`,
    category: 'Meditaciones',
    date: '23/03/2021',
  },
];

async function main() {
  const SQL = await initSqlJs();

  if (!fs.existsSync(DB_PATH)) {
    console.error('❌ bible.db not found. Run scripts/import-bible.js first.');
    process.exit(1);
  }

  const buffer = fs.readFileSync(DB_PATH);
  const db = new SQL.Database(buffer);

  db.run(`CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL DEFAULT '',
    date TEXT NOT NULL DEFAULT ''
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS dictionary_entries (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS comment_authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    lifespan TEXT DEFAULT ''
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    verse_id TEXT NOT NULL,
    theologian TEXT NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (verse_id) REFERENCES verses(id)
  )`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_comments_verse ON comments(verse_id)`);

  let articleCount = 0;
  for (const article of SEED_ARTICLES) {
    const id = `art-${article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
    db.run(
      'INSERT OR IGNORE INTO articles (id, title, summary, content, category, image_url, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, article.title, article.summary, article.content, article.category, '', article.date]
    );
    articleCount++;
  }
  console.log(`✅ ${articleCount} seed articles imported`);

  const dictionaryPath = path.join(__dirname, '..', 'src', 'data', 'dictionary-seed.json');
  let dictCount = 0;
  if (fs.existsSync(dictionaryPath)) {
    const dictionaryEntries = JSON.parse(fs.readFileSync(dictionaryPath, 'utf-8'));
    for (const entry of dictionaryEntries) {
      const id = `dict-${entry.title.toLowerCase().replace(/[^a-z0-9áéíóúüñ]+/g, '-').replace(/^-|-$/g, '')}`;
      db.run('INSERT OR IGNORE INTO dictionary_entries (id, title, content) VALUES (?, ?, ?)',
        [id, entry.title, entry.content]);
      dictCount++;
    }
    console.log(`✅ ${dictCount} dictionary entries imported`);
  } else {
    console.log('⚠️ dictionary-seed.json not found, skipping dictionary import');
  }

  const commentAuthors = [
    { name: 'Matthew Henry', slug: 'matthew-henry', lifespan: '1662-1714', description: 'Comentarista puritano inglés' },
    { name: 'Juan Calvino', slug: 'juan-calvino', lifespan: '1509-1564', description: 'Teólogo y reformador francés' },
    { name: 'Charles Spurgeon', slug: 'charles-spurgeon', lifespan: '1834-1892', description: 'Predicador bautista inglés' },
    { name: 'Albert Barnes', slug: 'albert-barnes', lifespan: '1798-1870', description: 'Teólogo presbiteriano estadounidense' },
    { name: 'Adam Clarke', slug: 'adam-clarke', lifespan: '1762-1832', description: 'Teólogo metodista británico' },
    { name: 'John Gill', slug: 'john-gill', lifespan: '1697-1771', description: 'Teólogo bautista inglés' },
    { name: 'Jamieson, Fausset y Brown', slug: 'jamieson-fausset-brown', lifespan: '1871', description: 'Comentario crítico y explicativo' },
    { name: 'Scofield', slug: 'scofield', lifespan: '1843-1921', description: 'Teólogo y escritor estadounidense' },
    { name: 'Comentario del Púlpito', slug: 'comentario-del-pulpito', lifespan: '1880-1890', description: 'Comentario homilético de múltiples autores' },
  ];

  let authorCount = 0;
  for (const author of commentAuthors) {
    db.run(
      'INSERT OR IGNORE INTO comment_authors (name, slug, description, lifespan) VALUES (?, ?, ?, ?)',
      [author.name, author.slug, author.description, author.lifespan]
    );
    authorCount++;
  }
  console.log(`✅ ${authorCount} comment authors registered`);

  const existingComments = db.exec('SELECT COUNT(*) AS count FROM comments');
  const count = existingComments[0]?.values[0][0] || 0;

  if (count === 0) {
    const mockComments = path.join(__dirname, '..', 'src', 'data', 'mocks.ts');
    if (fs.existsSync(mockComments)) {
      const mocksContent = fs.readFileSync(mockComments, 'utf-8');
      const commentRegex = /id:\s*'([^']+)',\s*verseId:\s*'([^']+)',\s*theologian:\s*'([^']*)',\s*text:\s*'([^']+)'/g;
      let match;
      let importCount = 0;

      while ((match = commentRegex.exec(mocksContent)) !== null) {
        const [, id, verseId, theologian, text] = match;
        db.run('INSERT OR IGNORE INTO comments (id, verse_id, theologian, text) VALUES (?, ?, ?, ?)',
          [id, verseId, theologian, text]);
        importCount++;
      }
      console.log(`✅ ${importCount} mock comments imported`);
    }

    const verseCount = db.exec('SELECT COUNT(*) AS count FROM verses');
    const vc = verseCount[0]?.values[0][0] || 0;
    console.log(`📊 Database stats: ${vc} verses, ${articleCount} articles, ${authorCount} authors`);
  } else {
    console.log(`ℹ️ ${count} comments already exist, skipping mock import`);
  }

  db.run('CREATE TABLE IF NOT EXISTS _metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)');
  db.run("INSERT OR REPLACE INTO _metadata (key, value) VALUES ('db_version', '3')");
  const today = new Date().toISOString().split('T')[0];
  db.run('INSERT OR REPLACE INTO _metadata (key, value) VALUES (?, ?)', ['updated_at', today]);

  const outBuffer = Buffer.from(db.export());
  fs.writeFileSync(DB_PATH, outBuffer);
  console.log(`✅ Database updated: ${(outBuffer.length / 1024 / 1024).toFixed(1)} MB`);

  db.close();
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
