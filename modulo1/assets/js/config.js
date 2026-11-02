/* =====================================================================
   CONFIGURAÇÃO CENTRAL DO FUNIL — Chef Marllon Rezende
   Um único arquivo para as 3 páginas (captura, confirmação e vendas).
   Campos vazios ("") ficam ocultos. Nada comercial aparece sem você preencher.
   ===================================================================== */
window.CONFIG = {

  /* ---------- Páginas do funil ---------- */
  pages: {
    capture: "index.html#vip",    // página inicial enxuta: brócolis + aula grátis + curso + depoimentos
    thanks:  "obrigado.html",      // confirmação (use nos links dos e-mails)
    sales:   "curso.html"          // página de vendas completa do Módulo 1
  },
  gateFreeLesson: true,            // true: na página de vendas, "aula grátis" leva à captura

  /* ---------- Oferta (página de vendas) ---------- */
  checkoutUrl: "",                 // link do checkout com preço cheio — UTMs são repassadas
  price: "R$ 297,00",              // preço cheio exibido
  priceValue: 297,                 // preço em número (usado para calcular o desconto)

  /* ---------- Lista VIP Black Friday ---------- */
  vip: {
    discount: 30,                  // % de desconto para quem entra na lista
    label: "Lista VIP Black Friday",
    checkoutUrl: "",               // link do checkout COM o desconto (liberado para quem se cadastrou)
    coupon: "",                    // cupom, se a plataforma usar (ex: "VIPBF30")
    deadline: ""                   // data real de encerramento (ex: "2026-11-30T23:59:00-03:00"); vazio = sem contador
  },
  priceNote: "",                   // ex: "ou 12x de R$ 19,70" — só se for real
  handout: false,                  // true quando a apostila estiver confirmada
  guarantee: "",                   // só se for real
  accessPeriod: "",                // ex: "Acesso por 12 meses"
  certificate: "",                 // ex: "Certificado de conclusão"
  faqAccess: "",                   // resposta de "Como recebo acesso ao curso?"
  faqPayment: "",                  // resposta de "Como funciona o pagamento?"
  whatsapp: "5521991476902",

  /* ---------- Vídeo da parte 1: Chef demonstrando os dois brócolis ---------- */
  heroVideoUrl: "",                // YouTube/Vimeo ou .mp4
  heroVideoPoster: "assets/fotos/chef-retrato-sorrindo.jpg",
  heroVideoVertical: false,        // true se o vídeo for vertical (celular)

  /* ---------- Aula gratuita (branqueamento) ---------- */
  freeLessonUrl: "",               // link YouTube/Vimeo ou arquivo .mp4 (ex: "assets/videos/aula-branqueamento.mp4")
  freeLessonCover: "",             // foto de brócolis/legumes (ex: "assets/fotos/brocolis.jpg")

  /* ---------- Captura de leads (e-mail marketing) ----------
     Funciona com qualquer ferramenta que receba POST:
     webhook do Make/Zapier/n8n, formulário do RD Station, ActiveCampaign,
     Mailchimp (form action), Brevo, ConvertKit, planilha via Apps Script…
     Enquanto "endpoint" estiver vazio, NENHUM cadastro é salvo e a página avisa. */
  lead: {
    endpoint: "",                  // URL que recebe o cadastro
    format: "json",                // "json" ou "form" (form-urlencoded, usado por formulários HTML)
    mode: "no-cors",               // "no-cors" para webhooks de terceiros; "cors" se o seu endpoint responder com CORS
    fields: { name: "nome", email: "email" },   // nomes dos campos esperados pela ferramenta
    extra: { tag: "lista-vip-black-friday", origem: "landing-aula-gratis" }  // campos fixos enviados junto
  },
  emailAutomationActive: false,   // true quando o e-mail 1 (entrega da aula) estiver ativo na ferramenta
  privacyContact: "chefmarllon@gmail.com",      // contato para pedidos sobre dados (LGPD)
  privacyUrl: "",                  // link da sua política de privacidade completa (opcional)

  /* ---------- Depoimentos (página de vendas) ---------- */
  testimonials: [
    { src: "assets/videos/depoimento-1.mp4", poster: "assets/videos/depoimento-1.jpg", name: "" },
    { src: "", poster: "", name: "" },
    { src: "", poster: "", name: "" }
  ],

  /* ---------- Fotos autorais (pasta assets/fotos) ---------- */
  photos: {
    hero:        "assets/fotos/chef-flambe.jpg",
    heroTop:     "assets/fotos/chef-ensinando.jpg",   // foto de topo (v2/v3)
    transform:   "assets/fotos/chef-empratando.jpg",
    lessons:     "assets/fotos/chef-bife-arroser.jpg",
    fundamentos: "assets/fotos/chef-finalizando-caldo.jpg",
    chef:        "assets/fotos/chef-retrato-bracos-cruzados.jpg",
    chef2:       "assets/fotos/chef-retrato-sorrindo.jpg",
    bast1:       "assets/fotos/workshop-chef-aluna-massa.jpg",
    bast2:       "assets/fotos/workshop-alunas-cilindro.jpg",
    bast3:       "assets/fotos/workshop-aluna-sorrindo.jpg",
    captureHero: "assets/fotos/chef-retrato-sorrindo.jpg",
    captureSkill:"assets/fotos/chef-empratando.jpg",
    brocoliFeio:  "",              // foto do brócolis apagado/cinza (vazio = ilustração)
    brocoliVerde: ""               // foto do brócolis verde de restaurante (vazio = ilustração)
  },

  /* ---------- Métricas ----------
     Os rastreadores só carregam depois que o visitante aceita os cookies (LGPD). */
  metaPixelId: "",                 // ex: "123456789012345"
  gaMeasurementId: ""              // ex: "G-XXXXXXXXXX"
};
