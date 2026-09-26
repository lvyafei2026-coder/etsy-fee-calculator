function t() { return (window.__i18n && window.__i18n.t) || {}; }

function fmt(n) {
  const sign = n < 0 ? '-' : '';
  return sign + '$' + Math.abs(n).toFixed(2);
}

function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const map = { price:'price', shipping:'shipping', itemCost:'itemCost', shipCost:'shipCost' };
  for (const [key, id] of Object.entries(map)) {
    if (params.has(key)) {
      const el = document.getElementById(id);
      if (el) el.value = params.get(key);
    }
  }
  if (params.has('price') || params.has('shipping') || params.has('itemCost')) {
    calculate();
  }
}

function buildShareUrl() {
  const params = new URLSearchParams();
  const fields = ['price','shipping','itemCost','shipCost'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value) params.set(id, el.value);
  });
  const base = window.location.origin + window.location.pathname;
  return base + '?' + params.toString();
}

function copyShareLink() {
  const url = buildShareUrl();
  navigator.clipboard.writeText(url).then(() => {
    const el = document.getElementById('shareCopied');
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 1800);
  }).catch(() => {
    prompt('Copy this link:', url);
  });
}

function calculate() {
  const tr = t();
  const price = parseFloat(document.getElementById('price').value) || 0;
  const shipping = parseFloat(document.getElementById('shipping').value) || 0;
  const itemCost = parseFloat(document.getElementById('itemCost').value) || 0;
  const shipCost = parseFloat(document.getElementById('shipCost').value) || 0;
  const listingFee = parseFloat(document.getElementById('listingFee').value) || 0;
  const txnPct = parseFloat(document.getElementById('txnPct').value) || 0;
  const payPct = parseFloat(document.getElementById('payPct').value) || 0;
  const payFixed = parseFloat(document.getElementById('payFixed').value) || 0;

  const revenue = price + shipping;
  const txnFee = revenue * (txnPct / 100);
  const payFee = revenue * (payPct / 100) + payFixed;
  const totalFees = listingFee + txnFee + payFee;
  const net = revenue - totalFees - itemCost - shipCost;
  const margin = revenue > 0 ? (net / revenue * 100) : 0;

  const netEl = document.getElementById('netProfit');
  netEl.textContent = fmt(net);
  netEl.classList.toggle('negative', net < 0);

  const marginNote = document.getElementById('marginNote');
  if (net < 0) {
    marginNote.textContent = (tr.marginLoss || 'You are losing money on this sale.') + ' (' + margin.toFixed(1) + '%)';
    marginNote.style.color = '#dc2626';
  } else {
    marginNote.textContent = (tr.marginProfit || 'Profit margin:') + ' ' + margin.toFixed(1) + '%';
    marginNote.style.color = '';
  }

  document.getElementById('bdRevenue').textContent = fmt(revenue);
  document.getElementById('bdListing').textContent = '-' + fmt(listingFee);
  document.getElementById('bdTxn').textContent = '-' + fmt(txnFee);
  document.getElementById('bdPay').textContent = '-' + fmt(payFee);
  document.getElementById('bdTotalFees').textContent = '-' + fmt(totalFees);
  document.getElementById('bdItemCost').textContent = '-' + fmt(itemCost);
  document.getElementById('bdShipCost').textContent = '-' + fmt(shipCost);
  document.getElementById('bdNet').textContent = fmt(net);

  document.getElementById('result').classList.add('show');
}

window.calculate = calculate;
window.copyShareLink = copyShareLink;
window.readUrlParams = readUrlParams;