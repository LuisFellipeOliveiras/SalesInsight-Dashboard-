const body = document.body;
const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const monthFilter = document.getElementById('monthFilter');
const categoryFilter = document.getElementById('categoryFilter');

const totalSalesEl = document.getElementById('totalSales');
const avgSalesEl = document.getElementById('avgSales');
const maxSaleEl = document.getElementById('maxSale');

const salesBarChartCtx = document.getElementById('salesBarChart').getContext('2d');
const salesPieChartCtx = document.getElementById('salesPieChart').getContext('2d');

let salesBarChart, salesPieChart;

// Dados fake, você pode conectar a API ou banco real depois
const salesData = [
  { date: '2025-01-05', category: 'Eletrônicos', product: 'Smartphone', region: 'Sul', amount: 5000 },
  { date: '2025-01-15', category: 'Eletrônicos', product: 'Notebook', region: 'Sudeste', amount: 8000 },
  { date: '2025-02-10', category: 'Vestuário', product: 'Jaqueta', region: 'Nordeste', amount: 1500 },
  { date: '2025-02-12', category: 'Vestuário', product: 'Tênis', region: 'Sudeste', amount: 1200 },
  { date: '2025-03-01', category: 'Alimentos', product: 'Café', region: 'Sul', amount: 300 },
  { date: '2025-03-15', category: 'Alimentos', product: 'Chocolate', region: 'Nordeste', amount: 400 },
  { date: '2025-01-20', category: 'Eletrônicos', product: 'Tablet', region: 'Norte', amount: 2500 },
  { date: '2025-03-20', category: 'Vestuário', product: 'Camisa', region: 'Sul', amount: 900 },
];

// Função para filtrar dados
function filterSales(month, category) {
  return salesData.filter(sale => {
    const matchMonth = month === 'all' || sale.date.startsWith(month);
    const matchCategory = category === 'all' || sale.category === category;
    return matchMonth && matchCategory;
  });
}

// Função para calcular resumo
function calculateSummary(data) {
  const total = data.reduce((acc, cur) => acc + cur.amount, 0);
  const days = new Set(data.map(sale => sale.date)).size || 1;
  const max = data.reduce((acc, cur) => (cur.amount > acc ? cur.amount : acc), 0);
  return { total, avg: (total / days).toFixed(2), max };
}

// Função para atualizar gráfico de barras (vendas por produto)
function updateBarChart(data) {
  const salesByProduct = {};
  data.forEach(sale => {
    salesByProduct[sale.product] = (salesByProduct[sale.product] || 0) + sale.amount;
  });

  const labels = Object.keys(salesByProduct);
  const values = Object.values(salesByProduct);

  if (salesBarChart) salesBarChart.destroy();

  salesBarChart = new Chart(salesBarChartCtx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Vendas por Produto (R$)',
        data: values,
        backgroundColor: '#007acc',
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Função para atualizar gráfico de pizza (vendas por região)
function updatePieChart(data) {
  const salesByRegion = {};
  data.forEach(sale => {
    salesByRegion[sale.region] = (salesByRegion[sale.region] || 0) + sale.amount;
  });

  const labels = Object.keys(salesByRegion);
  const values = Object.values(salesByRegion);

  if (salesPieChart) salesPieChart.destroy();

  salesPieChart = new Chart(salesPieChartCtx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: 'Vendas por Região',
        data: values,
        backgroundColor: ['#007acc', '#00b894', '#fdcb6e', '#d63031', '#6c5ce7'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right' }
      }
    }
  });
}

// Função principal de atualização
function updateDashboard() {
  const filteredData = filterSales(monthFilter.value, categoryFilter.value);
  const summary = calculateSummary(filteredData);

  totalSalesEl.textContent = `R$ ${summary.total.toLocaleString('pt-BR')}`;
  avgSalesEl.textContent = `R$ ${summary.avg.toLocaleString('pt-BR')}`;
  maxSaleEl.textContent = `R$ ${summary.max.toLocaleString('pt-BR')}`;

  updateBarChart(filteredData);
  updatePieChart(filteredData);
}

// Dark mode toggle
toggleThemeBtn.onclick = () => {
  body.classList.toggle('dark');
  toggleThemeBtn.textContent = body.classList.contains('dark') ? 'Modo Light' : 'Modo Dark';
};

monthFilter.onchange = updateDashboard;
categoryFilter.onchange = updateDashboard;

// Inicializa o dashboard
updateDashboard();
