import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportResultToPDF = async (elementId: string, studentName: string, indexNumber: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found');
    return;
  }

  try {
    // Create a clone to style for PDF
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.backgroundColor = '#ffffff';
    clone.style.color = '#000000';
    clone.style.padding = '20px';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.width = '800px';
    
    // Update colors for print
    const allElements = clone.querySelectorAll('*');
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.color = '#000000';
      htmlEl.style.borderColor = '#333333';
      htmlEl.style.backgroundColor = 'transparent';
    });
    
    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    document.body.removeChild(clone);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add header
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KENYA NATIONAL EXAMINATIONS COUNCIL', 105, 15, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('KCSE RESULT SLIP', 105, 22, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.text(`Student: ${studentName}`, 10, 35);
    pdf.text(`Index No: ${indexNumber}`, 10, 42);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 10, 49);

    // Add line
    pdf.setDrawColor(0);
    pdf.line(10, 55, 200, 55);

    // Add the captured content
    pdf.addImage(imgData, 'PNG', 10, 60, imgWidth, imgHeight);

    // Add footer
    const pageHeight = pdf.internal.pageSize.height;
    pdf.setFontSize(8);
    pdf.setTextColor(128);
    pdf.text('COOL HACKS SECURE SOFTWARE - CONFIDENTIAL DOCUMENT', 105, pageHeight - 10, { align: 'center' });

    // Save the PDF
    pdf.save(`KCSE_Result_${indexNumber.replace('/', '_')}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
