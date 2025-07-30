// import PDFDocument from "pdfkit";
// import QRCode from "qrcode";
// import path from "path";
// import fs from "fs";

// interface TicketData {
//   eventTitle: string;
//   eventDate: Date;
//   eventVenue: string;
//   attendeeName: string;
//   attendeeEmail: string;
//   ticketId: string;
// }

// export async function generateTicketPDF(ticketData: TicketData): Promise<Buffer> {
//   return new Promise<Buffer>(async (resolve, reject) => {
//     try {
//       // Validate input
//       if (!ticketData.eventTitle || !ticketData.eventVenue || !ticketData.attendeeName || !ticketData.attendeeEmail || !ticketData.ticketId) {
//         throw new Error("Missing required ticket data");
//       }
//       if (isNaN(ticketData.eventDate.getTime())) {
//         throw new Error("Invalid event date");
//       }

//       // Load font paths
//       const regularFontPath = path.resolve(process.cwd(), "fonts", "Inter-Regular.ttf");
//       const boldFontPath = path.resolve(process.cwd(), "fonts", "Inter-Bold.ttf");

//       // Log font paths for debugging
//       console.log("Regular font path:", regularFontPath, fs.existsSync(regularFontPath));
//       console.log("Bold font path:", boldFontPath, fs.existsSync(boldFontPath));

//       // Set font variables with fallback
//       const useCustomFont = fs.existsSync(regularFontPath) && fs.existsSync(boldFontPath);

//       const font = useCustomFont ? regularFontPath : "Courier";
//       const boldFont = useCustomFont ? boldFontPath : "Courier-Bold";

//       console.log("Using font:", font);
//       console.log("Using bold font:", boldFont);



//       // Create PDF document
//       const doc = new PDFDocument({
//         size: "A4",
//         margin: 50,
//         info: {
//           Title: `Ticket - ${ticketData.eventTitle}`,
//           Author: "Epoch",
//           Subject: "Event Ticket",
//         },
//         font: false,  // <--- disable default font loading (prevents Helvetica.afm error)
//       });

//       // Set font immediately
//       doc.font(font);

//       const chunks: Buffer[] = [];
//       doc.on("data", (chunk) => chunks.push(chunk));
//       doc.on("end", () => resolve(Buffer.concat(chunks)));
//       doc.on("error", reject);

//       // Header with background
//       doc.rect(0, 0, doc.page.width, 80).fill("#2563eb");
//       doc.fillColor("white").font(boldFont).fontSize(24).text("Epoch Event Ticket", 50, 25, { align: "center" });

//       // Reset color and move down
//       doc.fillColor("black").font(font);
//       doc.y = 120;

//       // Event details box
//       doc.rect(50, 120, 495, 180).fillAndStroke("#f8fafc", "#e2e8f0");
//       doc.font(boldFont).fontSize(18).text(ticketData.eventTitle, 70, 140, { width: 455, align: "center" });

//       doc.font(font).fontSize(12)
//         .text(
//           `Date: ${ticketData.eventDate.toLocaleDateString("en-US", {
//             weekday: "long",
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//           })}`,
//           70,
//           180
//         )
//         .text(`Venue: ${ticketData.eventVenue}`, 70, 200)
//         .text(`Time: Please check event details`, 70, 220);

//       // Attendee details box
//       doc.rect(50, 320, 495, 100).fillAndStroke("#fef3c7", "#f59e0b");
//       doc.fillColor("#92400e").font(boldFont).fontSize(14).text("Attendee Information", 70, 340);

//       doc.font(font).fontSize(11)
//         .text(`Name: ${ticketData.attendeeName}`, 70, 365)
//         .text(`Email: ${ticketData.attendeeEmail}`, 70, 385);

//       // QR Code
//       try {
//         const qrCodeData = JSON.stringify({
//           ticketId: ticketData.ticketId,
//           event: ticketData.eventTitle,
//           attendee: ticketData.attendeeName,
//           date: ticketData.eventDate,
//         });

//         const qrCodeBuffer = await QRCode.toBuffer(qrCodeData, {
//           width: 100,
//           margin: 1,
//           color: {
//             dark: "#000000",
//             light: "#ffffff",
//           },
//         });

//         doc.image(qrCodeBuffer, 450, 450, { width: 100, height: 100 });
//         doc.fillColor("#6b7280").font(font).fontSize(9).text("Scan for verification", 450, 560, { width: 100, align: "center" });
//       } catch (qrError) {
//         console.warn("QR code generation failed:", qrError);
//         doc.fillColor("#6b7280").font(font).fontSize(10)
//           .text(`Ticket ID: ${ticketData.ticketId}`, 450, 500, { width: 100, align: "center" });
//       }

//       // Instructions
//       doc.fillColor("#374151").font(boldFont).fontSize(10).text("Instructions:", 70, 480);
//       doc.font(font).fontSize(9)
//         .text("• Please arrive 15 minutes before the event", 70, 500)
//         .text("• Bring a valid ID for verification", 70, 515)
//         .text("• This ticket is non-transferable", 70, 530);

//       // Footer
//       doc.fillColor("#9ca3af").font(font).fontSize(8)
//         .text("Generated by TechClub Management System", 50, 650, { width: 495, align: "center" })
//         .text(`Generated on: ${new Date().toLocaleString()}`, 50, 665, { width: 495, align: "center" });

//       // Ticket border
//       doc.rect(40, 40, 515, 650).stroke("#2563eb");

//       doc.end();
//     } catch (error) {
//       console.error("PDF generation error:", error);
//       reject(error);
//     }
//   });
// }

import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";

interface TicketData {
  eventTitle: string;
  eventDate: Date;
  eventVenue: string;
  attendeeName: string;
  attendeeEmail: string;
  ticketId: string;
  eventDescription?: string;
  price?: string;
  seatNumber?: string;
  category?: string;
}

export async function generateTicketPDF(ticketData: TicketData): Promise<Buffer> {
  return new Promise<Buffer>(async (resolve, reject) => {
    try {
      // Validate input
      if (!ticketData.eventTitle || !ticketData.eventVenue || !ticketData.attendeeName || !ticketData.attendeeEmail || !ticketData.ticketId) {
        throw new Error("Missing required ticket data");
      }
      if (isNaN(ticketData.eventDate.getTime())) {
        throw new Error("Invalid event date");
      }

      // Load font paths with fallbacks
      const regularFontPath = path.resolve(process.cwd(), "fonts", "Inter-Regular.ttf");
      const boldFontPath = path.resolve(process.cwd(), "fonts", "Inter-Bold.ttf");
      const lightFontPath = path.resolve(process.cwd(), "fonts", "Inter-Light.ttf");

      const useCustomFont = fs.existsSync(regularFontPath) && fs.existsSync(boldFontPath);
      const font = useCustomFont ? regularFontPath : "Helvetica";
      const boldFont = useCustomFont ? boldFontPath : "Helvetica-Bold";
      const lightFont = useCustomFont && fs.existsSync(lightFontPath) ? lightFontPath : font;

      // Create PDF document with better margins
      const doc = new PDFDocument({
        size: [600, 800], // Custom size for better proportions
        margin: 0,
        info: {
          Title: `Event Ticket - ${ticketData.eventTitle}`,
          Author: "Epoch Events",
          Subject: "Event Event Ticket",
          Creator: "Epoch Management System"
        },
        font: false,
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Colors
      const primaryColor = "#1e40af";
      const secondaryColor = "#3b82f6";
      const accentColor = "#f59e0b";
      const lightGray = "#f8fafc";
      const darkGray = "#374151";
      const borderColor = "#e5e7eb";

      // Background gradient effect
      const gradient = doc.linearGradient(0, 0, 600, 200);
      gradient.stop(0, primaryColor).stop(1, secondaryColor);
      doc.rect(0, 0, 600, 200).fill(gradient);

      // Header section with logo area
      doc.fillColor("white")
         .font(boldFont)
         .fontSize(32)
         .text("EPOCH", 50, 40, { align: "left" });
      
      doc.fontSize(14)
         .font(lightFont)
         .text("EVENTS", 50, 75, { align: "left" });

      // Event ticket label
      doc.fontSize(18)
         .font(boldFont)
         .text("EVENT TICKET", 400, 50, { align: "right", width: 150 });

      // Ticket ID in header
      doc.fontSize(12)
         .font(font)
         .text(`#${ticketData.ticketId}`, 400, 75, { align: "right", width: 150 });

      // Main content area with white background
      doc.rect(0, 200, 600, 600).fill("white");

      // Event title section
      doc.fillColor(darkGray)
         .font(boldFont)
         .fontSize(28)
         .text(ticketData.eventTitle, 50, 240, { 
           width: 500, 
           align: "left",
           ellipsis: true
         });

      // Event description if provided
      if (ticketData.eventDescription) {
        doc.fontSize(14)
           .font(font)
           .fillColor("#6b7280")
           .text(ticketData.eventDescription, 50, 285, { 
             width: 500, 
             align: "left" 
           });
      }

      // Date and time section with icon-like styling
      const dateY = ticketData.eventDescription ? 330 : 300;
      
      // Date box
      doc.rect(50, dateY, 200, 80).fill(lightGray).stroke(borderColor);
      doc.fillColor(primaryColor)
         .font(boldFont)
         .fontSize(12)
         .text("DATE & TIME", 60, dateY + 15);

      const formattedDate = ticketData.eventDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      });

      const formattedTime = ticketData.eventDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });

      doc.fillColor(darkGray)
         .font(boldFont)
         .fontSize(16)
         .text(formattedDate, 60, dateY + 35);
      
      doc.font(font)
         .fontSize(14)
         .text(formattedTime, 60, dateY + 55);

      // Venue box
      doc.rect(270, dateY, 200, 80).fill(lightGray).stroke(borderColor);
      doc.fillColor(primaryColor)
         .font(boldFont)
         .fontSize(12)
         .text("VENUE", 280, dateY + 15);

      doc.fillColor(darkGray)
         .font(boldFont)
         .fontSize(14)
         .text(ticketData.eventVenue, 280, dateY + 35, {
           width: 180,
           ellipsis: true
         });

      // Category and price section if provided
      let nextY = dateY + 100;
      if (ticketData.category || ticketData.price || ticketData.seatNumber) {
        const detailsY = nextY;
        let xPos = 50;

        if (ticketData.category) {
          doc.rect(xPos, detailsY, 120, 60).fill("#fef3c7").stroke("#f59e0b");
          doc.fillColor("#92400e")
             .font(boldFont)
             .fontSize(10)
             .text("CATEGORY", xPos + 10, detailsY + 12);
          doc.fontSize(14)
             .text(ticketData.category, xPos + 10, detailsY + 30);
          xPos += 140;
        }

        if (ticketData.price) {
          doc.rect(xPos, detailsY, 120, 60).fill("#dcfce7").stroke("#22c55e");
          doc.fillColor("#15803d")
             .font(boldFont)
             .fontSize(10)
             .text("PRICE", xPos + 10, detailsY + 12);
          doc.fontSize(14)
             .text(ticketData.price, xPos + 10, detailsY + 30);
          xPos += 140;
        }

        if (ticketData.seatNumber) {
          doc.rect(xPos, detailsY, 120, 60).fill("#fce7f3").stroke("#ec4899");
          doc.fillColor("#be185d")
             .font(boldFont)
             .fontSize(10)
             .text("SEAT", xPos + 10, detailsY + 12);
          doc.fontSize(14)
             .text(ticketData.seatNumber, xPos + 10, detailsY + 30);
        }

        nextY = detailsY + 80;
      }

      // Attendee information section with better styling
      const attendeeY = nextY + 20;
      doc.rect(50, attendeeY, 350, 90).fill("#f0f9ff").stroke("#0ea5e9");
      
      doc.fillColor("#0c4a6e")
         .font(boldFont)
         .fontSize(14)
         .text("ATTENDEE INFORMATION", 70, attendeeY + 20);

      doc.fillColor(darkGray)
         .font(font)
         .fontSize(12)
         .text(`Name: ${ticketData.attendeeName}`, 70, attendeeY + 45);
      
      doc.text(`Email: ${ticketData.attendeeEmail}`, 70, attendeeY + 65);

      // QR Code section with better positioning and styling
      const qrY = attendeeY;
      try {
        const qrCodeData = JSON.stringify({
          ticketId: ticketData.ticketId,
          event: ticketData.eventTitle,
          attendee: ticketData.attendeeName,
          email: ticketData.attendeeEmail,
          date: ticketData.eventDate.toISOString(),
          venue: ticketData.eventVenue
        });

        const qrCodeBuffer = await QRCode.toBuffer(qrCodeData, {
          width: 120,
          margin: 2,
          color: {
            dark: "#1e40af",
            light: "#ffffff",
          },
          errorCorrectionLevel: "M"
        });

        // QR Code background
        doc.rect(420, qrY, 130, 130).fill("white").stroke("#e5e7eb");
        doc.image(qrCodeBuffer, 425, qrY + 5, { width: 120, height: 120 });
        
      } catch (qrError) {
        console.warn("QR code generation failed:", qrError);
        doc.rect(420, qrY, 130, 90).fill("#fee2e2").stroke("#ef4444");
        doc.fillColor("#dc2626")
           .font(boldFont)
           .fontSize(10)
           .text("TICKET ID", 430, qrY + 20);
        doc.fontSize(12)
           .text(ticketData.ticketId, 430, qrY + 40, { width: 110, align: "center" });
      }

      // Instructions section with better formatting
      const instructionsY = attendeeY + 110;
      doc.fillColor(primaryColor)
         .font(boldFont)
         .fontSize(14)
         .text("IMPORTANT INSTRUCTIONS", 50, instructionsY);

      const instructions = [
        "• Present this ticket and a valid photo ID at the venue entrance",
        "• Arrive at least 15 minutes before the event start time",
        "• This ticket is non-transferable and non-refundable",
        "• Keep this ticket safe - lost tickets cannot be replaced",
        "• Follow all venue rules and event guidelines"
      ];

      doc.fillColor(darkGray)
         .font(font)
         .fontSize(11);

      instructions.forEach((instruction, index) => {
        doc.text(instruction, 50, instructionsY + 25 + (index * 18), { width: 500 });
      });

      // Footer with perforated line effect
      const footerY = 720;
      
      // Perforated line
      for (let x = 50; x < 550; x += 15) {
        doc.circle(x, footerY, 1).fill("#d1d5db");
      }

      // Footer information
      doc.fillColor("#9ca3af")
         .font(font)
         .fontSize(10)
         .text("Generated by Epoch Management System", 50, footerY + 20, { 
           width: 500, 
           align: "center" 
         });

      doc.text(`Generated: ${new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })}`, 50, footerY + 35, { width: 500, align: "center" });

      // Outer border with rounded corners effect
      doc.rect(10, 10, 580, 780).stroke(primaryColor, 2);
      doc.rect(15, 15, 570, 770).stroke(borderColor, 1);

      // Decorative corner elements
      const cornerSize = 20;
      doc.rect(10, 10, cornerSize, cornerSize).fill(primaryColor);
      doc.rect(570, 10, cornerSize, cornerSize).fill(primaryColor);
      doc.rect(10, 770, cornerSize, cornerSize).fill(primaryColor);
      doc.rect(570, 770, cornerSize, cornerSize).fill(primaryColor);

      doc.end();
    } catch (error) {
      console.error("Enhanced PDF generation error:", error);
      reject(error);
    }
  });
}
