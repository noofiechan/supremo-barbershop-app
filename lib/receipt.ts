import jsPDF from 'jspdf';
import { Service, Barber } from './types';

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  time: string;
  service: Service;
  barber?: Barber;
  amount: number;
  discount?: number;
  paymentMethod: string;
  customerName?: string;
  customerEmail?: string;
  transactionId?: string;
  status: string; 
}

export function generateReceiptPDF(data: ReceiptData): jsPDF | null {
  // 1. Critical Build Fix: Prevent execution during Next.js build
  if (typeof window === 'undefined') return null;

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header Styling
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.text('SUPREMO BARBERSHOP', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('APPOINTMENT SUMMARY', pageWidth / 2, yPosition, { align: 'center' });

  // Receipt Content
  yPosition += 20;
  pdf.setFontSize(10);
  pdf.text(`Receipt #: ${data.receiptNumber}`, 20, yPosition);
  pdf.text(`Status: ${data.status.toUpperCase()}`, pageWidth - 20, yPosition, { align: 'right' });
  
  yPosition += 10;
  pdf.text(`Service: ${data.service.service_name}`, 20, yPosition);
  pdf.text(`₱ ${data.amount.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });

  if (data.barber) {
    yPosition += 7;
    pdf.text(`Barber: ${data.barber.barber_fname}`, 20, yPosition);
  }

  yPosition += 20;
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL PAID:', 20, yPosition);
  pdf.text(`₱ ${data.amount.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });

  return pdf;
}

export function downloadReceipt(pdf: jsPDF, filename: string): void {
  // Ensure we are in a browser before trying to trigger a file save
  if (typeof window !== 'undefined') {
    pdf.save(filename);
  }
}

export function generateReceiptFilename(receiptNumber: string): string {
  return `Supremo_Receipt_${receiptNumber}.pdf`;
}