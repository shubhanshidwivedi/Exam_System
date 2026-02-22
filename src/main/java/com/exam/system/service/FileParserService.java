package com.exam.system.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileParserService {

    public String extractText(MultipartFile file) {

        try {
            String filename = file.getOriginalFilename().toLowerCase();

            // ---------- PDF ----------
            if (filename.endsWith(".pdf")) {
                try (PDDocument document = PDDocument.load(file.getInputStream())) {

                    PDFTextStripper stripper = new PDFTextStripper();
                    stripper.setSortByPosition(true);
                    stripper.setLineSeparator("\n");

                    return stripper.getText(document);
                }
            }

            // ---------- TXT / Others ----------
            return new String(file.getBytes());

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to extract text from file");
        }
    }
}
