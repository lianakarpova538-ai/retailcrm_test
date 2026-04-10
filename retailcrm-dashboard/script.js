// Supabase configuration — REPLACE WITH YOUR ACTUAL VALUES
const SUPABASE_URL = 'https://qfprfuogtkmihckqsrao.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcHJmdW9ndGttaWhja3FzcmFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjkwNTcsImV4cCI6MjA5MTMwNTA1N30.30PjFApEb3SLzJF7ldD3NWsVSeV6qBWi-xS5X5a8R7Y';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM elements
const totalOrdersEl = document.getElementById('total-orders');
const totalSumEl = document.getElementById('total-sum');
const avgOrderEl = document.getElementById('avg-order');
const tableBody = document.getElementById('table-body');

let chart;

// Fetch and display data
async function loadDashboard() {
  try {
    // Fetch orders from Supabase
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Update stats
    updateStats(orders);
    
    // Update chart
    updateChart(orders);
    
    // Update table
    updateTable(orders);

  } catch (error) {
    console.error('Error loading dashboard:', error);
    tableBody.innerHTML = '<tr><td colspan="6" style="color: red;">Ошибка загрузки данных</td></tr>';
  }
}

function updateStats(orders) {
  const totalOrders = orders.length;
  const totalSum = orders.reduce((sum, order) => sum + (order.total_sum || 0), 0);
  const avgOrder = totalOrders > 0 ? totalSum / totalOrders : 0;

  totalOrdersEl.textContent = totalOrders;
  totalSumEl.textContent = formatMoney(totalSum);
  avgOrderEl.textContent = formatMoney(avgOrder);
}

function updateChart(orders) {
  // Group orders by date
  const ordersByDate = {};
  
  orders.forEach(order => {
    if (!order.created_at) return;
    const date = order.created_at.split('T')[0].split(' ')[0]; // Get YYYY-MM-DD
    ordersByDate[date] = (ordersByDate[date] || 0) + 1;
  });

  // Sort dates
  const sortedDates = Object.keys(ordersByDate).sort();
  const counts = sortedDates.map(date => ordersByDate[date]);

  // Destroy existing chart if any
  if (chart) {
    chart.destroy();
  }

  // Create new chart
  const ctx = document.getElementById('orders-chart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: sortedDates,
      datasets: [{
        label: 'Количество заказов',
        data: counts,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function updateTable(orders) {
  // Show only last 10 orders
  const recentOrders = orders.slice(0, 10);
  
  if (recentOrders.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6">Нет данных</td></tr>';
    return;
  }

  tableBody.innerHTML = recentOrders.map(order => `
    <tr>
      <td>${order.external_id || '—'}</td>
      <td>${order.first_name || ''} ${order.last_name || ''}</td>
      <td>${order.phone || '—'}</td>
      <td>${formatMoney(order.total_sum || 0)}</td>
      <td><span class="status-badge status-default">${order.status || '—'}</span></td>
      <td>${formatDate(order.created_at)}</td>
    </tr>
  `).join('');
}

function formatMoney(amount) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0
  }).format(amount).replace('KZT', '₸');
}

function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}

// Load dashboard on page load
loadDashboard();