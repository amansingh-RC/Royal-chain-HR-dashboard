// Convert Excel date serial number to readable date format (M/D/YYYY)
export function formatExcelDate(excelDate) {
  if (!excelDate && excelDate !== 0) return '--';
  
  // If already a formatted date string, return as-is
  if (typeof excelDate === 'string' && excelDate.includes('/')) {
    return excelDate;
  }
  
  const num = parseFloat(excelDate);
  if (isNaN(num)) return '--';
  
  // Excel date serial number starts from Jan 1, 1900 = 1
  // JavaScript Date starts from Jan 1, 1970 = 0
  const date = new Date((num - 25569) * 86400 * 1000);
  
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
}

// Convert decimal time (0.395833... = 09:30) to time string (09:30 AM / 07:00 PM)
export function formatTimeFromDecimal(value) {
  if (!value && value !== 0) return '--';
  
  // If it's already a time string (e.g., "09:30 AM"), return as-is
  if (typeof value === 'string' && (value.includes(':') || value === '--')) {
    return value;
  }
  
  const num = parseFloat(value);
  if (isNaN(num)) return '--';
  
  // For decimal values (0-1 range), convert to hours and minutes
  const totalMinutes = Math.round(num * 24 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  // Convert to 12-hour format
  const displayHours = hours % 12 || 12;
  const ampm = hours < 12 ? 'AM' : 'PM';
  
  return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

// Format status - handle both string and numeric values
export function formatStatus(status) {
  if (!status && status !== 0) return '--';
  
  // If already a valid status code, return as-is
  if (typeof status === 'string') {
    return status;
  }
  
  // If numeric, map to status codes
  const statusMap = {
    0: 'DP',
    1: 'PL',
    2: 'WO',
    3: 'PH',
    4: 'ABS',
    5: 'ABS/DP',
    6: 'DP/ABS'
  };
  
  return statusMap[status] || String(status);
}

// Handle both decimal and string time formats
export function normalizeTime(value) {
  return formatTimeFromDecimal(value);
}
