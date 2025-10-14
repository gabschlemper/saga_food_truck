const cron = require("node-cron"); // Importa a biblioteca para agendar tarefas
const Stock = require("../Models/Stock"); // Modelo de estoque
const StockAlert = require("../Models/StockAlert"); // Modelo de alertas de estoque

// Mapeia as categorias para os dias da semana em que devem ser checadas
// 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
const categoryDays = {
  Perishable: [2, 4, 6], // Perecíveis: terça, quinta, sábado
  Frozen: [3], // Congelados: quarta
  Canned: [5], // Enlatados: sexta
  Bottled: [5], // Engarrafados: sexta
  Hygiene: [4], // Higiene: quinta (verificar semana par)
  Disposable: [4], // Descartáveis: quinta (verificar semana par)
};

// Função para verificar se a semana é par (útil para categorias quinzenais)
const isEvenWeek = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1); // 1º dia do ano
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000; // dias passados
  const weekNumber = Math.ceil(
    (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
  ); // número da semana
  return weekNumber % 2 === 0; // retorna true se a semana é par
};

// Agendamento do cron job: "0 8 * * *" → todo dia às 8h
cron.schedule("0 8 * * *", async () => {
  const today = new Date(); // data atual
  const dayOfWeek = today.getDay(); // dia da semana (0 = domingo)

  // Busca todos os itens do estoque
  const stocks = await Stock.findAll();

  // Itera sobre cada item do estoque
  for (const item of stocks) {
    const days = categoryDays[item.category]; // pega os dias configurados para a categoria

    // Se não houver regra de dias ou reposição automática estiver desativada, pula o item
    if (!days || !item.autoRestock) continue;

    // Se hoje não for um dos dias da semana para esta categoria, pula o item
    if (!days.includes(dayOfWeek)) continue;

    // Para categorias quinzenais (Hygiene/Disposable), só processa se for semana par
    if (
      (item.category === "Hygiene" || item.category === "Disposable") &&
      !isEvenWeek(today)
    )
      continue;

    // Verifica intervalo mínimo de 1 dia desde a última reposição
    if (
      item.lastRestockDate &&
      (today - new Date(item.lastRestockDate)) / 86400000 < 1
    )
      continue;

    // Mensagem do alerta
    const message = `ALERTA: O item ${item.code} (${item.description}) precisa de reposição!`;

    // Salva o alerta no banco de dados
    const alert = await StockAlert.create({ stockId: item.id, message });

    // Envia e-mail (assíncrono)
    sendEmailAlert("estoque@empresa.com", "Alerta de Estoque", message)
      .then(() => alert.update({ sentEmail: true })) // marca como enviado
      .catch(console.error);

    // Envia WhatsApp (assíncrono)
    sendWhatsAppAlert("+5511999999999", message)
      .then(() => alert.update({ sentWhatsApp: true })) // marca como enviado
      .catch(console.error);
  }
});
