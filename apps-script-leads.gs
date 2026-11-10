/**
 * Recebe os leads da página de captura do e-book "Guia do TEP" (Ped Talks)
 * e grava cada um numa linha da planilha. Passo a passo no README.md.
 */

// Opcional: link do PDF (ex.: Google Drive, compartilhado como "qualquer pessoa com o link").
// Se preenchido, cada lead recebe na hora um e-mail com o botão para baixar o e-book.
var LINK_EBOOK = '';

var WHATSAPP = 'https://wa.me/5585997345004';
var ABA = 'Leads';
var COLUNAS = ['Data', 'Nome', 'E-mail', 'WhatsApp', 'Abrir no WhatsApp', 'Tempo na Pediatria',
               'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'Página', 'Referrer'];

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.empresa || p.hp_trap) return ok_();    // campo anti-spam preenchido = robô

  // só grava lead completo (a página já valida, mas o endpoint é público)
  var tel = String(p.whatsapp || '').replace(/\D/g, '');
  var nomeOk = String(p.nome || '').trim().split(/\s+/).length >= 2;
  var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(p.email || '').trim());
  if (!nomeOk || !emailOk || tel.length < 10 || !String(p.tempo_pediatria || '').trim()) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, erro: 'dados incompletos' })).setMimeType(ContentService.MimeType.JSON);
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var digitos = String(p.whatsapp || '').replace(/\D/g, '');
    abaLeads_().appendRow([
      new Date(),
      txt_(p.nome), txt_(p.email), txt_(p.whatsapp),
      digitos ? 'https://wa.me/55' + digitos : '',
      txt_(p.tempo_pediatria),
      txt_(p.utm_source), txt_(p.utm_medium), txt_(p.utm_campaign), txt_(p.utm_content), txt_(p.utm_term),
      txt_(p.pagina), txt_(p.referrer)
    ]);
  } finally {
    lock.releaseLock();
  }

  if (LINK_EBOOK && p.email) {
    try { enviarEbook_(p); } catch (err) { console.error('E-mail não enviado para ' + p.email + ': ' + err); }
  }
  return ok_();
}

function abaLeads_() {
  var planilha = SpreadsheetApp.getActive();
  var aba = planilha.getSheetByName(ABA);
  if (!aba) {
    aba = planilha.insertSheet(ABA);
    aba.appendRow(COLUNAS);
    aba.getRange(1, 1, 1, COLUNAS.length).setFontWeight('bold').setBackground('#0074F2').setFontColor('#FFFFFF');
    aba.setFrozenRows(1);
    aba.getRange('D:D').setNumberFormat('@');  // WhatsApp como texto
  }
  return aba;
}

/* texto vindo do formulário nunca vira fórmula na planilha */
function txt_(v) {
  v = String(v == null ? '' : v).trim().slice(0, 500);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function enviarEbook_(p) {
  var nome = String(p.nome || '').trim().split(/\s+/)[0];
  nome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
  MailApp.sendEmail({
    to: p.email,
    name: 'Ped Talks',
    subject: 'Seu e-book Guia do TEP chegou',
    htmlBody:
      '<div style="font-family:Arial,sans-serif;font-size:15px;color:#16181d;line-height:1.6;max-width:520px">' +
      '<p>Olá' + (nome ? ', ' + escapar_(nome) : '') + '!</p>' +
      '<p>Aqui está o seu e-book gratuito <b>Guia do TEP</b> — o primeiro passo da sua preparação para o ' +
      'Título de Especialista em Pediatria.</p>' +
      '<p style="margin:26px 0"><a href="' + LINK_EBOOK + '" style="display:inline-block;padding:13px 26px;' +
      'background:#0074F2;color:#ffffff;border-radius:999px;text-decoration:none;font-weight:bold">Baixar o e-book</a></p>' +
      '<p>Quer saber mais sobre o Preparatório TEP? <a href="' + WHATSAPP + '">Fale com a gente no WhatsApp</a>.</p>' +
      '<p>Equipe Ped Talks</p></div>'
  });
}

function escapar_(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function ok_() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
