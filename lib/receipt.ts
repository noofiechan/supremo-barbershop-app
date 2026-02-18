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
  // 1. Server-Side Guard: Return null if not in browser
  if (typeof window === 'undefined') return null;

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const isCompleted = data.status === 'Completed';
  let yPosition = 20;

  // Header - Adjust Title based on status
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.text('SUPREMO BARBERSHOP', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  // If not completed, call it a "BOOKING SUMMARY" instead of a receipt
  pdf.text(isCompleted ? 'OFFICIAL RECEIPT' : 'BOOKING SUMMARY', pageWidth / 2, yPosition, { align: 'center' });

  // Visual Line
  yPosition += 5;
  pdf.setDrawColor(200);
  pdf.line(20, yPosition, pageWidth - 20, yPosition);

  // Transaction Info
  yPosition += 15;
  pdf.setFontSize(10);
  pdf.text(`Number: ${data.receiptNumber}`, 20, yPosition);
  pdf.text(`Status: ${data.status.toUpperCase()}`, pageWidth - 20, yPosition, { align: 'right' });
  
  yPosition += 7;
  pdf.text(`Date: ${data.date}`, 20, yPosition);
  pdf.text(`Time: ${data.time}`, pageWidth - 20, yPosition, { align: 'right' });

  // Details
  yPosition += 20;
  pdf.setFont('helvetica', 'bold');
  pdf.text('SERVICE DETAILS', 20, yPosition);
  
  yPosition += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${data.service.service_name}`, 20, yPosition);
  pdf.text(`₱ ${data.amount.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });

  if (data.barber) {
    yPosition += 7;
    pdf.setFontSize(9);
    pdf.setTextColor(100);
    pdf.text(`Barber: ${data.barber.barber_fname} ${data.barber.barber_lname}`, 20, yPosition);
  }

  // Total Section
  yPosition += 20;
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.5);
  pdf.line(pageWidth - 80, yPosition, pageWidth - 20, yPosition);
  
  yPosition += 10;
  pdf.setTextColor(0);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL:', 20, yPosition);
  pdf.text(`₱ ${data.amount.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });

  // Footer
  yPosition = pdf.internal.pageSize.getHeight() - 30;
  pdf.setFontSize(8);
  pdf.setTextColor(150);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Thank you for choosing Supremo. Please present this document upon arrival.', pageWidth / 2, yPosition, { align: 'center' });

  return pdf;
}

export function downloadReceipt(pdf: jsPDF, filename: string): void {
  if (typeof window !== 'undefined') {
    pdf.save(filename);
  }
}

export function generateReceiptFilename(receiptNumber: string): string {
  return `Supremo_${receiptNumber}.pdf`;
}