// URL do Google Apps Script Web App (ver google-apps-script/README.md)
var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzfXSucAYFv-7dkZJ-afWubEJZt6Hw5Gri6oKNUx7dT5TlNpR4Ja6u8QrCjZbokx5kV1A/exec';

var MAX_ANEXO_BYTES = 8 * 1024 * 1024;
var MAX_ANEXOS = 3;

// Envia um pedido (contacto ou simulação) para a Google Sheet.
// `payload.folha` é o separador de destino e `payload.campos` as colunas ({ nome, valor });
// os anexos são lidos do próprio formulário.
function enviarPedido(form, payload) {
  var statusBox = form.querySelector('.form-status');
  var submitBtn = form.querySelector('button[type="submit"]');

  if (APPS_SCRIPT_URL.indexOf('PREENCHER_COM_DEPLOYMENT_ID') !== -1) {
    showStatus('error', 'Formulário ainda não está ligado ao Google Sheets. Configura o URL do Apps Script em assets/js/form.js.');
    return;
  }

  var primeiroErro = validarFormulario(form);
  if (primeiroErro) {
    showStatus('error', 'Há campos por preencher ou com erros — veja as indicações a vermelho.');
    primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
    primeiroErro.focus({ preventScroll: true });
    return;
  }

  var anexoInput = form.querySelector('input[type="file"]');
  var anexos = anexoInput ? ficheirosDoInput(anexoInput) : [];
  var grande = anexos.filter(function (f) { return f.size > MAX_ANEXO_BYTES; })[0];
  if (grande) {
    showStatus('error', 'O ficheiro "' + grande.name + '" excede o limite de 8MB. Reduza o ficheiro ou envie-o por e-mail.');
    return;
  }

  var labelOriginal = submitBtn.textContent;
  submitBtn.textContent = 'A enviar...';
  // Formulário em "loading": campos bloqueados até a resposta chegar.
  form.classList.add('is-loading');
  form.setAttribute('aria-busy', 'true');
  form.inert = true;
  hideStatus();

  Promise.all(anexos.map(readFileAsBase64))
    .then(function (conteudos) {
      payload.anexos = anexos.map(function (f, i) {
        return { nome: f.name, tipo: f.type, base64: conteudos[i] };
      });

      // Content-Type text/plain evita o pedido preflight OPTIONS, que o Apps Script não trata.
      return fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
    })
    .then(function (response) { return response.json(); })
    .then(function (data) {
      if (data && data.result === 'success') {
        form.reset();
        limparErros(form);
        if (anexoInput) definirAnexos(anexoInput, []);
        mostrarModalSucesso(payload.nome);
      } else {
        showStatus('error', 'Não foi possível enviar o pedido. Tente novamente ou contacte-nos por telefone.');
      }
    })
    .catch(function () {
      showStatus('error', 'Não foi possível enviar o pedido. Verifique a ligação à internet e tente novamente.');
    })
    .finally(function () {
      form.inert = false;
      form.removeAttribute('aria-busy');
      form.classList.remove('is-loading');
      submitBtn.textContent = labelOriginal;
    });

  function showStatus(type, message) {
    statusBox.textContent = message;
    statusBox.className = 'form-status ' + type;
  }

  function hideStatus() {
    statusBox.className = 'form-status';
    statusBox.textContent = '';
  }
}

// Erros de validação por baixo de cada campo (a bolha do browser só mostrava o primeiro, e na língua do browser).
var contadorErros = 0;

function mensagemErro(el) {
  var v = el.validity;
  if (v.valueMissing) {
    if (el.type === 'checkbox') return 'Tem de aceitar para enviar o pedido.';
    if (el.type === 'radio' || el.tagName === 'SELECT') return 'Escolha uma opção.';
    return 'Campo obrigatório.';
  }
  if (v.customError) return el.validationMessage;
  if (v.badInput) return el.type === 'date' ? 'Indique uma data válida.' : 'Valor inválido.';
  if (v.typeMismatch && el.type === 'email') return 'Indique um e-mail válido (ex: nome@exemplo.pt).';
  if (v.patternMismatch) return el.title || 'Formato inválido.';
  if (v.rangeUnderflow) return el.type === 'date' ? 'Escolha uma data a partir de ' + dataPT(el.min) + '.' : 'O valor mínimo é ' + el.min + '.';
  if (v.rangeOverflow) return el.type === 'date' ? 'Escolha uma data até ' + dataPT(el.max) + '.' : 'O valor máximo é ' + el.max + '.';
  return 'Valor inválido.';
}

function dataPT(iso) {
  var p = String(iso).split('-');
  return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso;
}

function marcarErro(el, mensagem) {
  var bloco = el.closest('.choice-group') || el.closest('.form-group');
  if (!bloco) return;  // ex: botão de envio
  var erro = bloco.querySelector(':scope > .campo-erro');
  var grupo = el.type === 'radio' && el.form ? el.form.querySelectorAll('input[name="' + el.name + '"]') : [el];

  if (!mensagem) {
    if (erro) erro.remove();
    bloco.classList.remove('tem-erro');
    Array.prototype.forEach.call(grupo, function (x) { x.removeAttribute('aria-invalid'); x.removeAttribute('aria-describedby'); });
    return;
  }
  if (!erro) {
    erro = document.createElement('p');
    erro.className = 'campo-erro';
    erro.id = 'campo-erro-' + (++contadorErros);
    bloco.appendChild(erro);
  }
  erro.textContent = mensagem;
  bloco.classList.add('tem-erro');
  Array.prototype.forEach.call(grupo, function (x) { x.setAttribute('aria-invalid', 'true'); x.setAttribute('aria-describedby', erro.id); });
}

// Marca todos os campos inválidos e devolve o primeiro (ou null se o formulário estiver válido).
function validarFormulario(form) {
  form.classList.add('foi-validado');
  var primeiro = null;
  Array.prototype.forEach.call(form.elements, function (el) {
    if (!el.willValidate) return;
    var valido = el.checkValidity();
    marcarErro(el, valido ? '' : mensagemErro(el));
    if (!valido && !primeiro) primeiro = el;
  });
  return primeiro;
}

function limparErros(form) {
  form.classList.remove('foi-validado');
  Array.prototype.forEach.call(form.querySelectorAll('.campo-erro'), function (e) { e.remove(); });
  Array.prototype.forEach.call(form.querySelectorAll('.tem-erro'), function (b) { b.classList.remove('tem-erro'); });
  Array.prototype.forEach.call(form.querySelectorAll('[aria-invalid]'), function (x) {
    x.removeAttribute('aria-invalid');
    x.removeAttribute('aria-describedby');
  });
}

// Depois da primeira tentativa de envio, os erros atualizam-se à medida que a pessoa corrige os campos.
['input', 'change'].forEach(function (tipoEvento) {
  document.addEventListener(tipoEvento, function (event) {
    var el = event.target;
    var form = el.form;
    if (!form || !form.classList.contains('foi-validado') || !el.willValidate) return;
    marcarErro(el, el.checkValidity() ? '' : mensagemErro(el));
    var status = form.querySelector('.form-status.error');
    if (status && !form.querySelector('.tem-erro')) {
      status.className = 'form-status';
      status.textContent = '';
    }
  });
});

// Modal de confirmação depois de um pedido enviado com sucesso (criado uma vez e reutilizado).
function mostrarModalSucesso(nome) {
  var modal = document.getElementById('modal-sucesso');
  if (!modal) {
    modal = document.createElement('dialog');
    modal.id = 'modal-sucesso';
    modal.className = 'modal';
    modal.setAttribute('aria-labelledby', 'modal-sucesso-titulo');
    modal.innerHTML =
      '<div class="modal-icone" aria-hidden="true">✓</div>' +
      '<h2 id="modal-sucesso-titulo">Pedido enviado com sucesso</h2>' +
      '<p class="modal-texto"></p>' +
      '<button type="button" class="btn btn-primary">Fechar</button>';
    modal.querySelector('button').addEventListener('click', function () { modal.close(); });
    // Clicar fora da caixa (no fundo escurecido) também fecha.
    modal.addEventListener('click', function (event) { if (event.target === modal) modal.close(); });
    document.body.appendChild(modal);
  }

  var primeiroNome = String(nome || '').trim().split(/\s+/)[0];
  modal.querySelector('.modal-texto').textContent =
    'Obrigado' + (primeiroNome ? ', ' + primeiroNome : '') +
    '! Recebemos o seu pedido e entraremos em contacto brevemente por e\u2011mail.';

  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    alert('Pedido enviado com sucesso. Entraremos em contacto brevemente por e-mail.');
  }
}

function readFileAsBase64(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function () {
      var result = reader.result;
      resolve(result.substring(result.indexOf(',') + 1));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Anexos múltiplos: cada nova escolha junta-se às anteriores (até MAX_ANEXOS), com lista para remover.
function ficheirosDoInput(input) {
  return input._anexos || Array.prototype.slice.call(input.files);
}

function definirAnexos(input, ficheiros, excesso) {
  input._anexos = ficheiros;
  try {
    var dt = new DataTransfer();
    ficheiros.forEach(function (f) { dt.items.add(f); });
    input.files = dt.files;
  } catch (e) { /* browsers sem DataTransfer: a lista abaixo continua a ser a fonte de verdade */ }

  var lista = input.parentNode.querySelector('.anexo-lista');
  if (!lista) {
    lista = document.createElement('ul');
    lista.className = 'anexo-lista';
    input.insertAdjacentElement('afterend', lista);
  }
  lista.innerHTML = '';
  ficheiros.forEach(function (f, i) {
    var item = document.createElement('li');
    var tamanho = f.size < 1024 * 1024 ? Math.max(1, Math.round(f.size / 1024)) + ' KB' : (f.size / 1024 / 1024).toFixed(1) + ' MB';
    item.textContent = f.name + ' (' + tamanho + ')';
    var remover = document.createElement('button');
    remover.type = 'button';
    remover.className = 'anexo-remover';
    remover.textContent = '×';
    remover.setAttribute('aria-label', 'Remover ' + f.name);
    remover.addEventListener('click', function () {
      definirAnexos(input, ficheiros.filter(function (_, j) { return j !== i; }));
    });
    item.appendChild(remover);
    lista.appendChild(item);
  });
  if (excesso) {
    var aviso = document.createElement('li');
    aviso.className = 'anexo-aviso';
    aviso.textContent = 'Só é possível anexar até ' + MAX_ANEXOS + ' ficheiros.';
    lista.appendChild(aviso);
  }
}

document.addEventListener('change', function (event) {
  var input = event.target;
  if (!input.matches || !input.matches('input[type="file"][multiple]')) return;
  var atuais = (input._anexos || []).slice();
  Array.prototype.forEach.call(input.files, function (f) {
    var repetido = atuais.some(function (x) { return x.name === f.name && x.size === f.size; });
    if (!repetido) atuais.push(f);
  });
  definirAnexos(input, atuais.slice(0, MAX_ANEXOS), atuais.length > MAX_ANEXOS);
});

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var ramoParam = new URLSearchParams(window.location.search).get('ramo');
  if (ramoParam && form.ramo.querySelector('option[value="' + ramoParam + '"]')) {
    form.ramo.value = ramoParam;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var dados = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      telefone: form.telefone.value.trim(),
      ramo: form.ramo.value,
      tipo: 'Contacto geral',
      mensagem: form.mensagem.value.trim(),
    };
    dados.folha = 'Contactos';
    dados.campos = [
      { nome: 'Nome', valor: dados.nome },
      { nome: 'E-mail', valor: dados.email },
      { nome: 'Telefone', valor: dados.telefone },
      { nome: 'Ramo', valor: form.ramo.value ? form.ramo.options[form.ramo.selectedIndex].text : '' },
      { nome: 'Mensagem', valor: dados.mensagem },
    ];
    enviarPedido(form, dados);
  });
});
