package com.vys.staff_evaluation_system.service;

import com.vys.staff_evaluation_system.dto.MonthlyAssessmentRequest;
import com.vys.staff_evaluation_system.entity.MonthlyAssessment;
import com.vys.staff_evaluation_system.repository.MonthlyAssessmentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class MonthlyAssessmentService {

    @Autowired
    private MonthlyAssessmentRepository repository;

    // Get all assessments
    public List<MonthlyAssessment> getAllAssessments() {
        return repository.findAll();
    }

    // Get an assessment by ID
    public Optional<MonthlyAssessment> getAssessmentById(String id) {
        return repository.findById(id);
    }
    // Method to update the assessment

//
//    public MonthlyAssessment saveAssessment(MonthlyAssessmentRequest request) {
//        // Convert start and end date to LocalDate
//        LocalDate startDate = LocalDate.parse(request.getStartDate());
//        LocalDate endDate = LocalDate.parse(request.getEndDate());
//
//        // Generate the period string
//        String period = MonthlyAssessment.generatePeriod(startDate, endDate);
//
//        // Create the MonthlyAssessment entity
//        MonthlyAssessment assessment = new MonthlyAssessment(
//                period,
//                request.getMonthlyTarget(),
//                request.getAchievedTarget()
//        );
//
//        return repository.save(assessment);
//    }

    public MonthlyAssessment saveAssessment(MonthlyAssessmentRequest request) {
        // Convert start and end date to LocalDate
        LocalDate startDate = LocalDate.parse(request.getStartDate());
        LocalDate endDate = LocalDate.parse(request.getEndDate());

        // Generate the period string
        String period = MonthlyAssessment.generatePeriod(startDate, endDate);

        // Check if achievedTarget is null, if so, set it to 0
        double achievedTarget = (request.getAchievedTarget() != null) ? request.getAchievedTarget() : 0.0;

        // Create the MonthlyAssessment entity with the provided monthlyTarget and default achievedTarget
        MonthlyAssessment assessment = new MonthlyAssessment(
                period,
                request.getMonthlyTarget(),
                achievedTarget
        );

        // Save the assessment to the repository
        return repository.save(assessment);
    }


    // Delete an assessment by ID
    public void deleteAssessmentById(String id) {
        repository.deleteById(id);
    }
    private LocalDate validateAndParseDate(String date, String errorMessage) {
        try {
            return LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        } catch (Exception e) {
            throw new IllegalArgumentException(errorMessage);
        }
    }
    public MonthlyAssessment updateAssessment(String id, MonthlyAssessmentRequest request) {
        // Find the existing assessment by ID
        MonthlyAssessment existingAssessment = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Assessment with ID " + id + " not found"));


        existingAssessment.setMonthlyTarget(request.getMonthlyTarget());
        existingAssessment.setAchievedTarget(request.getAchievedTarget() != null ? request.getAchievedTarget() : 0.0);

        // Update the date to the current date
        existingAssessment.setDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MMM-dd")));

        // Save and return the updated assessment
        return repository.save(existingAssessment);
    }


}
