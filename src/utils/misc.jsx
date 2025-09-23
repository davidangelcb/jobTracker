// Date formatter
const formatDate = (mongoDate) => {
    const now = mongoDate ? new Date(mongoDate) : new Date();
    const time = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const date = now.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });

    const formatted = `${time}-${date}`;

    return formatted;
  };

const  getFormattedDate = () => {
  const now = new Date();

  // Obtener nombre del día
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });

  // Obtener el día del mes
  const day = now.getDate();

  // Función para obtener sufijo (st, nd, rd, th)
  const getOrdinalSuffix = (n) => {
    if (n >= 11 && n <= 13) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

  // Obtener año
  const year = now.getFullYear();

  // Obtener hora en formato de 24h + AM/PM
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";

  // Construir resultado
  return `${weekday}, ${dayWithSuffix}, ${year} - ${hours}:${minutes} ${ampm}`;
};


module.exports = {
  getFormattedDate,
  formatDate
};
  