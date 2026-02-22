package com.exam.system.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PdfReaderService {

    public String extractText(MultipartFile file) {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {

            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true); // better text order
            stripper.setLineSeparator("\n"); // keep lines clean

            return stripper.getText(document);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to read PDF", e);
        }
    }
}
