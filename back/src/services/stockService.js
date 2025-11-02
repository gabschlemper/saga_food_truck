/*const stock = require("../models/stock");
const stockAlert = require("../job/stockAlert");

const categoryDays = {
  Perishable: [2, 4, 6],
  Bottled: [5],
  Canned: [5],
  Hygiene: [5],
  Frozen: [5],
  Disposable: [5],
};

const isEvenWeek = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return weekNumber % 2 === 0;
};

const StockService = {
  // Checa se o item precisa de reposição hoje
  async checkRestock(item) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const days = categoryDays[item.category];

    if (!days || !item.autoRestock) return false;
    if (!days.includes(dayOfWeek)) return false;
    if ((item.category === "Hygiene" || item.category === "Disposable") && !isEvenWeek(today)) return false;
    if (item.lastRestockDate && (today - new Date(item.lastRestockDate)) / 86400000 < 1) return false;

    return true;
  },

  // Gera alerta de reposição
  async generateAlert(item, sendEmail, sendWhatsApp) {
    const message = `ALERTA: O item ${item.code} (${item.description}) precisa de reposição!`;

    const alert = await StockAlert.create({ stockId: item.id, message });

    // Envio assíncrono de notificações
    if (sendEmail) sendEmail(item, message, alert);
    if (sendWhatsApp) sendWhatsApp(item, message, alert);

    return alert;
  },

  // Função para processar todos os itens do estoque e gerar alertas
  async processRestock(sendEmail, sendWhatsApp) {
    const stocks = await Stock.findAll();
    const alerts = [];

    for (const item of stocks) {
      const needsRestock = await this.checkRestock(item);
      if (needsRestock) {
        const alert = await this.generateAlert(item, sendEmail, sendWhatsApp);
        alerts.push(alert);
      }
    }

    return alerts;
  },
};

module.exports = stockService;*/

const { Stock } = require("../models/stock");
const StockAlert = require("../job/stockAlert");

// ------------------- Configuração dos dias por categoria -------------------
const categoryDays = {
  Perishable: [2, 4, 6],
  Bottled: [5],
  Canned: [5],
  Hygiene: [5],
  Frozen: [5],
  Disposable: [5],
};

// ------------------- Verifica se a semana é par -------------------
function isEvenWeek(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return weekNumber % 2 === 0;
}

// ------------------- Checa se o item precisa de reposição -------------------
async function checkRestock(item) {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const days = categoryDays[item.category];

    if (!days || !item.autoRestock) return false;
    if (!days.includes(dayOfWeek)) return false;
    if ((item.category === "Hygiene" || item.category === "Disposable") && !isEvenWeek(today)) return false;
    if (item.lastRestockDate && (today - new Date(item.lastRestockDate)) / 86400000 < 1) return false;

    return true;
  } catch (err) {
    console.error("Erro ao verificar necessidade de reposição:", err.message);
    throw err;
  }
}

// ------------------- Gera alerta de reposição -------------------
async function generateAlert(item, sendEmail, sendWhatsApp) {
  try {
    const message = `ALERTA: O item ${item.code} (${item.description}) precisa de reposição!`;
    const alert = await StockAlert.create({ stockId: item.id, message });

    // Envio assíncrono de notificações (sem travar o fluxo principal)
    if (sendEmail) sendEmail(item, message, alert);
    if (sendWhatsApp) sendWhatsApp(item, message, alert);

    return alert;
  } catch (err) {
    console.error("Erro ao gerar alerta de reposição:", err.message);
    throw err;
  }
}

// ------------------- Processa todos os itens e gera alertas -------------------
async function processRestock(sendEmail, sendWhatsApp) {
  try {
    const stocks = await Stock.findAll();
    const alerts = [];

    for (const item of stocks) {
      const needsRestock = await checkRestock(item);
      if (needsRestock) {
        const alert = await generateAlert(item, sendEmail, sendWhatsApp);
        alerts.push(alert);
      }
    }

    return alerts;
  } catch (err) {
    console.error("Erro ao processar reposições automáticas:", err.message);
    throw err;
  }
}

// ------------------- Exportação -------------------
module.exports = {
  checkRestock,
  generateAlert,
  processRestock,
};

