// Formulários de simulação por tipo de seguro (seguros-nao-vida.html e seguros-vida.html).
// Cada botão [data-sim-toggle="x"] abre/fecha o painel #simular-x, onde o formulário é criado a partir de TIPOS.

var TIPOS = {
  automovel: {
    titulo: 'Seguro Auto',
    anexoDica: 'Ex: DUA, carta de condução, apólice atual.',
    infoDica: 'Neste campo poderá informar qual a seguradora atual, valor pago na última anuidade, ou outras informações que considere pertinente.',
    campos: [
      { name: 'data_inicio', label: 'Data de início do seguro', type: 'date', required: true, minHoje: true },
      { name: 'veiculo', label: 'Tipo de veículo', type: 'radio', required: true, options: ['Automóvel', 'Moto'], full: true },
      { name: 'marca_modelo', label: 'Marca e modelo', required: true, placeholder: 'Ex: Renault Clio 1.5 dCi' },
      { name: 'matricula', label: 'Matrícula', required: true, placeholder: 'Ex: AA-00-AA' },
      { name: 'codigo_postal', label: 'Código postal', required: true, placeholder: 'Ex: 3800-000' },
      { name: 'nascimento', label: 'Data de nascimento do condutor', type: 'date', required: true },
      { name: 'carta', label: 'Data de obtenção da carta de condução', type: 'date', required: true },
      { name: 'coberturas', label: 'Tipo de coberturas (assinale as pretendidas)', type: 'checkbox', full: true,
        options: ['Quebra Isolada de Vidros', 'Quebra Isolada de Vidros + Furto e Roubo', 'Danos Próprios Completo (Multirriscos)', 'Viatura de Substituição'] },
      { name: 'sinistros', label: 'Sinistros nos últimos 5 anos', type: 'select', options: ['Nenhum', '1', '2 ou mais'] },
    ],
  },
  habitacao: {
    titulo: 'Seguro Habitação',
    anexoDica: 'Ex: apólice atual, caderneta predial.',
    infoDica: 'Indique que tipo de coberturas deseja ou outras informações que considere relevante.',
    campos: [
      { name: 'data_inicio', label: 'Data de início do seguro', type: 'date', required: true, minHoje: true },
      { name: 'objeto', label: 'O que pretende segurar', type: 'radio', required: true, full: true,
        options: ['Edifício e recheio', 'Apenas edifício', 'Apenas recheio'] },
      { name: 'tipo_imovel', label: 'Tipo de imóvel', type: 'select', required: true, options: ['Apartamento', 'Moradia', 'Outro'] },
      { name: 'utilizacao', label: 'Utilização', type: 'select', required: true,
        options: ['Habitação própria permanente', 'Habitação secundária', 'Arrendada a terceiros', 'Alojamento Local'] },
      { name: 'codigo_postal', label: 'Código postal', required: true, placeholder: 'Ex: 3830-000' },
      { name: 'ano_construcao', label: 'Ano de construção', type: 'number', min: 1800, max: 2030 },
      { name: 'area', label: 'Área (m²)', type: 'number', min: 1 },
      { name: 'credito', label: 'Tem crédito habitação?', type: 'select', options: ['Sim', 'Não'] },
      { name: 'capital_imovel', label: 'Valor do imóvel a segurar (€)', type: 'number', min: 0, placeholder: 'Se souber' },
      { name: 'capital_recheio', label: 'Valor do recheio (€)', type: 'number', min: 0, placeholder: 'Se souber' },
    ],
  },
  saude: {
    titulo: 'Seguro de Saúde',
    anexoDica: 'Ex: apólice atual.',
    infoDica: 'Pode descrever qual o tipo de coberturas que procura, bem como atuais apólices que possua.',
    campos: [
      { name: 'data_inicio', label: 'Data de início do seguro', type: 'date', required: true, minHoje: true },
      { name: 'pessoas', label: 'Número de pessoas a segurar', type: 'number', required: true, min: 1 },
      { name: 'idades', label: 'Idade das pessoas', required: true, placeholder: 'Ex: 42, 40, 12' },
      { name: 'plano', label: 'Plano pretendido', type: 'select', required: true,
        options: ['Base (consultas e exames)', 'Intermédio (inclui internamento)', 'Completo (inclui estomatologia e parto)', 'Preciso de aconselhamento'] },
      { name: 'seguro_atual', label: 'Tem seguro de saúde atualmente?', type: 'select', options: ['Sim', 'Não'] },
      { name: 'ambito', label: 'Âmbito', type: 'radio', full: true, options: ['Portugal', 'Portugal e Estrangeiro'] },
      { name: 'coberturas', label: 'Coberturas pretendidas (assinale as que deseja)', type: 'checkbox', full: true,
        options: ['Hospitalização', 'Cirurgias', 'Estomatologia', 'Parto', 'Medicamentos', 'Segunda opinião médica'] },
    ],
  },
  viagem: {
    titulo: 'Seguro de Viagem',
    anexoDica: 'Ex: plano de viagem.',
    infoDica: 'Pode indicar qual o propósito da viagem, o destino ou possíveis escalas.',
    campos: [
      { name: 'destino', label: 'País de destino', required: true, placeholder: 'Ex: Espanha, Brasil' },
      { name: 'tipo_viagem', label: 'Tipo de seguro', type: 'select', required: true, options: ['Viagem única', 'Anual (várias viagens)'] },
      { name: 'data_ida', label: 'Data de ida', type: 'date', required: true },
      { name: 'data_regresso', label: 'Data de regresso', type: 'date', required: true },
      { name: 'viajantes', label: 'Número de viajantes', type: 'number', required: true, min: 1 },
      { name: 'idades', label: 'Idades dos viajantes', placeholder: 'Ex: 35, 33, 6' },
      { name: 'motivo', label: 'Motivo', type: 'select', required: true, options: ['Lazer', 'Trabalho', 'Estudo', 'Desporto'] },
      { name: 'desporto_risco', label: 'Vai praticar desportos ou atividades de risco?', type: 'radio', options: ['Sim', 'Não'] },
      { name: 'coberturas', label: 'Coberturas pretendidas (assinale as que deseja)', type: 'checkbox', full: true,
        options: ['Despesas médicas', 'Cancelamento ou interrupção', 'Bagagem', 'Atrasos de voo', 'Responsabilidade civil',
          'Acidentes pessoais', 'Assistência e repatriamento'] },
    ],
  },
  'acidentes-trabalho': {
    titulo: 'Seguro de Acidentes de Trabalho',
    anexoDica: 'Ex: apólice atual, declaração de início de atividade.',
    infoDica: 'Pode descrever que tipo de coberturas pretende, se já tem alguma apólice ativa.',
    campos: [
      { name: 'tomador', label: 'Para quem é o seguro?', type: 'select', required: true,
        options: ['Trabalhador independente', 'Empresa/Entidade Empregadora'] },
      { name: 'atividade', label: 'Atividade/profissão', required: true, placeholder: 'Ex: eletricista, restauração, construção' },
      { name: 'trabalhadores', label: 'Número de trabalhadores', type: 'number', min: 1, placeholder: 'Se for empresa' },
      { name: 'remuneracao', label: 'Remuneração anual a segurar (€)', type: 'number', min: 0, placeholder: 'Total anual estimado' },
    ],
  },
  'acidentes-pessoais': {
    titulo: 'Seguro de Acidentes Pessoais',
    anexoDica: 'Ex: apólice atual.',
    infoDica: 'Pode descrever que tipo de coberturas pretende, se já tem alguma apólice ativa.',
    campos: [
      { name: 'data_inicio', label: 'Data de início do seguro', type: 'date', required: true, minHoje: true },
      { name: 'quem', label: 'Quem pretende segurar?', type: 'radio', required: true, full: true,
        options: ['Eu', 'Casal', 'Família', 'Outros'] },
      { name: 'nascimento', label: 'Data de nascimento', type: 'date', required: true },
      { name: 'profissao', label: 'Profissão', required: true },
      { name: 'ambito_seguro', label: 'Âmbito do seguro', type: 'select',
        options: ['Vida pessoal', 'Atividade profissional', 'Atividade desportiva', 'Viagens', 'Proteção permanente — 24 horas', 'Outro'] },
      { name: 'area_geografica', label: 'Área geográfica', type: 'select',
        options: ['Portugal', 'Europa', 'Todo o mundo', 'Não sei — pretendo aconselhamento'] },
      { name: 'capital', label: 'Capital pretendido (€)', type: 'number', min: 0, placeholder: 'Se souber' },
    ],
  },
  'responsabilidade-civil': {
    titulo: 'Seguro de Responsabilidade Civil',
    anexoDica: 'Ex: apólice atual, exigência contratual.',
    infoDica: 'Informações adicionais',
    campos: [
      { name: 'data_inicio', label: 'Data de início do seguro', type: 'date', required: true, minHoje: true },
      { name: 'tipo_rc', label: 'Tipo de responsabilidade civil', type: 'select', required: true,
        options: ['Familiar / vida privada', 'Profissional', 'Animais de companhia', 'Atividade desportiva', 'Eventos', 'Outra', 'Preciso de aconselhamento'] },
      { name: 'capital', label: 'Capital pretendido (€)', type: 'number', min: 0, placeholder: 'Se souber' },
      { name: 'descricao', label: 'O que pretende segurar?', type: 'textarea', required: true, full: true,
        placeholder: 'Descreva o tipo de atividade e o risco a segurar de forma a que consigamos encontrar a melhor solução para si' },
    ],
  },
  animais: {
    titulo: 'Seguro para Animais de Companhia',
    anexoDica: 'Ex: apólice atual, boletim de vacinas.',
    infoDica: 'Descreva outras características do animal, tais como doenças, últimas cirurgias.',
    campos: [
      { name: 'data_inicio', label: 'Data de início do seguro', type: 'date', required: true, minHoje: true },
      { name: 'tipo_animal', label: 'Tipo de animal', type: 'radio', required: true, full: true, options: ['Cão', 'Gato', 'Outro'] },
      { name: 'morada_animal', label: 'Morada do animal', required: true, full: true },
      { name: 'nome_animal', label: 'Nome do animal', required: true },
      { name: 'especie', label: 'Espécie', required: true },
      { name: 'genero', label: 'Género', type: 'select', required: true, options: ['Macho', 'Fêmea'] },
      { name: 'raca', label: 'Raça', required: true },
      { name: 'nascimento_animal', label: 'Data de nascimento', type: 'date', required: true },
      { name: 'peso', label: 'Peso (kg)', type: 'number', required: true, min: 0, step: '0.1' },
      { name: 'esterilizado', label: 'Está esterilizado?', type: 'radio', required: true, options: ['Sim', 'Não'] },
      { name: 'coberturas', label: 'Coberturas pretendidas (assinale as que deseja)', type: 'checkbox', full: true,
        options: ['Responsabilidade civil', 'Consultas veterinárias', 'Cirurgias', 'Medicamentos', 'Internamento', 'Acidentes',
          'Morte ou desaparecimento', 'Assistência'] },
    ],
  },
  'seguro-de-vida': {
    titulo: 'Seguro de Vida',
    anexoDica: 'Ex: apólice atual, última simulação.',
    campos: [
      { name: 'data_inicio', label: 'Data de início do seguro', type: 'date', required: true, minHoje: true },
      { name: 'pessoas', label: 'Pessoas a segurar', type: 'radio', required: true, full: true, options: ['Uma pessoa', 'Duas pessoas'] },
      { name: 'nascimento', label: 'Data de nascimento', type: 'date', required: true },
      { name: 'nascimento_2', label: 'Data de nascimento da segunda pessoa segura', type: 'date', required: true,
        mostrarSe: { campo: 'pessoas', valor: 'Duas pessoas' } },
      { name: 'profissao', label: 'Profissão' },
      { name: 'capital', label: 'Capital pretendido (€)', type: 'number', required: true, min: 0 },
      { name: 'coberturas', label: 'Coberturas pretendidas', type: 'select',
        options: ['Morte', 'Morte e invalidez', 'Morte, invalidez e doenças graves', 'Preciso de aconselhamento'] },
    ],
  },
  'poupanca-reforma': {
    titulo: 'Poupança / PPR',
    anexoDica: 'Ex: extrato de PPR atual.',
    campos: [
      { name: 'data_inicio', label: 'Data de início do seguro', type: 'date', required: true, minHoje: true },
      { name: 'nascimento', label: 'Data de nascimento', type: 'date', required: true },
      { name: 'objetivo', label: 'Objetivo', type: 'select', required: true,
        options: ['Complemento de reforma (PPR)', 'Poupança a médio/longo prazo', 'Educação dos filhos'] },
      { name: 'tipo_entrega', label: 'Tipo de seguro', type: 'select', required: true, options: ['Entrega Única', 'Entregas Periódicas'] },
      { name: 'montante_inicial', label: 'Montante inicial (€)', type: 'number', required: true, min: 0 },
      { name: 'entrega_periodica', label: 'Entrega periódica (€)', type: 'number', min: 0 },
      { name: 'perfil', label: 'Perfil de risco', type: 'select', options: ['Conservador', 'Moderado', 'Dinâmico', 'Preciso de aconselhamento'] },
    ],
  },
  'credito-habitacao': {
    titulo: 'Seguro de Vida Crédito Habitação',
    anexoDica: 'Ex: FINE / simulação do banco, condições do banco, apólice atual.',
    campos: [
      { name: 'data_inicio', label: 'Data de início do seguro', type: 'date', required: true, minHoje: true },
      { name: 'titulares', label: 'Número de titulares', type: 'select', required: true, options: ['1', '2'] },
      { name: 'nascimento', label: 'Data de nascimento do 1.º titular', type: 'date', required: true },
      { name: 'nascimento_2', label: 'Data de nascimento do 2.º titular', type: 'date', required: true,
        mostrarSe: { campo: 'titulares', valor: '2' } },
      { name: 'capital_divida', label: 'Capital em dívida (€)', type: 'number', required: true, min: 0 },
      { name: 'prazo', label: 'Prazo restante (anos)', type: 'number', min: 1, max: 50 },
      { name: 'banco', label: 'Banco', placeholder: 'Ex: CGD, Millennium, Santander' },
      { name: 'situacao', label: 'Situação atual', type: 'select',
        options: ['Crédito novo', 'Já tenho seguro no banco', 'Já tenho seguro noutra seguradora'] },
    ],
  },
};

document.addEventListener('DOMContentLoaded', function () {
  var botoes = document.querySelectorAll('[data-sim-toggle]');
  if (!botoes.length) return;

  botoes.forEach(function (botao) {
    botao.setAttribute('aria-expanded', 'false');
    botao.setAttribute('aria-controls', 'simular-' + botao.dataset.simToggle);
    botao.addEventListener('click', function (event) {
      event.preventDefault();
      alternar(botao.dataset.simToggle);
    });
  });

  // Permite ligar diretamente a um formulário aberto, ex: seguros-nao-vida.html#simular-automovel
  if (location.hash.indexOf('#simular-') === 0) {
    alternar(location.hash.replace('#simular-', ''), true);
  }

  function alternar(chave, forcarAbrir) {
    var painel = document.getElementById('simular-' + chave);
    var botao = document.querySelector('[data-sim-toggle="' + chave + '"]');
    if (!painel || !TIPOS[chave]) return;

    var abrir = forcarAbrir || painel.hidden;
    if (abrir && !painel.firstChild) painel.appendChild(criarFormulario(chave, painel.dataset.ramo));

    painel.hidden = !abrir;
    if (botao) {
      botao.setAttribute('aria-expanded', String(abrir));
      botao.textContent = abrir ? 'Fechar simulação' : 'Pedir simulação';
    }
    if (abrir) {
      painel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var primeiro = painel.querySelector('input, select, textarea');
      if (primeiro) primeiro.focus({ preventScroll: true });
    }
  }
});

function criarFormulario(chave, ramo) {
  var tipo = TIPOS[chave];
  var prefixo = 'sim-' + chave + '-';

  var form = document.createElement('form');
  form.className = 'sim-form';
  form.noValidate = true;
  form.innerHTML =
    '<h3>Simulação — ' + tipo.titulo + '</h3>' +
    '<p class="sim-intro">Preencha o que souber — os campos com * são obrigatórios. Respondo com uma proposta o mais brevemente possível.</p>' +
    (tipo.nota ? '<p class="sim-nota"><strong>Nota:</strong> ' + tipo.nota + '</p>' : '') +
    '<p class="sim-section-title">Dados para a simulação</p>' +
    '<div class="sim-grid">' + tipo.campos.map(function (c) { return campoHtml(c, prefixo); }).join('') + '</div>' +
    '<p class="sim-section-title">Os seus contactos</p>' +
    '<div class="sim-grid">' +
      campoHtml({ name: 'nome', label: 'Nome', required: true }, prefixo) +
      campoHtml({ name: 'email', label: 'E-mail', type: 'email', required: true }, prefixo) +
      campoHtml({ name: 'telefone', label: 'Telemóvel', type: 'tel', required: true, placeholder: 'Ex: 912 345 678' }, prefixo) +
      campoHtml({ name: 'nif', label: 'NIF', required: true, placeholder: '9 dígitos', pattern: '[0-9]{9}', maxlength: 9,
        inputmode: 'numeric', title: 'O NIF tem 9 dígitos' }, prefixo) +
    '</div>' +
    '<div class="form-group">' +
      '<label for="' + prefixo + 'observacoes">Informações adicionais</label>' +
      '<textarea id="' + prefixo + 'observacoes" name="observacoes" rows="3"' +
        (tipo.infoDica ? ' placeholder="' + tipo.infoDica + '"' : '') + '></textarea>' +
    '</div>' +
    '<div class="form-group">' +
      '<label for="' + prefixo + 'anexo">Anexos (opcional)</label>' +
      '<input type="file" id="' + prefixo + 'anexo" name="anexo" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">' +
      '<small class="form-hint">' + tipo.anexoDica + ' Até 3 ficheiros, máx. 8MB cada (PDF, imagem ou Word).</small>' +
    '</div>' +
    '<div class="form-group checkbox-row">' +
      '<input type="checkbox" id="' + prefixo + 'rgpd" name="rgpd" required>' +
      '<label for="' + prefixo + 'rgpd">Autorizo o tratamento dos meus dados pessoais para efeitos de resposta ao meu pedido de simulação, ' +
        'nos termos da <a href="privacidade.html" target="_blank">Política de Privacidade</a>. *</label>' +
    '</div>' +
    '<button type="submit" class="btn btn-primary">Enviar pedido de simulação</button>' +
    '<div class="form-status" role="status"></div>';

  function atualizarCondicionais() {
    form.querySelectorAll('[data-mostrar-campo]').forEach(function (bloco) {
      var origem = form.elements[bloco.dataset.mostrarCampo];
      var visivel = !!origem && origem.value === bloco.dataset.mostrarValor;
      bloco.hidden = !visivel;
      bloco.querySelectorAll('input, select, textarea').forEach(function (el) {
        el.disabled = !visivel;  // campos escondidos não são validados nem enviados com valor
        if (!visivel && el.type !== 'checkbox' && el.type !== 'radio') el.value = '';
      });
    });
  }
  // NIF: além dos 9 dígitos, confirma o dígito de controlo (evita gralhas e clientes duplicados).
  var campoNif = form.elements.nif;
  campoNif.addEventListener('input', function () {
    var v = campoNif.value.replace(/\D/g, '');
    campoNif.setCustomValidity(v.length === 9 && !nifValido(v) ? 'Este NIF não é válido. Confirme os dígitos.' : '');
  });

  form.addEventListener('change', atualizarCondicionais);
  form.addEventListener('reset', function () { setTimeout(atualizarCondicionais, 0); });
  atualizarCondicionais();

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var nome = form.elements.nome.value.trim();
    var email = form.elements.email.value.trim();
    var telefone = form.elements.telefone.value.trim();
    var nif = form.elements.nif.value.trim();
    var observacoes = form.elements.observacoes.value.trim();

    // Cada campo vira uma coluna no separador deste tipo de seguro (ver google-apps-script/Code.gs).
    var campos = [
      { nome: 'Nome', valor: nome },
      { nome: 'E-mail', valor: email },
      { nome: 'Telemóvel', valor: telefone },
      { nome: 'NIF', valor: nif },
    ];
    var linhas = ['Pedido de simulação — ' + tipo.titulo, '', 'NIF: ' + nif];
    tipo.campos.forEach(function (c) {
      var rotulo = c.label.replace(/ \(assinale.*\)$/, '');
      var valor = valorCampo(form, c);
      campos.push({ nome: rotulo, valor: valor });
      if (valor) linhas.push(rotulo + ': ' + valor);
    });
    campos.push({ nome: 'Informações adicionais', valor: observacoes });
    if (observacoes) linhas.push('', 'Informações adicionais:', observacoes);

    enviarPedido(form, {
      folha: tipo.titulo,
      campos: campos,
      // Campos antigos, usados pelo Apps Script anterior (compatibilidade até ser atualizado).
      nome: nome,
      email: email,
      telefone: telefone,
      ramo: ramo,
      tipo: tipo.titulo,
      mensagem: linhas.join('\n'),
    });
  });

  return form;
}

function campoHtml(c, prefixo) {
  var id = prefixo + c.name;
  var req = c.required ? ' required' : '';
  // Campo que só aparece quando outro campo tem um dado valor (ex: segunda pessoa segura).
  var cond = c.mostrarSe ? ' data-mostrar-campo="' + c.mostrarSe.campo + '" data-mostrar-valor="' + c.mostrarSe.valor + '" hidden' : '';
  var label = '<label for="' + id + '">' + c.label + (c.required ? ' *' : '') + '</label>';
  var placeholder = c.placeholder ? ' placeholder="' + c.placeholder + '"' : '';
  var controlo;

  if (c.type === 'radio' || c.type === 'checkbox') {
    return '<fieldset class="form-group choice-group choice-' + c.type + (c.full ? ' full' : '') + '"' + cond + '>' +
      '<legend>' + c.label + (c.required ? ' *' : '') + '</legend>' +
      c.options.map(function (o, i) {
        var oid = id + '-' + i;
        return '<label class="choice" for="' + oid + '"><input type="' + c.type + '" id="' + oid + '" name="' + c.name + '" value="' + o + '"' +
          (c.type === 'radio' ? req : '') + '> ' + o + '</label>';
      }).join('') +
      '</fieldset>';
  }

  if (c.type === 'select') {
    controlo = '<select id="' + id + '" name="' + c.name + '"' + req + '>' +
      '<option value="">Selecione uma opção</option>' +
      c.options.map(function (o) { return '<option>' + o + '</option>'; }).join('') +
      '</select>';
  } else if (c.type === 'textarea') {
    controlo = '<textarea id="' + id + '" name="' + c.name + '" rows="3"' + placeholder + req + '></textarea>';
  } else {
    var tipo = c.type || 'text';
    var minimo = c.minHoje ? hojeISO() : c.min;  // datas futuras: não aceita dias passados
    var limites = (minimo !== undefined ? ' min="' + minimo + '"' : '') + (c.max !== undefined ? ' max="' + c.max + '"' : '') +
      (c.step ? ' step="' + c.step + '"' : '') +
      (c.pattern ? ' pattern="' + c.pattern + '"' : '') + (c.maxlength ? ' maxlength="' + c.maxlength + '"' : '') +
      (c.inputmode ? ' inputmode="' + c.inputmode + '"' : '') + (c.title ? ' title="' + c.title + '"' : '');
    controlo = '<input type="' + tipo + '" id="' + id + '" name="' + c.name + '"' + limites + placeholder + req + '>';
  }

  return '<div class="form-group' + (c.full ? ' full' : '') + '"' + cond + '>' + label + controlo + '</div>';
}

function valorCampo(form, c) {
  if (c.type === 'checkbox') {
    return Array.prototype.map.call(form.querySelectorAll('input[name="' + c.name + '"]:checked'), function (el) { return el.value; }).join(', ');
  }
  if (c.type === 'radio') {
    var marcado = form.querySelector('input[name="' + c.name + '"]:checked');
    return marcado ? marcado.value : '';
  }
  return form.elements[c.name].value.trim();
}

// Validação do NIF português (dígito de controlo, módulo 11).
function nifValido(nif) {
  if (!/^[0-9]{9}$/.test(nif)) return false;
  var soma = 0;
  for (var i = 0; i < 8; i++) soma += Number(nif[i]) * (9 - i);
  var controlo = 11 - (soma % 11);
  if (controlo >= 10) controlo = 0;
  return controlo === Number(nif[8]);
}

// Data de hoje no formato AAAA-MM-DD (hora local), para o atributo min dos campos de data.
function hojeISO() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
