# Captura — E-book gratuito "Guia do TEP" (Ped Talks)

Página de captura do e-book gratuito do Preparatório TEP. A pessoa preenche nome,
e-mail, WhatsApp e há quanto tempo atua na Pediatria (todos obrigatórios) e vê um
pop-up confirmando que vai receber o e-book por e-mail ou WhatsApp, com o botão para
falar com a central sobre o Preparatório TEP.

Mesmo visual da landing do Preparatório TEP (preto `#040405` + azul `#0074F2`, DM Sans).

🔗 **Página publicada:** https://gtalksmkt.github.io/captura-ebook-tep/

## Arquivos

```
index.html            a página (HTML/CSS/JS, sem build)
img/capa-ebook-tep.jpg  capa do e-book (usada no mockup 3D)
img/logo-pedtalks.png   logo Ped Talks
img/rebecca.jpg, img/natalia.jpg   avatares das autoras
img/og-ebook-tep.jpg    imagem de compartilhamento do link
apps-script-leads.gs  script que grava os leads numa planilha Google (opcional)
```

## ⚠️ Antes de publicar

1. **Para onde vão os leads** — preencher `CONFIG.ENDPOINT` no `<script>` do `index.html`.
   Enquanto estiver vazio, o pop-up aparece normalmente, mas **nenhum dado é salvo**.
2. **WhatsApp** — `CONFIG.WHATSAPP` está com a central da landing TEP (85) 99734-5004.
   Se for outro número, trocar ali e no rodapé.

A imagem que aparece ao compartilhar o link (WhatsApp, Instagram etc.) é `img/og-ebook-tep.jpg` (1200×630).

## Ligar o formulário a uma planilha Google (grátis, ~5 min)

1. Crie uma planilha nova no Google Drive (ex.: "Leads — E-book TEP").
2. Menu **Extensões → Apps Script**. Apague o que estiver lá e cole o conteúdo de `apps-script-leads.gs`.
3. (Opcional) Para mandar o e-book automaticamente por e-mail, suba o PDF no Drive,
   compartilhe como "qualquer pessoa com o link" e cole o link em `LINK_EBOOK`.
4. **Implantar → Nova implantação → Tipo: App da Web**.
   *Executar como:* você · *Quem pode acessar:* **Qualquer pessoa**. Autorize quando pedir.
5. Copie a URL que termina em `/exec` e cole em `CONFIG.ENDPOINT` no `index.html`.
6. Teste preenchendo a página: a linha aparece na aba **Leads**, com um link pronto
   para abrir a conversa no WhatsApp de cada pessoa.

Limite do e-mail automático: ~100 envios/dia numa conta Gmail comum (1.500 no Google Workspace).

## Usar outra ferramenta (RD Station, Zapier, Make, CRM…)

Qualquer URL que aceite `POST` serve como `ENDPOINT`. Os campos enviados são:
`nome`, `email`, `whatsapp`, `tempo_pediatria`, `utm_source`, `utm_medium`,
`utm_campaign`, `utm_content`, `utm_term`, `pagina`, `referrer`.

## Pixel / Google Tag Manager

Ao enviar, a página dispara `dataLayer.push({event: 'lead_ebook_tep'})` e, se o
Pixel da Meta estiver instalado, `fbq('track', 'Lead')`. Basta colar o código do
pixel/GTM no `<head>`.

## Rodar localmente

No app, preview **"captura-tep"** (porta 8130), configurado em `Documents\.claude\launch.json`.
