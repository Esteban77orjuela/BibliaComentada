// ============================================================
// BibliaPlus Pro — Mock Data
// 66 libros completos + capítulos de Génesis y Juan con
// versículos reales y comentarios exegéticos de 3 teólogos
// ============================================================

import { Book, Verse, Comment } from '../types';

// ─────────────────────────────────────────────────────────────
// LIBROS — Los 66 libros del canon protestante
// ─────────────────────────────────────────────────────────────
export const BOOKS: Book[] = [
  // ANTIGUO TESTAMENTO
  { id: 1,  name: 'Génesis',        abbreviation: 'Gén',  testament: 'AT', totalChapters: 50, order: 1  },
  { id: 2,  name: 'Éxodo',          abbreviation: 'Éx',   testament: 'AT', totalChapters: 40, order: 2  },
  { id: 3,  name: 'Levítico',       abbreviation: 'Lev',  testament: 'AT', totalChapters: 27, order: 3  },
  { id: 4,  name: 'Números',        abbreviation: 'Núm',  testament: 'AT', totalChapters: 36, order: 4  },
  { id: 5,  name: 'Deuteronomio',   abbreviation: 'Dt',   testament: 'AT', totalChapters: 34, order: 5  },
  { id: 6,  name: 'Josué',          abbreviation: 'Jos',  testament: 'AT', totalChapters: 24, order: 6  },
  { id: 7,  name: 'Jueces',         abbreviation: 'Jue',  testament: 'AT', totalChapters: 21, order: 7  },
  { id: 8,  name: 'Rut',            abbreviation: 'Rut',  testament: 'AT', totalChapters: 4,  order: 8  },
  { id: 9,  name: '1 Samuel',       abbreviation: '1 S',  testament: 'AT', totalChapters: 31, order: 9  },
  { id: 10, name: '2 Samuel',       abbreviation: '2 S',  testament: 'AT', totalChapters: 24, order: 10 },
  { id: 11, name: '1 Reyes',        abbreviation: '1 R',  testament: 'AT', totalChapters: 22, order: 11 },
  { id: 12, name: '2 Reyes',        abbreviation: '2 R',  testament: 'AT', totalChapters: 25, order: 12 },
  { id: 13, name: '1 Crónicas',     abbreviation: '1 Cr', testament: 'AT', totalChapters: 29, order: 13 },
  { id: 14, name: '2 Crónicas',     abbreviation: '2 Cr', testament: 'AT', totalChapters: 36, order: 14 },
  { id: 15, name: 'Esdras',         abbreviation: 'Esd',  testament: 'AT', totalChapters: 10, order: 15 },
  { id: 16, name: 'Nehemías',       abbreviation: 'Neh',  testament: 'AT', totalChapters: 13, order: 16 },
  { id: 17, name: 'Ester',          abbreviation: 'Est',  testament: 'AT', totalChapters: 10, order: 17 },
  { id: 18, name: 'Job',            abbreviation: 'Job',  testament: 'AT', totalChapters: 42, order: 18 },
  { id: 19, name: 'Salmos',         abbreviation: 'Sal',  testament: 'AT', totalChapters: 150, order: 19 },
  { id: 20, name: 'Proverbios',     abbreviation: 'Pr',   testament: 'AT', totalChapters: 31, order: 20 },
  { id: 21, name: 'Eclesiastés',    abbreviation: 'Ec',   testament: 'AT', totalChapters: 12, order: 21 },
  { id: 22, name: 'Cantares',       abbreviation: 'Cnt',  testament: 'AT', totalChapters: 8,  order: 22 },
  { id: 23, name: 'Isaías',         abbreviation: 'Is',   testament: 'AT', totalChapters: 66, order: 23 },
  { id: 24, name: 'Jeremías',       abbreviation: 'Jer',  testament: 'AT', totalChapters: 52, order: 24 },
  { id: 25, name: 'Lamentaciones',  abbreviation: 'Lm',   testament: 'AT', totalChapters: 5,  order: 25 },
  { id: 26, name: 'Ezequiel',       abbreviation: 'Ez',   testament: 'AT', totalChapters: 48, order: 26 },
  { id: 27, name: 'Daniel',         abbreviation: 'Dn',   testament: 'AT', totalChapters: 12, order: 27 },
  { id: 28, name: 'Oseas',          abbreviation: 'Os',   testament: 'AT', totalChapters: 14, order: 28 },
  { id: 29, name: 'Joel',           abbreviation: 'Jl',   testament: 'AT', totalChapters: 3,  order: 29 },
  { id: 30, name: 'Amós',           abbreviation: 'Am',   testament: 'AT', totalChapters: 9,  order: 30 },
  { id: 31, name: 'Abdías',         abbreviation: 'Abd',  testament: 'AT', totalChapters: 1,  order: 31 },
  { id: 32, name: 'Jonás',          abbreviation: 'Jon',  testament: 'AT', totalChapters: 4,  order: 32 },
  { id: 33, name: 'Miqueas',        abbreviation: 'Mi',   testament: 'AT', totalChapters: 7,  order: 33 },
  { id: 34, name: 'Nahúm',          abbreviation: 'Nah',  testament: 'AT', totalChapters: 3,  order: 34 },
  { id: 35, name: 'Habacuc',        abbreviation: 'Hab',  testament: 'AT', totalChapters: 3,  order: 35 },
  { id: 36, name: 'Sofonías',       abbreviation: 'Sof',  testament: 'AT', totalChapters: 3,  order: 36 },
  { id: 37, name: 'Hageo',          abbreviation: 'Hag',  testament: 'AT', totalChapters: 2,  order: 37 },
  { id: 38, name: 'Zacarías',       abbreviation: 'Zac',  testament: 'AT', totalChapters: 14, order: 38 },
  { id: 39, name: 'Malaquías',      abbreviation: 'Mal',  testament: 'AT', totalChapters: 4,  order: 39 },
  // NUEVO TESTAMENTO
  { id: 40, name: 'Mateo',          abbreviation: 'Mt',   testament: 'NT', totalChapters: 28, order: 40 },
  { id: 41, name: 'Marcos',         abbreviation: 'Mr',   testament: 'NT', totalChapters: 16, order: 41 },
  { id: 42, name: 'Lucas',          abbreviation: 'Lc',   testament: 'NT', totalChapters: 24, order: 42 },
  { id: 43, name: 'Juan',           abbreviation: 'Jn',   testament: 'NT', totalChapters: 21, order: 43 },
  { id: 44, name: 'Hechos',         abbreviation: 'Hch',  testament: 'NT', totalChapters: 28, order: 44 },
  { id: 45, name: 'Romanos',        abbreviation: 'Ro',   testament: 'NT', totalChapters: 16, order: 45 },
  { id: 46, name: '1 Corintios',    abbreviation: '1 Co', testament: 'NT', totalChapters: 16, order: 46 },
  { id: 47, name: '2 Corintios',    abbreviation: '2 Co', testament: 'NT', totalChapters: 13, order: 47 },
  { id: 48, name: 'Gálatas',        abbreviation: 'Gá',   testament: 'NT', totalChapters: 6,  order: 48 },
  { id: 49, name: 'Efesios',        abbreviation: 'Ef',   testament: 'NT', totalChapters: 6,  order: 49 },
  { id: 50, name: 'Filipenses',     abbreviation: 'Fil',  testament: 'NT', totalChapters: 4,  order: 50 },
  { id: 51, name: 'Colosenses',     abbreviation: 'Col',  testament: 'NT', totalChapters: 4,  order: 51 },
  { id: 52, name: '1 Tesalonicenses', abbreviation: '1 Ts', testament: 'NT', totalChapters: 5, order: 52 },
  { id: 53, name: '2 Tesalonicenses', abbreviation: '2 Ts', testament: 'NT', totalChapters: 3, order: 53 },
  { id: 54, name: '1 Timoteo',      abbreviation: '1 Ti', testament: 'NT', totalChapters: 6,  order: 54 },
  { id: 55, name: '2 Timoteo',      abbreviation: '2 Ti', testament: 'NT', totalChapters: 4,  order: 55 },
  { id: 56, name: 'Tito',           abbreviation: 'Tit',  testament: 'NT', totalChapters: 3,  order: 56 },
  { id: 57, name: 'Filemón',        abbreviation: 'Flm',  testament: 'NT', totalChapters: 1,  order: 57 },
  { id: 58, name: 'Hebreos',        abbreviation: 'He',   testament: 'NT', totalChapters: 13, order: 58 },
  { id: 59, name: 'Santiago',       abbreviation: 'Stg',  testament: 'NT', totalChapters: 5,  order: 59 },
  { id: 60, name: '1 Pedro',        abbreviation: '1 P',  testament: 'NT', totalChapters: 5,  order: 60 },
  { id: 61, name: '2 Pedro',        abbreviation: '2 P',  testament: 'NT', totalChapters: 3,  order: 61 },
  { id: 62, name: '1 Juan',         abbreviation: '1 Jn', testament: 'NT', totalChapters: 5,  order: 62 },
  { id: 63, name: '2 Juan',         abbreviation: '2 Jn', testament: 'NT', totalChapters: 1,  order: 63 },
  { id: 64, name: '3 Juan',         abbreviation: '3 Jn', testament: 'NT', totalChapters: 1,  order: 64 },
  { id: 65, name: 'Judas',          abbreviation: 'Jud',  testament: 'NT', totalChapters: 1,  order: 65 },
  { id: 66, name: 'Apocalipsis',    abbreviation: 'Ap',   testament: 'NT', totalChapters: 22, order: 66 },
];

// ─────────────────────────────────────────────────────────────
// VERSÍCULOS — Génesis 1 (completo), Génesis 3 y Juan 1, 3
// ─────────────────────────────────────────────────────────────
export const VERSES: Verse[] = [
  // ── Génesis 1 ──
  { id: '1-1-1',  bookId: 1, bookName: 'Génesis', chapter: 1, verse: 1,  text: 'En el principio creó Dios los cielos y la tierra.' },
  { id: '1-1-2',  bookId: 1, bookName: 'Génesis', chapter: 1, verse: 2,  text: 'Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la faz del abismo, y el Espíritu de Dios se movía sobre la faz de las aguas.' },
  { id: '1-1-3',  bookId: 1, bookName: 'Génesis', chapter: 1, verse: 3,  text: 'Y dijo Dios: Sea la luz; y fue la luz.' },
  { id: '1-1-4',  bookId: 1, bookName: 'Génesis', chapter: 1, verse: 4,  text: 'Y vio Dios que la luz era buena; y separó Dios la luz de las tinieblas.' },
  { id: '1-1-5',  bookId: 1, bookName: 'Génesis', chapter: 1, verse: 5,  text: 'Y llamó Dios a la luz Día, y a las tinieblas llamó Noche. Y fue la tarde y la mañana un día.' },
  { id: '1-1-6',  bookId: 1, bookName: 'Génesis', chapter: 1, verse: 6,  text: 'Luego dijo Dios: Haya expansión en medio de las aguas, y separe las aguas de las aguas.' },
  { id: '1-1-7',  bookId: 1, bookName: 'Génesis', chapter: 1, verse: 7,  text: 'E hizo Dios la expansión, y separó las aguas que estaban debajo de la expansión, de las aguas que estaban sobre la expansión. Y fue así.' },
  { id: '1-1-8',  bookId: 1, bookName: 'Génesis', chapter: 1, verse: 8,  text: 'Y llamó Dios a la expansión Cielos. Y fue la tarde y la mañana el día segundo.' },
  { id: '1-1-9',  bookId: 1, bookName: 'Génesis', chapter: 1, verse: 9,  text: 'Dijo también Dios: Júntense las aguas que están debajo de los cielos en un lugar, y descúbrase lo seco. Y fue así.' },
  { id: '1-1-10', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 10, text: 'Y llamó Dios a lo seco Tierra, y a la reunión de las aguas llamó Mares. Y vio Dios que era bueno.' },
  { id: '1-1-11', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 11, text: 'Después dijo Dios: Produzca la tierra hierba verde, hierba que dé semilla; árbol de fruto que dé fruto según su género, que su semilla esté en él, sobre la tierra. Y fue así.' },
  { id: '1-1-12', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 12, text: 'Produjo, pues, la tierra hierba verde, hierba que da semilla según su naturaleza, y árbol que da fruto, cuya semilla está en él, según su género. Y vio Dios que era bueno.' },
  { id: '1-1-13', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 13, text: 'Y fue la tarde y la mañana el día tercero.' },
  { id: '1-1-14', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 14, text: 'Dijo luego Dios: Haya lumbreras en la expansión de los cielos para separar el día de la noche; y sirvan de señales para las estaciones, para días y años.' },
  { id: '1-1-15', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 15, text: 'Y sean por lumbreras en la expansión de los cielos para alumbrar sobre la tierra. Y fue así.' },
  { id: '1-1-16', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 16, text: 'E hizo Dios las dos grandes lumbreras; la lumbrera mayor para que señorease en el día, y la lumbrera menor para que señorease en la noche; hizo también las estrellas.' },
  { id: '1-1-17', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 17, text: 'Y las puso Dios en la expansión de los cielos para alumbrar sobre la tierra.' },
  { id: '1-1-18', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 18, text: 'Y para señorear en el día y en la noche, y para separar la luz de las tinieblas. Y vio Dios que era bueno.' },
  { id: '1-1-19', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 19, text: 'Y fue la tarde y la mañana el día cuarto.' },
  { id: '1-1-20', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 20, text: 'Dijo Dios: Produzcan las aguas seres vivientes, y aves que vuelen sobre la tierra, en la abierta expansión de los cielos.' },
  { id: '1-1-21', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 21, text: 'Y creó Dios los grandes monstruos marinos, y todo ser viviente que se mueve, que las aguas produjeron según su género, y toda ave alada según su especie. Y vio Dios que era bueno.' },
  { id: '1-1-22', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 22, text: 'Y Dios los bendijo, diciendo: Fructificad y multiplicaos, y llenad las aguas en los mares, y multiplíquense las aves en la tierra.' },
  { id: '1-1-23', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 23, text: 'Y fue la tarde y la mañana el día quinto.' },
  { id: '1-1-24', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 24, text: 'Luego dijo Dios: Produzca la tierra seres vivientes según su género, bestias y serpientes y animales de la tierra según su especie. Y fue así.' },
  { id: '1-1-25', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 25, text: 'E hizo Dios animales de la tierra según su género, y ganado según su género, y todo animal que se arrastra sobre la tierra según su especie. Y vio Dios que era bueno.' },
  { id: '1-1-26', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 26, text: 'Entonces dijo Dios: Hagamos al hombre a nuestra imagen, conforme a nuestra semejanza; y señoree en los peces del mar, en las aves de los cielos, en las bestias, en toda la tierra, y en todo animal que se arrastra sobre la tierra.' },
  { id: '1-1-27', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 27, text: 'Y creó Dios al hombre a su imagen, a imagen de Dios lo creó; varón y hembra los creó.' },
  { id: '1-1-28', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 28, text: 'Y los bendijo Dios, y les dijo: Fructificad y multiplicaos; llenad la tierra, y sojuzgadla, y señoread en los peces del mar, en las aves de los cielos, y en todas las bestias que se mueven sobre la tierra.' },
  { id: '1-1-29', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 29, text: 'Y dijo Dios: He aquí que os he dado toda planta que da semilla, que está sobre toda la tierra, y todo árbol en que hay fruto y que da semilla; os serán para comer.' },
  { id: '1-1-30', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 30, text: 'Y a toda bestia de la tierra, y a todas las aves de los cielos, y a todo lo que se arrastra sobre la tierra, en que hay vida, toda planta verde les será para comer. Y fue así.' },
  { id: '1-1-31', bookId: 1, bookName: 'Génesis', chapter: 1, verse: 31, text: 'Y vio Dios todo lo que había hecho, y he aquí que era bueno en gran manera. Y fue la tarde y la mañana el día sexto.' },

  // ── Génesis 3 ──
  { id: '1-3-1',  bookId: 1, bookName: 'Génesis', chapter: 3, verse: 1,  text: 'Pero la serpiente era astuta, más que todos los animales del campo que Jehová Dios había hecho; la cual dijo a la mujer: ¿Conque Dios os ha dicho: No comeréis de todo árbol del huerto?' },
  { id: '1-3-2',  bookId: 1, bookName: 'Génesis', chapter: 3, verse: 2,  text: 'Y la mujer respondió a la serpiente: Del fruto de los árboles del huerto podemos comer.' },
  { id: '1-3-3',  bookId: 1, bookName: 'Génesis', chapter: 3, verse: 3,  text: 'Pero del fruto del árbol que está en medio del huerto dijo Dios: No comeréis de él, ni le tocaréis, para que no muráis.' },
  { id: '1-3-4',  bookId: 1, bookName: 'Génesis', chapter: 3, verse: 4,  text: 'Entonces la serpiente dijo a la mujer: No moriréis.' },
  { id: '1-3-5',  bookId: 1, bookName: 'Génesis', chapter: 3, verse: 5,  text: 'Sino que sabe Dios que el día que comáis de él, serán abiertos vuestros ojos, y seréis como Dios, sabiendo el bien y el mal.' },
  { id: '1-3-15', bookId: 1, bookName: 'Génesis', chapter: 3, verse: 15, text: 'Y pondré enemistad entre ti y la mujer, y entre tu simiente y la simiente suya; ésta te herirá en la cabeza, y tú le herirás en el calcañar.' },

  // ── Juan 1 ──
  { id: '43-1-1',  bookId: 43, bookName: 'Juan', chapter: 1, verse: 1,  text: 'En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.' },
  { id: '43-1-2',  bookId: 43, bookName: 'Juan', chapter: 1, verse: 2,  text: 'Este era en el principio con Dios.' },
  { id: '43-1-3',  bookId: 43, bookName: 'Juan', chapter: 1, verse: 3,  text: 'Todas las cosas por él fueron hechas, y sin él nada de lo que ha sido hecho, fue hecho.' },
  { id: '43-1-4',  bookId: 43, bookName: 'Juan', chapter: 1, verse: 4,  text: 'En él estaba la vida, y la vida era la luz de los hombres.' },
  { id: '43-1-5',  bookId: 43, bookName: 'Juan', chapter: 1, verse: 5,  text: 'La luz en las tinieblas resplandece, y las tinieblas no prevalecieron contra ella.' },
  { id: '43-1-14', bookId: 43, bookName: 'Juan', chapter: 1, verse: 14, text: 'Y aquel Verbo fue hecho carne, y habitó entre nosotros (y vimos su gloria, gloria como del unigénito del Padre), lleno de gracia y de verdad.' },

  // ── Juan 3 ──
  { id: '43-3-16', bookId: 43, bookName: 'Juan', chapter: 3, verse: 16, text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.' },
  { id: '43-3-17', bookId: 43, bookName: 'Juan', chapter: 3, verse: 17, text: 'Porque no envió Dios a su Hijo al mundo para condenar al mundo, sino para que el mundo sea salvo por él.' },
  { id: '43-3-18', bookId: 43, bookName: 'Juan', chapter: 3, verse: 18, text: 'El que en él cree, no es condenado; pero el que no cree, ya ha sido condenado, porque no ha creído en el nombre del unigénito Hijo de Dios.' },
];

// ─────────────────────────────────────────────────────────────
// COMENTARIOS EXEGÉTICOS
// ─────────────────────────────────────────────────────────────
export const COMMENTS: Comment[] = [
  // ── Génesis 1:1 ──
  {
    id: 'c-1-1-1-mh',
    verseId: '1-1-1',
    theologian: 'Matthew Henry',
    text: 'El capítulo primero del primer libro de la Biblia nos da una descripción de las obras de Dios en la creación, y lo que tenemos aquí es un resumen de ella: "En el principio, Dios". Es probable que haya un enigma en estas palabras: "En el principio era el Verbo" (Juan 1:1). Por Dios aquí debemos entender a la Trinidad: Padre, Hijo y Espíritu Santo. La expresión "en el principio" nos recuerda que el tiempo tuvo un comienzo, y que antes de ese comienzo solo existía Dios, el eterno. La creación no fue un accidente, sino un acto libre y deliberado de la voluntad divina.',
  },
  {
    id: 'c-1-1-1-cal',
    verseId: '1-1-1',
    theologian: 'Juan Calvino',
    text: 'Moisés no nos relata aquí el origen de Dios —pues Dios no tiene origen— sino el origen del mundo que conocemos. La expresión "en el principio" implica que el tiempo mismo es una creatura; existía antes de que existiera cualquier cosa. Dios es eterno, y toda la creación es temporal. Esta verdad fundamental debe frenar toda especulación impropia sobre lo que Dios hacía "antes" de la creación. El lenguaje de Moisés es sencillo no porque la verdad sea simple, sino porque se dirige al pueblo común, al granjero y a la madre, no sólo al filósofo.',
  },
  {
    id: 'c-1-1-1-sp',
    verseId: '1-1-1',
    theologian: 'Charles Spurgeon',
    text: '"En el principio creó Dios." ¡Qué palabra tan majestuosa para abrir la revelación divina! No hay argumentación, no hay debate filosófico, no hay disculpa apologética. Simplemente la afirmación augusta y soberana: Dios creó. El universo no se explicó a sí mismo, no evolucionó de la nada, no es eterno. Tiene un Autor, y ese Autor se llama Dios. Amigo mío, si crees esta primera palabra de la Biblia, has dado el paso más gigantesco en la fe cristiana. Todo lo demás que la Biblia dice descansa sobre esta base: hay un Dios, y Él actúa.',
  },

  // ── Génesis 1:26 ──
  {
    id: 'c-1-1-26-mh',
    verseId: '1-1-26',
    theologian: 'Matthew Henry',
    text: 'Aquí tenemos la consulta de la Trinidad en la creación del hombre: "Hagamos". No hay consejero externo a Dios; el plural sugiere la deliberación divina dentro de la Divinidad misma. El hombre fue creado a imagen de Dios —no la imagen material, pues Dios es espíritu— sino en su ser racional, moral y espiritual: entendimiento, voluntad, afectos y dominio sobre la creación. Esta imagen fue corrompida por la caída, pero en Cristo es restaurada a su estado original y superada.',
  },
  {
    id: 'c-1-1-26-cal',
    verseId: '1-1-26',
    theologian: 'Juan Calvino',
    text: 'El "hagamos" que usa Moisés es evidencia suficiente, no de una mera pluralidad de majestad, sino de la existencia de personas dentro de la única esencia divina. Los teólogos han debatido si la imagen de Dios reside en el alma sola o también en el cuerpo; yo afirmo que reside principalmente en el alma, aunque no excluye que el cuerpo participe de ella en cierta medida. La imagen de Dios es el estado original de rectitud: conocimiento de la verdad, santidad de corazón, y justicia de vida.',
  },

  // ── Génesis 3:15 — Protevangelio ──
  {
    id: 'c-1-3-15-mh',
    verseId: '1-3-15',
    theologian: 'Matthew Henry',
    text: 'Este es el primer evangelio dado al hombre después de la caída, el protevangelio. La enemistad que Dios pone entre la serpiente y la mujer no es meramente hostilidad natural entre el género humano y los reptiles, sino la guerra espiritual entre Satanás y el pueblo de Dios. "La simiente de la mujer" es, primariamente, Cristo, el único nacido de mujer sin participación de varón. El calcañar herido habla de la Pasión y muerte de Cristo; la cabeza aplastada habla de la derrota final y eterna de Satanás en la resurrección.',
  },
  {
    id: 'c-1-3-15-cal',
    verseId: '1-3-15',
    theologian: 'Juan Calvino',
    text: 'En estas palabras Dios mantiene en pie la esperanza del género humano en el momento más oscuro. La cabeza de la serpiente aplastada bajo la simiente de la mujer es la promesa de la victoria de Cristo sobre Satanás, el pecado y la muerte. Calvino insiste en que la "simiente" aquí es colectiva —la iglesia— pero tiene su cumplimiento singular en Cristo, la cabeza de esa iglesia. La herida en el calcañar señala que la victoria no vendría sin sufrimiento; el Mesías sufriría, pero su sufrimiento sería redentor.',
  },

  // ── Juan 1:1 ──
  {
    id: 'c-43-1-1-mh',
    verseId: '43-1-1',
    theologian: 'Matthew Henry',
    text: 'Juan comienza su evangelio no con la historia del nacimiento de Cristo, sino con su existencia eterna. El "Verbo" —Logos en griego— era el término más elevado del vocabulario filosófico de la época, pero Juan lo llena con un contenido radicalmente nuevo. El Verbo era "con Dios" —distinción de personas— y "era Dios" —unidad de esencia. Esta paradoja es el corazón de la doctrina de la Trinidad: tres personas, una sola sustancia divina. Lo que la filosofía griega buscaba en vano, Juan lo anuncia como hecho revelado.',
  },
  {
    id: 'c-43-1-1-cal',
    verseId: '43-1-1',
    theologian: 'Juan Calvino',
    text: 'Juan usa la palabra Logos —Verbo— para describir al Hijo eterno de Dios. Esta palabra tiene resonancias tanto en la filosofía griega como en el Antiguo Testamento. Pero Juan la supera a ambas. El Logos no es el principio abstracto de la razón universal, ni simplemente la Palabra de Dios que vino a los profetas: es la segunda Persona de la Trinidad, personal, eterno, y consustancial con el Padre. "Era con Dios" muestra su distinción personal; "era Dios" muestra su igualdad de esencia. La preexistencia del Hijo es aquí enseñada sin ambigüedad.',
  },
  {
    id: 'c-43-1-1-sp',
    verseId: '43-1-1',
    theologian: 'Charles Spurgeon',
    text: '¡Qué apertura tan magnífica! Juan no nos hace esperar; desde la primera línea nos lleva ante el trono de la eternidad. "En el principio era el Verbo." No "comenzó a ser" el Verbo, sino "era". Cuando todo comenzó, Él ya estaba. Este es el Cristo que yo predico: no meramente un gran maestro, no simplemente un modelo moral, sino el Verbo eterno que estaba con Dios y era Dios. Si tu Cristo no es este Cristo, tu fe descansa sobre arena. El Jesús de Juan 1:1 es el único Jesús que puede salvar.',
  },

  // ── Juan 1:14 ──
  {
    id: 'c-43-1-14-mh',
    verseId: '43-1-14',
    theologian: 'Matthew Henry',
    text: '"El Verbo se hizo carne": la encarnación es el mayor milagro de la historia. El infinito se hace finito; el eterno entra en el tiempo; el Creador se hace creatura. "Y habitó entre nosotros" — la palabra griega significa "plantó su tienda" entre nosotros, aludiendo al tabernáculo del Antiguo Testamento donde Dios moraba entre su pueblo. Pero ahora la morada de Dios es un cuerpo humano. La gloria que Moisés vio de espaldas, los apóstoles la vieron de frente, "llena de gracia y verdad".',
  },
  {
    id: 'c-43-1-14-sp',
    verseId: '43-1-14',
    theologian: 'Charles Spurgeon',
    text: 'Medita en este versículo hasta que te abrume: ¡El Verbo se hizo carne! El que sostiene el universo con su poder se hizo tan pequeño como un bebé en un pesebre. El que es adorado por ángeles se dejó abrazar por María. Esto no es alegoría, no es poesía: es el hecho más asombroso de la historia del cosmos. Y lo hizo por ti. Por ti, que eres polvo y pecado. La encarnación no es solo teología para discutir; es amor para adorar.',
  },

  // ── Juan 3:16 ──
  {
    id: 'c-43-3-16-mh',
    verseId: '43-3-16',
    theologian: 'Matthew Henry',
    text: 'Este es, con razón, llamado el evangelio en miniatura. Aquí están todos los elementos de la gracia salvadora: el amor de Dios como su fuente —"de tal manera amó"— la entrega del Hijo como su precio, la fe como su condición —"que en él cree"— y la vida eterna como su resultado. No se habla aquí de mérito humano, ni de obras, ni de rituales. El amor de Dios es la causa primera y la fe en Cristo es el único canal por el que fluye hacia el alma del pecador.',
  },
  {
    id: 'c-43-3-16-cal',
    verseId: '43-3-16',
    theologian: 'Juan Calvino',
    text: 'Cristo presenta aquí el origen de nuestra salvación en el amor de Dios para que sepamos que no hay nada en nosotros que Dios haya amado. El "mundo" que Dios ama no es el mundo en su maldad, sino el mundo en su miseria: la humanidad caída necesitada de redención. La entrega del Hijo unigénito es la medida del amor del Padre: dio lo que más valoraba, lo que era más precioso para Él. Nótese bien: la condición de salvación es "que todo aquel que en él cree" —la fe sola, no las obras— es la puerta.',
  },
  {
    id: 'c-43-3-16-sp',
    verseId: '43-3-16',
    theologian: 'Charles Spurgeon',
    text: 'He predicado sobre Juan 3:16 más veces de las que puedo contar, y cada vez encuentro nuevas profundidades. "De tal manera amó Dios al mundo" — ¡qué manera! No como uno que da lo que le sobra, sino como uno que da lo que más ama. ¿Qué amaba Dios más que a su propio Hijo? Y lo dio. Por ti. Por mí. Por el peor de los pecadores que hoy respira. No hay condición en este versículo excepto la fe: "todo aquel que en él cree". Si esta noche crees en Cristo, esta noche tienes vida eterna. No mañana, esta noche.',
  },
];
