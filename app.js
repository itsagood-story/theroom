'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const controls = ['category', 'fee', 'referral', 'location'];
  const results = $('#results');
  const dialog = $('#detail');
  let communities = [];
  let pathway = 'all';
  let returnFocus = null;
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const safeURL = value => {
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
    catch { return null; }
  };
  const normalize = text => String(text).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function matches(record) {
    const terms = normalize($('#search').value).trim().split(/\s+/).filter(Boolean);
    const searchable = normalize([record.name, record.description, ...record.categories, ...record.notes, record.location, record.fee, record.referral].join(' '));
    return terms.every(term => searchable.includes(term)) &&
      (['all', 'industry'].includes(pathway) || record.pathways.includes(pathway)) &&
      controls.every(key => !$('#' + key).value || (key === 'category' ? record.categories.includes($('#' + key).value) : record[key] === $('#' + key).value));
  }
  function saveState() {
    const url = new URL(location.href);
    ['q', 'path', ...controls].forEach(key => url.searchParams.delete(key));
    if ($('#search').value.trim()) url.searchParams.set('q', $('#search').value.trim());
    if (pathway !== 'all') url.searchParams.set('path', pathway);
    controls.forEach(key => { if ($('#' + key).value) url.searchParams.set(key, $('#' + key).value); });
    history.replaceState(null, '', url);
  }
  function render(updateURL = true) {
    const visible = communities.filter(matches);
    $('#result-count').textContent = `${visible.length} ${visible.length === 1 ? 'community' : 'communities'}${visible.length !== communities.length ? ` of ${communities.length}` : ' to explore'}`;
    results.replaceChildren();
    $('#pathways').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.path === pathway)));
    visible.forEach(record => {
      const article = el('article', 'community');
      const content = el('div');
      content.append(el('div', 'category-line', record.categories.join(' / ')));
      const heading = el('h3');
      const title = el('button', '', record.name);
      title.type = 'button'; title.dataset.room = record.id;
      title.addEventListener('click', () => openDetail(record, title));
      heading.append(title); content.append(heading);
      if (record.description) content.append(el('p', 'description', record.description));
      const meta = el('div', 'meta');
      meta.append(el('span', record.fee === 'Free' ? 'free' : '', record.fee === 'Not specified' ? 'Cost not specified' : record.fee));
      if (record.referral === 'Referral / invite required') meta.append(el('span', '', 'Referral / invite'));
      if (record.location !== 'Not specified') meta.append(el('span', '', record.location));
      content.append(meta);
      if (record.notes.length) {
        const note = el('p', 'gina-note');
        note.append(el('strong', '', 'Gina’s take'), document.createTextNode(record.notes.join(' ')));
        content.append(note);
      }
      const arrow = el('button', 'open-detail', '↗');
      arrow.type = 'button'; arrow.setAttribute('aria-label', `Read about ${record.name}`);
      arrow.addEventListener('click', () => openDetail(record, arrow));
      article.append(content, arrow); results.append(article);
    });
    if (!visible.length) {
      const empty = el('div', 'empty');
      empty.append(el('h3', '', 'Let’s find another connection.'), el('p', '', 'No communities match this combination. Try a different search or clear your filters.'));
      const reset = el('button', 'button', 'Explore every community'); reset.type = 'button'; reset.addEventListener('click', resetFilters);
      empty.append(reset); results.append(empty);
    }
    if (updateURL) saveState();
  }
  function resetFilters() {
    $('#filters').reset(); pathway = 'all'; render();
  }
  function openDetail(record, trigger) {
    returnFocus = trigger || document.activeElement;
    const content = $('#detail-content'); content.replaceChildren();
    content.append(el('p', 'category-line', record.categories.join(' / ')));
    const heading = el('h2', '', record.name); heading.id = 'detail-title'; content.append(heading);
    if (record.description) content.append(el('p', 'detail-description', record.description));
    const take = el('section', 'take');
    take.append(el('div', 'eyebrow', 'Gina’s take'), el('p', '', record.notes.join(' ') || 'Gina hasn’t added a note yet.'));
    content.append(take);
    const list = el('dl');
    const fee = record.fee === 'Needs confirmation' ? 'Needs confirmation — the directory lists both Free and Paid.' : record.fee;
    [['Good for', record.goodFor], ['Location', record.location], ['Cost', fee], ['Access', record.referral]].forEach(([label, value]) => {
      const row = el('div'); row.append(el('dt', '', label), el('dd', '', value)); list.append(row);
    });
    content.append(list);
    const url = safeURL(record.url);
    if (url) {
      const link = el('a', 'button', 'Visit community ↗'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; content.append(link);
    } else content.append(el('p', '', 'A website link hasn’t been added for this community.'));
    content.append(el('p', 'small detail-source', 'From Gina’s collected directory. Confirm current costs and access requirements with the community.'));
    if (!dialog.open) dialog.showModal();
    $('#close-detail').focus();
    const urlState = new URL(location.href); urlState.searchParams.set('room', record.id); history.replaceState(null, '', urlState);
  }
  dialog.addEventListener('close', () => {
    const url = new URL(location.href); url.searchParams.delete('room'); history.replaceState(null, '', url);
    if (returnFocus?.isConnected) returnFocus.focus();
  });
  $('#close-detail').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  $('#filters').addEventListener('submit', event => event.preventDefault());
  $('#search').addEventListener('input', () => render());
  controls.forEach(key => $('#' + key).addEventListener('change', () => render()));
  $('#clear').addEventListener('click', resetFilters);
  $('#pathways').addEventListener('click', event => {
    const button = event.target.closest('button[data-path]');
    if (!button) return;
    pathway = button.dataset.path; render();
    if (pathway === 'industry') $('#category').focus();
  });
  async function load() {
    try {
      const response = await fetch('communities.json');
      if (!response.ok) throw new Error('Data unavailable');
      const data = await response.json();
      if (!Array.isArray(data.communities)) throw new Error('Invalid directory');
      communities = data.communities;
      controls.forEach(key => {
        const values = [...new Set(communities.flatMap(record => key === 'category' ? record.categories : [record[key]]))].sort();
        values.forEach(value => { const option = el('option', '', value); option.value = value; $('#' + key).append(option); });
      });
      const params = new URL(location.href).searchParams;
      $('#search').value = params.get('q') || '';
      if ([...$('#pathways').querySelectorAll('button')].some(button => button.dataset.path === params.get('path'))) pathway = params.get('path');
      controls.forEach(key => { if ([...$('#' + key).options].some(option => option.value === params.get(key))) $('#' + key).value = params.get(key); });
      render(false);
      const record = communities.find(item => item.id === params.get('room'));
      if (record) openDetail(record);
    } catch (error) {
      $('#result-count').textContent = 'The directory couldn’t open.';
      results.replaceChildren(el('p', 'empty error', 'Please reload this page to try again. If you’re viewing a downloaded copy, open it using the local preview instructions in the README.'));
    }
  }
  load();
})();
