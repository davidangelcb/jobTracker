// Date formatter
export const formatDate = (mongoDate) => {
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


  