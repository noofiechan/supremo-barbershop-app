import jsPDF from 'jspdf';
import { Service, Barber } from './types';

// This prevents Next.js from trying to pre-render this logic statically
export const dynamic = 'force-dynamic';

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
  status: string; // Added to verify payment state
}

export function generateReceiptPDF(data: ReceiptData): jsPDF | null {
  // Safety check: Only generate if payment is confirmed
  if (data.status !== 'Completed') {
    console.warn("Attempted to generate receipt for an unpaid/pending transaction.");
    return null;
  }

  // Ensure jsPDF only runs in the browser environment to avoid build crashes
  if (typeof window === 'undefined') return null;

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header - Enhanced Styling
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(30, 30, 30);
  pdf.text('SUPREMO BARBERSHOP', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 8;
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Premium Barbering & Grooming Services', pageWidth / 2, yPosition, {
    align: 'center',
  });

  // Main Separator
  yPosition += 10;
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.5);
  pdf.line(20, yPosition, pageWidth - 20, yPosition);

  yPosition += 12;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);

  // Receipt Details Group
  pdf.text(`Receipt #: ${data.receiptNumber}`, 20, yPosition);
  pdf.text(`Status: ${data.status.toUpperCase()}`, pageWidth - 20, yPosition, { align: 'right' });
  
  yPosition += 7;
  pdf.text(`Date: ${data.date}`, 20, yPosition);
  yPosition += 7;
  pdf.text(`Time: ${data.time}`, 20, yPosition);

  // Customer Section
  if (data.customerName || data.customerEmail) {
    yPosition += 12;
    pdf.setFontSize(10);
    pdf.setTextColor(120, 120, 120);
    pdf.text('CUSTOMER INFORMATION', 20, yPosition);
    yPosition += 6;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    if (data.customerName) {
      pdf.text(`Name: ${data.customerName}`, 25, yPosition);
      yPosition += 5;
    }
    if (data.customerEmail) {
      pdf.text(`Email: ${data.customerEmail}`, 25, yPosition);
      yPosition += 5;
    }
  }

  // Service Breakdown
  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(120, 120, 120);
  pdf.text('SERVICE RENDERED', 20, yPosition);
  yPosition += 6;
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);

  pdf.setFont('helvetica', 'bold');
  pdf.text(`${data.service.service_name}`, 25, yPosition);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`₱ ${data.service.price.toFixed(2)}`, pageWidth - 40, yPosition, { align: 'right' });
  
  yPosition += 5;
  pdf.setFontSize(9);
  pdf.text(`Category: ${data.service.service_category}`, 25, yPosition);
  
  if (data.barber) {
    yPosition += 5;
    pdf.text(`Served by: ${data.barber.barber_fname} ${data.barber.barber_lname}`, 25, yPosition);
  }

  // Financials
  yPosition += 12;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 10;

  const amount = data.amount || data.service.price;
  const discount = data.discount || 0;
  const total = amount - discount;

  pdf.setFontSize(10);
  pdf.text('Subtotal:', 20, yPosition);
  pdf.text(`₱ ${amount.toFixed(2)}`, pageWidth - 40, yPosition, { align: 'right' });
  
  if (discount > 0) {
    yPosition += 6;
    pdf.setTextColor(200, 0, 0);
    pdf.text('Discount:', 20, yPosition);
    pdf.text(`-₱ ${discount.toFixed(2)}`, pageWidth - 40, yPosition, { align: 'right' });
    pdf.setTextColor(0, 0, 0);
  }

  // Final Total
  yPosition += 8;
  pdf.setLineWidth(0.8);
  pdf.line(pageWidth - 80, yPosition, pageWidth - 20, yPosition);
  yPosition += 8;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL PAID:', 20, yPosition);
  pdf.text(`₱ ${total.toFixed(2)}`, pageWidth - 40, yPosition, { align: 'right' });

  // Payment Metadata
  yPosition += 20;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Payment Method: ${data.paymentMethod}`, 20, yPosition);
  if (data.transactionId) {
    yPosition += 5;
    pdf.text(`Transaction ID: ${data.transactionId}`, 20, yPosition);
  }

  // Legal/Footer
  yPosition = pageHeight - 30;
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text('This is an official electronic receipt.', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 4;
  pdf.text('Thank you for choosing Supremo Barbershop!', pageWidth / 2, yPosition, { align: 'center' });

  return pdf;
}

export function downloadReceipt(pdf: jsPDF | null, filename: string): void {
  if (pdf) {
    pdf.save(filename);
  } else {
    console.error("No valid PDF data to download.");
  }
}

export function generateReceiptFilename(receiptNumber: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `Supremo_Receipt_${receiptNumber}_${date}.pdf`;
}