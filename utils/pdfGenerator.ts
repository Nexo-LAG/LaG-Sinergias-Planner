

import { Category, Totals, SelectedServiceUI } from '../types';

export const generatePDF = (
  selectedServices: SelectedServiceUI[],
  activeCategories: Category[],
  totals: Totals
) => {
  if (typeof window.jspdf === 'undefined') {
    alert('Error al cargar la librería de PDF.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // --- Header ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('La Grieta', margin, 30);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('Planificador de Sinergias', margin, 36);

  // Date
  const today = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
  doc.text(`Fecha: ${today}`, pageWidth - margin - 40, 30);

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(margin, 45, pageWidth - margin, 45);

  let yPos = 60;

  // --- Content ---
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Servicios Seleccionados', margin, yPos);
  
  yPos += 15;
  
  activeCategories.forEach(cat => {
    // Only print category if it has selected services
    const categoryHasSelection = selectedServices.some(sel => {
        return cat.subcategories.some(sub => sub.services.some(s => s.id === sel.serviceId));
    });

    if (!categoryHasSelection) return;

    // Category Header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(205, 32, 39); // Accent
    doc.text(cat.title.toUpperCase(), margin, yPos);
    yPos += 8;

    // Subcategories
    cat.subcategories.forEach(sub => {
         const subServices = selectedServices.filter(sel => 
             sub.services.some(s => s.id === sel.serviceId)
         );
         
         if (subServices.length === 0) return;

         doc.setFontSize(10);
         doc.setFont('helvetica', 'bold');
         doc.setTextColor(50);
         doc.text(sub.title, margin + 5, yPos);
         yPos += 6;

         subServices.forEach(s => {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0);
            
            // Format: • Service Name (TIER NAME)
            const tierName = s.tierId.toUpperCase();
            doc.text(`• ${s.name}`, margin + 10, yPos);
            
            doc.setFontSize(8);
            doc.setTextColor(120);
            doc.text(`[${tierName}]`, margin + 10 + doc.getTextWidth(`• ${s.name}`) + 2, yPos);

            // Price on right
            doc.setFontSize(10);
            doc.setTextColor(50);
            const priceText = `${s.price} €`;
            doc.text(priceText, pageWidth - margin - doc.getTextWidth(priceText), yPos);
            
            yPos += 6;
         });
         yPos += 4;
    });
    
    yPos += 5;
    
    // Page break check
    if (yPos > 250) {
        doc.addPage();
        yPos = 30;
    }
  });

  // --- Summary Box ---
  yPos += 10;
  if (yPos > 200) {
      doc.addPage();
      yPos = 30;
  }

  // Draw Box
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, pageWidth - (margin * 2), 70); // Taller box
  
  let boxY = yPos + 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('DESGLOSE DE INVERSIÓN', margin + 10, boxY);

  // Subtotal
  boxY += 10;
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', margin + 10, boxY);
  doc.text(`${totals.originalPrice} €`, pageWidth - margin - 30, boxY, { align: 'right' });

  // Synergy Discount
  if (totals.synergyLevel > 0) {
    boxY += 6;
    doc.setTextColor(205, 32, 39);
    doc.text(`Descuento Sinergia (${totals.synergyLevel === 2 ? '15%' : '10%'}):`, margin + 10, boxY);
    doc.text(`-${totals.synergyDiscountAmount} €`, pageWidth - margin - 30, boxY, { align: 'right' });
  }

  // Portfolio Discount
  if (totals.isPortfolioActive) {
      boxY += 6;
      doc.setTextColor(205, 32, 39);
      doc.text(`Descuento Protocolo P0RT4F0L10 (20%):`, margin + 10, boxY);
      doc.text(`-${totals.portfolioDiscountAmount} €`, pageWidth - margin - 30, boxY, { align: 'right' });
  }

  // Line
  boxY += 8;
  doc.setDrawColor(200);
  doc.line(margin + 10, boxY, pageWidth - margin - 10, boxY);

  // Final Total
  boxY += 10;
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL ESTIMADO:', margin + 10, boxY);
  doc.text(`${totals.finalPrice} €`, pageWidth - margin - 30, boxY, { align: 'right' });
  
  // Time
  boxY += 8;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont('helvetica', 'normal');
  const weeks = Math.ceil(totals.minDays / 5);
  const durationText = `Tiempo operativo estimado: ${totals.minDays <= 5 ? totals.minDays + ' días' : weeks + ' semanas'}`;
  doc.text(durationText, margin + 10, boxY);

  // --- Legal / Protocol Footer ---
  yPos += 80;
  doc.setFontSize(8);
  doc.setTextColor(150);
  
  const footerText = [
      'Nota: Estimación orientativa basada en módulos estándar. El presupuesto final se define tras reunión.',
      totals.isPortfolioActive ? 'CLÁUSULA PROTOCOLO P0RT4F0L10: El cliente autoriza a La Grieta a publicar el trabajo resultante en su portafolio web y redes sociales con fines promocionales, a cambio del descuento aplicado del 20%.' : ''
  ];
  
  doc.text(footerText, margin, yPos);

  doc.save('LaGrieta_Planificacion.pdf');
};