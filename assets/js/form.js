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

  if (!form.checkValidity()) {
    form.reportValidity();
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
