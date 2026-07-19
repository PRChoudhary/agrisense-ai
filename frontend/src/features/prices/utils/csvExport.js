/**
 * Export price data to CSV and trigger browser download
 * @param {object[]} prices - array of price records
 * @param {string} filename
 */
export function exportPricesToCSV(prices, filename = 'agrisense-prices.csv') {
  const headers = ['Crop', 'Hindi Name', 'Mandi', 'State', 'District', 'City', 'Current Price (₹/qt)', 'Min Price', 'Max Price', 'Arrival Qty (qt)', 'Date', 'MSP']
  
  const rows = prices.map(p => [
    p.crop?.name || '',
    p.crop?.nameHindi || '',
    p.mandi?.name || '',
    p.mandi?.state?.name || '',
    p.mandi?.district?.name || '',
    p.mandi?.city || '',
    p.modalPrice,
    p.minPrice,
    p.maxPrice,
    p.arrivalQuantity,
    new Date(p.date).toLocaleDateString('en-IN'),
    p.crop?.mspPrice || '',
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
