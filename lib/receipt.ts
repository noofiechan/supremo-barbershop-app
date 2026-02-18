import jsPDF from 'jspdf';
import { Payment, GuestTransaction, Reservation, Service, Barber } from './types';

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
}

export function generateReceiptPDF(data: ReceiptData): jsPDF {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(0, 0, 0);
  pdf.text('SUPREMO BARBERSHOP', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Premium Barbering Services', pageWidth / 2, yPosition, {
    align: 'center',
  });

  // Separator line
  yPosition += 8;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, yPosition, pageWidth - 20, yPosition);

  yPosition += 12;
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);

  // Receipt details
  pdf.text(`Receipt #: ${data.receiptNumber}`, 20, yPosition);
  yPosition += 7;
  pdf.text(`Date: ${data.date}`, 20, yPosition);
  yPosition += 7;
  pdf.text(`Time: ${data.time}`, 20, yPosition);

  // Customer info
  if (data.customerName || data.customerEmail) {
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Customer Information', 20, yPosition);
    yPosition += 6;
    pdf.setFontSize(9);
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

  // Service details
  yPosition += 8;
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Service Details', 20, yPosition);
  yPosition += 6;
  pdf.setFontSize(9);
  pdf.setTextColor(0, 0, 0);

  pdf.text(`Service: ${data.service.service_name}`, 25, yPosition);
  yPosition += 5;
  pdf.text(`Category: ${data.service.service_category}`, 25, yPosition);
  yPosition += 5;
  if (data.barber) {
    pdf.text(
      `Barber: ${data.barber.barber_fname} ${data.barber.barber_lname}`,
      25,
      yPosition
    );
    yPosition += 5;
  }

  // Pricing
  yPosition += 8;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  const amount = data.amount || data.service.price;
  const discount = data.discount || 0;
  const subtotal = amount;
  const total = subtotal - discount;

  pdf.text('Amount:', 20, yPosition);
  pdf.text(`₱ ${subtotal.toFixed(2)}`, pageWidth - 40, yPosition, {
    align: 'right',
  });
  yPosition += 6;

  if (discount > 0) {
    pdf.text('Discount:', 20, yPosition);
    pdf.text(`-₱ ${discount.toFixed(2)}`, pageWidth - 40, yPosition, {
      align: 'right',
    });
    yPosition += 6;
  }

  // Total
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
  pdf.text('Total:', 20, yPosition + 5);
  pdf.text(`₱ ${total.toFixed(2)}`, pageWidth - 40, yPosition + 5, {
    align: 'right',
  });

  // Payment method
  yPosition += 15;
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Payment Method: ${data.paymentMethod}`, 20, yPosition);
  if (data.transactionId) {
    yPosition += 5;
    pdf.text(`Transaction ID: ${data.transactionId}`, 20, yPosition);
  }

  // Footer
  yPosition = pageHeight - 25;
  pdf.setFontSize(9);
  pdf.setTextColor(150, 150, 150);
  pdf.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 8;
  pdf.text('Thank you for visiting Supremo Barbershop!', pageWidth / 2, yPosition, {
    align: 'center',
  });
  yPosition += 5;
  pdf.text('We appreciate your business.', pageWidth / 2, yPosition, {
    align: 'center',
  });

  return pdf;
}

export function downloadReceipt(pdf: jsPDF, filename: string): void {
  pdf.save(filename);
}

export function generateReceiptFilename(receiptNumber: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `receipt_${receiptNumber}_${date}.pdf`;
}
