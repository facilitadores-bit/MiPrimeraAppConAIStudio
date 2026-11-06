import { BrandProfile, ContentPillar, PostTemplate, SocialPost } from '../types';

export const CONTENT_PILLARS: ContentPillar[] = [
  {
    id: 'educativo',
    nombre: 'Educativo / How-To',
    descripcion: 'Tutoriales, tips prácticos, desmitificación de conceptos y valor accionable.',
    color: '#0284c7', // Sky 600
    icono: 'BookOpen',
  },
  {
    id: 'promocional',
    nombre: 'Lanzamiento & Venta',
    descripcion: 'Ofertas, lanzamientos, beneficios directos de producto y llamados a la compra.',
    color: '#e11d48', // Rose 600
    icono: 'ShoppingBag',
  },
  {
    id: 'caso_exito',
    nombre: 'Casos de Éxito & Pruebas',
    descripcion: 'Testimonios reales, transformaciones, métricas de clientes y credibilidad.',
    color: '#059669', // Emerald 600
    icono: 'Award',
  },
  {
    id: 'detras_escena',
    nombre: 'Detrás de Escena / Cultura',
    descripcion: 'Procesos de trabajo, equipo humano, valores, fracasos convertidos en aprendizaje.',
    color: '#7c3aed', // Violet 600
    icono: 'Sparkles',
  },
  {
    id: 'comunidad',
    nombre: 'Comunidad & Preguntas',
    descripcion: 'Debates, encuestas, preguntas abiertas y disparadores de conversación.',
    color: '#0d9488', // Teal 600
    icono: 'MessageCircle',
  },
  {
    id: 'entretenimiento',
    nombre: 'Relatable & Humor',
    descripcion: 'Situaciones cotidianas del cliente ideal, memes refinados y empatía.',
    color: '#d97706', // Amber 600
    icono: 'Smile',
  },
  {
    id: 'noticia',
    nombre: 'Tendencia & Opinión',
    descripcion: 'Novedades de la industria, análisis de cambios y punto de vista experto.',
    color: '#475569', // Slate 600
    icono: 'Flame',
  },
];

export const DEFAULT_BRAND: BrandProfile = {
  id: 'brand-ecovita',
  name: 'EcoVita Snacks',
  tagline: 'Nutrición consciente para jornadas de alto rendimiento',
  handle: '@ecovitasnacks',
  avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80',
  primaryColor: '#059669',
  secondaryColor: '#d97706',
  variables: [
    {
      key: 'marca',
      label: 'Nombre de la Marca',
      value: 'EcoVita',
      description: 'Nombre comercial utilizado en los textos',
    },
    {
      key: 'slogan',
      label: 'Slogan o Mensaje Clave',
      value: 'Energía 100% natural sin picos de azúcar',
      description: 'Lema que refuerza la promesa de valor',
    },
    {
      key: 'publico_objetivo',
      label: 'Público Objetivo',
      value: 'Profesionales, deportistas y personas con poco tiempo que cuidan su alimentación',
      description: 'A quién le hablamos en cada publicación',
    },
    {
      key: 'propuesta_valor',
      label: 'Propuesta de Valor',
      value: 'Snacks artesanales con ingredientes limpios, sin conservantes y listos para llevar',
    },
    {
      key: 'cta_principal',
      label: 'Llamada a la Acción (CTA)',
      value: 'Conocé nuestra variedad y pedí tu pack con 15% OFF en el link de nuestra bio',
      description: 'Llamado a la acción predeterminado para cierres',
    },
    {
      key: 'enlace_bio',
      label: 'Enlace de la Bio',
      value: 'ecovita.shop/comunidad',
      description: 'Dirección web o landing a promocionar',
    },
    {
      key: 'codigo_descuento',
      label: 'Código de Descuento Activo',
      value: 'VIDASANA15',
      description: 'Cupón temporal o permanente para promociones',
    },
    {
      key: 'contacto_whatsapp',
      label: 'WhatsApp de Atención',
      value: '+54 9 11 5520-8840',
      description: 'Línea de consultas o pedidos directos',
    },
    {
      key: 'hashtags_oficiales',
      label: 'Hashtags Oficiales',
      value: '#EcoVitaSnacks #ComidaReal #EnergiaLimpia #SnacksSaludables',
      description: 'Conjunto de etiquetas que identifican la marca',
    },
  ],
  rules: {
    grammaticalPerson: 'tu',
    maxEmojisPerPost: 4,
    requireHook: true,
    requireCTA: true,
    requireBrandHashtags: true,
    preferredSentenceLength: 'corta',
    bannedWords: ['milagroso', 'solución definitiva', '100% garantizado', 'gratis sin trampa'],
    keyBrandHashtags: '#EcoVitaSnacks #ComidaReal',
    notes: 'Priorizar siempre párrafos de máximo 2 líneas para lectura fluida en móviles. Usar saltos de línea limpios. Tono cercano, optimista y sin tecnicismos difíciles.',
  },
};

export const BRAND_PRESETS: { id: string; name: string; brand: BrandProfile }[] = [
  {
    id: 'preset-food',
    name: 'Alimentos Saludables / E-commerce',
    brand: DEFAULT_BRAND,
  },
  {
    id: 'preset-saas',
    name: 'Software B2B / SaaS',
    brand: {
      id: 'brand-saas',
      name: 'StackFlow',
      tagline: 'Gestión ágil de proyectos para equipos remotos',
      handle: '@stackflowhq',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
      primaryColor: '#2563eb',
      secondaryColor: '#0f172a',
      variables: [
        { key: 'marca', label: 'Nombre de la Marca', value: 'StackFlow' },
        { key: 'slogan', label: 'Slogan', value: 'Flujos de trabajo transparentes, equipos sincronizados' },
        { key: 'publico_objetivo', label: 'Público Objetivo', value: 'Líderes de producto, CTOs y managers de ingeniería' },
        { key: 'propuesta_valor', label: 'Propuesta de Valor', value: 'Automatización de tareas repetitivas y visibilidad de sprint en tiempo real' },
        { key: 'cta_principal', label: 'Llamada a la Acción', value: 'Inicia tu prueba gratuita de 14 días en el enlace de la bio' },
        { key: 'enlace_bio', label: 'Enlace', value: 'stackflow.io/demo' },
        { key: 'codigo_descuento', label: 'Cupón', value: 'SCALE2026' },
        { key: 'contacto_whatsapp', label: 'Contacto', value: 'contacto@stackflow.io' },
        { key: 'hashtags_oficiales', label: 'Hashtags', value: '#Productivity #RemoteWork #DevTools #SaaS' },
      ],
      rules: {
        grammaticalPerson: 'tu',
        maxEmojisPerPost: 2,
        requireHook: true,
        requireCTA: true,
        requireBrandHashtags: true,
        preferredSentenceLength: 'corta',
        bannedWords: ['revolucionario', 'sin precedentes', 'fácil y mágico'],
        keyBrandHashtags: '#StackFlow #RemoteWork',
        notes: 'Enfoque directo a métricas y tiempo ahorrado. Datos duros, capturas de pantalla de la herramienta.',
      },
    },
  },
  {
    id: 'preset-creator',
    name: 'Marca Personal / Asesor & Consultor',
    brand: {
      id: 'brand-creator',
      name: 'Valeria Méndez',
      tagline: 'Estrategia financiera y crecimiento para profesionales independientes',
      handle: '@valeriamendez.finanzas',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      primaryColor: '#0d9488',
      secondaryColor: '#b45309',
      variables: [
        { key: 'marca', label: 'Nombre de la Marca', value: 'Valeria Méndez' },
        { key: 'slogan', label: 'Slogan', value: 'Toma el control real de tus finanzas sin fórmulas mágicas' },
        { key: 'publico_objetivo', label: 'Público Objetivo', value: 'Emprendedores y freelancers que quieren ordenar sus ingresos' },
        { key: 'propuesta_valor', label: 'Propuesta de Valor', value: 'Método paso a paso para planificar impuestos, ahorro e inversión con calma' },
        { key: 'cta_principal', label: 'Llamada a la Acción', value: 'Descarga mi plantilla gratuita de presupuesto mensual en el link de mi perfil' },
        { key: 'enlace_bio', label: 'Enlace', value: 'valeriamendez.com/plantilla' },
        { key: 'codigo_descuento', label: 'Cupón', value: 'COMUNIDAD' },
        { key: 'contacto_whatsapp', label: 'Contacto', value: 'info@valeriamendez.com' },
        { key: 'hashtags_oficiales', label: 'Hashtags', value: '#FinanzasPersonales #Emprendedores #Inversiones' },
      ],
      rules: {
        grammaticalPerson: 'vos',
        maxEmojisPerPost: 3,
        requireHook: true,
        requireCTA: true,
        requireBrandHashtags: true,
        preferredSentenceLength: 'corta',
        bannedWords: ['hágase rico', 'libertad financiera en 30 días', 'criptomoneda mágica'],
        keyBrandHashtags: '#FinanzasPersonales #ValeriaMendez',
        notes: 'Voz empática, pedagógica y realista. Contar anécdotas de errores comunes y cómo superarlos.',
      },
    },
  },
];

export const DEFAULT_TEMPLATES: PostTemplate[] = [
  {
    id: 'tpl-edu-3-tips',
    title: '3 Errores o Claves Prácticas (Educativo)',
    pillarId: 'educativo',
    defaultPlatforms: ['instagram', 'linkedin'],
    description: 'Estructura comprobada: Gancho provocador + 3 puntos concisos + Cierre con llamado a guardar.',
    contentPattern: `La mayoría cree que para {propuesta_valor} hace falta complicarse.

Pero después de analizarlo con decenas de personas, descubrí estos 3 puntos clave:

1. El primer error común: ignorar la constancia en pequeños hábitos diarios.
2. La clave fundamental: priorizar calidad real antes que soluciones exprés.
3. Lo que marca la diferencia: tener a mano alternativas confiables para momentos de prisa.

En {marca} diseñamos cada detalle pensando en {publico_objetivo}.

¿Cuál de estos 3 puntos te cuesta más aplicar? Te leo en los comentarios 👇

{cta_principal}
{hashtags_oficiales}`,
    suggestedHashtags: '{hashtags_oficiales}',
    callToActionPattern: '{cta_principal}',
  },
  {
    id: 'tpl-promo-oferta',
    title: 'Lanzamiento / Promoción con Beneficio Inmediato',
    pillarId: 'promocional',
    defaultPlatforms: ['instagram', 'facebook', 'twitter'],
    description: 'Foco en resolver un dolor concreto con oferta especial y código de descuento.',
    contentPattern: `¿Te pasa que a las 4 de la tarde te quedas sin energía y recurrís a lo primero que encontrás?

En {marca} creamos la solución: {slogan}.

✨ Lo que vas a disfrutar:
• Ingredientes 100% seleccionados y honestos.
• Sin conservantes artificiales ni azúcar añadida.
• Empaque práctico para llevar en tu mochila o cartera.

🎁 BENEFICIO EXCLUSIVO PARA NUESTRA COMUNIDAD:
Usá el código: {codigo_descuento} y obtené un descuento especial en tu primer pedido.

👉 {cta_principal}

{hashtags_oficiales}`,
    suggestedHashtags: '{hashtags_oficiales}',
    callToActionPattern: '{cta_principal}',
  },
  {
    id: 'tpl-caso-exito',
    title: 'Transformación Real / Caso de Éxito',
    pillarId: 'caso_exito',
    defaultPlatforms: ['linkedin', 'instagram'],
    description: 'Muestra el Antes vs Después de un cliente sin exageraciones, con foco en el resultado.',
    contentPattern: `"Antes de conocer {marca}, siempre sentía pesadez después de almorzar en la oficina..."

Así nos contaba una persona de nuestra comunidad hace un mes.

El problema no era la falta de voluntad: era no tener a mano opciones reales para nutrirse en medio de reuniones consecutivas.

Hoy, gracias a nuestro pack semanal, logró:
✅ Mantener su concentración durante toda la jornada.
✅ Ahorrar tiempo diario sin descuidar su bienestar.
✅ Disfrutar de algo rico y saludable sin culpa.

En {marca} no prometemos milagros: ofrecemos {propuesta_valor}.

¿Querés dar este mismo paso?
🔗 {cta_principal}

{hashtags_oficiales}`,
    suggestedHashtags: '{hashtags_oficiales}',
    callToActionPattern: '{cta_principal}',
  },
  {
    id: 'tpl-detras-escena',
    title: 'Detrás de Escena / Cómo lo Hacemos',
    pillarId: 'detras_escena',
    defaultPlatforms: ['instagram', 'tiktok'],
    description: 'Humaniza la marca mostrando el proceso de elaboración o la elección de insumos.',
    contentPattern: `Esto es lo que pasa antes de que tu pedido de {marca} llegue a tu puerta 👀

Muchas personas nos preguntan cómo logramos que nuestros productos se mantengan tan frescos sin usar conservantes.

El secreto está en tres pasos que nunca negociamos:
1. Selección directa de productores locales que comparten nuestros valores.
2. Procesamiento a baja temperatura para preservar nutrientes.
3. Empaque sellado al vacío en el mismo día.

Cuidar los detalles es nuestra forma de respetar tu confianza.

¿Te gustaría que en el próximo video mostremos cómo elegimos cada ingrediente?

{hashtags_oficiales}`,
    suggestedHashtags: '{hashtags_oficiales}',
    callToActionPattern: '{cta_principal}',
  },
  {
    id: 'tpl-comunidad-pregunta',
    title: 'Pregunta Disparadora / Encuesta a la Comunidad',
    pillarId: 'comunidad',
    defaultPlatforms: ['instagram', 'threads', 'twitter'],
    description: 'Ideal para disparar el algoritmo con comentarios y conocer mejor a la audiencia.',
    contentPattern: `Pregunta sincera para nuestra comunidad de {marca}:

Si pudieras cambiar solo 1 hábito de tus mañanas a partir de mañana, ¿cuál elegirías?

A) Desayunar con calma y sin mirar pantallas.
B) Entrenar o caminar 20 minutos antes de arrancar.
C) Organizar tus snacks del día para no improvisar.

Dejá tu letra en los comentarios (A, B o C) y contanos tu mayor obstáculo 👇

{hashtags_oficiales}`,
    suggestedHashtags: '{hashtags_oficiales}',
    callToActionPattern: 'Dejá tu letra en los comentarios 👇',
  },
  {
    id: 'tpl-x-thread-opener',
    title: 'Apertura de Hilo / Post Contundente para X / Twitter',
    pillarId: 'noticia',
    defaultPlatforms: ['twitter', 'threads'],
    description: 'Directo al grano, pensado para retención y lectura ágil con formato de lista.',
    contentPattern: `Dejé de consumir ultraprocesados en el trabajo hace 6 meses.

Estos fueron los 3 cambios que noté en mi energía y concentración:

(Abro hilo de lo que aprendimos en {marca} 🧵👇)`,
    suggestedHashtags: '{hashtags_oficiales}',
    callToActionPattern: '(Abro hilo 🧵👇)',
  },
];

// Helper to get formatted date string for today and upcoming days
function getRelativeDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

export const DEFAULT_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    title: '3 Hábitos para no quedarte sin energía a las 4 PM',
    rawContent: `¿Te pasa que a las 4 de la tarde se te apaga la batería y no sabés por qué? 😴

No es falta de café, es cómo gestionás tu glucosa durante el día.

En {marca} te recomendamos estas 3 claves:
1. Reemplazá el snack refinado por frutos secos activados.
2. Mantené un vaso de agua cerca de tu teclado.
3. Tomate 3 minutos de respiración consciente lejos del monitor.

¿Querés que tu equipo rinda al 100%?
👉 {cta_principal}

{hashtags_oficiales}`,
    platforms: ['instagram', 'linkedin'],
    pillarId: 'educativo',
    status: 'programado',
    scheduledDate: getRelativeDate(0), // Today
    scheduledTime: '11:00',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    notes: 'Publicar junto a carrusel explicativo de 4 diapositivas en Instagram.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'post-2',
    title: 'Lanzamiento: Nuevo Mix Cacao y Semillas con 15% OFF',
    rawContent: `¡Por fin podemos contártelo! 🎉

Presentamos nuestro nuevo Mix Cacao Intenso & Semillas Andinas en {marca}.
Pensado especialmente para quienes buscan {slogan}.

Aprovechá la preventa exclusiva para seguidores:
Usá el código {codigo_descuento} y llevate un 15% de regalo en tu pack semanal.

👉 {cta_principal}

{hashtags_oficiales}`,
    platforms: ['instagram', 'facebook', 'twitter'],
    pillarId: 'promocional',
    status: 'programado',
    scheduledDate: getRelativeDate(2),
    scheduledTime: '18:30',
    imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80',
    notes: 'Enviar también el newsletter con el cupón a la misma hora.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'post-3',
    title: 'Cómo Martina ordenó sus colaciones en la oficina',
    rawContent: `"Antes de conocer {marca}, siempre sentía pesadez después de almorzar..."

Martina trabaja en marketing y sus días son a mil por hora. Nos contó cómo resolver el momento del snack le devolvió el enfoque por las tardes.

En {marca} creemos que comer bien tiene que ser práctico y sin fricción.

Leé la historia completa y conocé la línea completa en el link de nuestra bio.
🔗 {enlace_bio}

{hashtags_oficiales}`,
    platforms: ['linkedin', 'instagram'],
    pillarId: 'caso_exito',
    status: 'revisado',
    scheduledDate: getRelativeDate(4),
    scheduledTime: '09:15',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
    notes: 'Mencionar a Martina en LinkedIn si autoriza la etiqueta.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'post-4',
    title: 'Detrás de escena: El proceso de deshidratado a baja temperatura',
    rawContent: `Así es una mañana en nuestro taller de producción en {marca} 🍃

Para que la fruta conserve sus vitaminas y sabor original, la deshidratamos lentamente durante 14 horas a menos de 45°C.

Cero químicos, cero aditivos. Solo naturaleza pura.

¿Qué fruta te gustaría que sumemos a nuestro próximo mix? ¡Comentanos abajo!

{hashtags_oficiales}`,
    platforms: ['instagram', 'tiktok'],
    pillarId: 'detras_escena',
    status: 'borrador',
    scheduledDate: getRelativeDate(6),
    scheduledTime: '14:00',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    notes: 'Ideal para subir también en formato Reel con música instrumental tranquila.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'post-5',
    title: 'Encuesta: ¿Team dulce o Team salado para cortar la tarde?',
    rawContent: `Pregunta rápida para cerrar la semana con la comunidad de {marca}:

Cuando llega la pausa de las 4 PM, ¿tu cuerpo te pide algo dulce o algo salado?

🍫 Comentá con un emoji dulce si elegís cacao o frutas.
🥜 Comentá con un emoji salado si preferís frutos secos con sal marina.

¡Lxs leemos en comentarios! 👇

{hashtags_oficiales}`,
    platforms: ['instagram', 'threads'],
    pillarId: 'comunidad',
    status: 'idea',
    scheduledDate: getRelativeDate(8),
    scheduledTime: '16:00',
    imageUrl: 'https://images.unsplash.com/photo-1505253758473-96b3d5fe926c?auto=format&fit=crop&w=800&q=80',
    notes: 'Publicar sticker interactivo de encuesta en Instagram Stories en simultáneo.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'post-6',
    title: 'El mito de las barras de cereal industriales',
    rawContent: `La mayoría de las barras de cereal del supermercado tienen más azúcar que una golosina tradicional.

Revisar la lista de ingredientes es el mejor acto de autocuidado: si el primer ingrediente es jarabe de maíz, no es nutrición, es postre.

En {marca} nuestra etiqueta tiene solo 4 ingredientes y podés leerlos sin diccionario químico.

{cta_principal}
{hashtags_oficiales}`,
    platforms: ['twitter', 'threads', 'linkedin'],
    pillarId: 'noticia',
    status: 'programado',
    scheduledDate: getRelativeDate(10),
    scheduledTime: '12:30',
    imageUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80',
    notes: 'Ideal para generar debate constructivo sobre etiquetado frontal.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
