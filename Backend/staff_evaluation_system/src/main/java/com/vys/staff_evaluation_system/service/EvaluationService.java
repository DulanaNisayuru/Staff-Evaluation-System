//
//package com.vys.staff_evaluation_system.service;
//
//import com.vys.staff_evaluation_system.dto.EvaluationResponse;
//import com.vys.staff_evaluation_system.dto.UpdateMemberRequest;
//import com.vys.staff_evaluation_system.entity.*;
//import com.vys.staff_evaluation_system.repository.EvaluationRepository;
//import com.vys.staff_evaluation_system.repository.UserRepository;
//import jakarta.persistence.EntityNotFoundException;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Objects;
//import java.util.Optional;
//import java.util.Set;
//import java.util.stream.Collectors;
//
//@Service
//public class EvaluationService {
//
//    @Autowired
//    private EvaluationRepository evaluationRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//    @Autowired
//    private UserService userService ;
//
//    public int getTotalAssessorsCount() {
//        // Fetch all evaluations
//        List<Evaluation> evaluations = evaluationRepository.findAll();
//
//        // Extract unique assessors from evaluations
//        Set<String> uniqueAssessors = evaluations.stream()
//                .map(Evaluation::getAssessor) // Assuming `getAssessor()` gives the assessor name or ID
//                .filter(Objects::nonNull) // Remove null values
//                .collect(Collectors.toSet());
//
//        // Return the count of unique assessors
//        return uniqueAssessors.size();
//    }
//
//
//
//    public List<Evaluation> getEvaluationsByAssessor(String assessor) {
//        return evaluationRepository.findByAssessor(assessor);
//    }
//
//    public List<String> getMissingAssessors(String period) {
//        // Fetch all evaluations for the given period
//        List<Evaluation> evaluations = evaluationRepository.findByPeriod(period);
//
//        // Get all assessors (users with the MANAGER role)
//        List<User> managers = userRepository.findByRole(Role.MANAGER); // Assuming `Role` enum has a `MANAGER` value
//
//        // Get a list of assessors who have submitted evaluations
//        List<String> assessorsWithEvaluations = evaluations.stream()
//                .filter(evaluation -> evaluation.getDepartments() != null && !evaluation.getDepartments().isEmpty())
//                .map(Evaluation::getAssessor)
//                .collect(Collectors.toList());
//
//        // Find the missing assessors by excluding those who have already submitted evaluations
//        return managers.stream()
//                .map(User::getEmail) // Assuming email is used as a unique identifier
//                .filter(managerEmail -> !assessorsWithEvaluations.contains(managerEmail))
//                .collect(Collectors.toList());
//    }
//
//    public Evaluation saveEvaluation(Evaluation evaluation) {
//        // Perform calculations for department team values
//        for (Department department : evaluation.getDepartments()) {
//            double totalAchievementMarks = 0;
//            double totalMarks = 0;
//
//            // Calculate total achievement marks and total marks for each department member
//            for (UserEvaluation member : department.getMembers()) {
//                member.calculateAverage();
//                totalAchievementMarks += member.getAchievementMarks();
//                totalMarks += member.getTotalMarks();
//            }
//
//            // Calculate team values
//            double averageAchievement = (totalMarks == 0) ? 0 : (totalAchievementMarks / totalMarks) * 100;
//            double averageTeamMark = (department.getMembers().size() == 0) ? 0 : totalAchievementMarks / department.getMembers().size();
//
//            // Create team values object
//            Department.TeamValues teamValues = new Department.TeamValues();
//            teamValues.setTotalMarks((int) totalMarks);
//            teamValues.setAchievementMarks((int) totalAchievementMarks);
//
//            // Set averageAchievement as a double (without '%')
//            teamValues.setFormattedAverageAchievement(String.format("%.2f", averageAchievement) + "%");
//
//            // Set averageTeamMark
//            teamValues.setAverageTeamMark(averageTeamMark);
//
//            // Set calculated team values in the department
//            department.setTeamValues(teamValues);
//        }
//
//        // Save the evaluation object to the database
//        return evaluationRepository.save(evaluation);
//    }
//
//
//    public List<Evaluation> fetchEvaluationByPeriod(String period) {
//        // Log the period format received
//        System.out.println("Fetching evaluations for period: " + period);
//        return evaluationRepository.findByPeriod(period);
//    }
//
//
//    public List<Evaluation> fetchAllEvaluations() {
//        return evaluationRepository.findAll();
//    }
//    // Fetch evaluation by ID
//    public Optional<Evaluation> fetchEvaluationById(String id) {
//        // Fetch a single evaluation by its ID
//        return evaluationRepository.findById(id);
//    }
//    public List<User> getAssessorsWhoDidNotGiveMarks(String period) {
//        // Fetch all evaluations for the period
//        List<Evaluation> evaluations = evaluationRepository.findByPeriod(period);
//        System.out.println("Evaluations for the period: " + evaluations);
//
//        // Extract the assessors who provided evaluations
//        Set<String> evaluatorsEmails = evaluations.stream()
//                .map(Evaluation::getAssessor)
//                .collect(Collectors.toSet());
//        System.out.println("Evaluators who gave marks: " + evaluatorsEmails);
//
//        // Fetch all users with ADMIN or MANAGER roles
//        List<User> eligibleAssessors = userRepository.findByRoleIn(List.of(Role.ADMIN, Role.MANAGER));
//        System.out.println("Eligible assessors (Admins/Managers): " + eligibleAssessors);
//
//        // Filter assessors who have not given marks
//        List<User> assessorsWithoutMarks = eligibleAssessors.stream()
//                .filter(assessor -> !evaluatorsEmails.contains(assessor.getEmail()))
//                .collect(Collectors.toList());
//        System.out.println("Assessors who have not given marks: " + assessorsWithoutMarks);
//
//        return assessorsWithoutMarks;
//    }
//    public Evaluation updateEvaluation(String evaluationId, UpdateMemberRequest request) {
//        if (request.getDep_name() == null || request.getDep_name().isEmpty()) {
//            throw new IllegalArgumentException("Department name cannot be null or empty");
//        }
//
//        Evaluation evaluation = evaluationRepository.findById(evaluationId)
//                .orElseThrow(() -> new EntityNotFoundException("Evaluation with ID " + evaluationId + " not found"));
//
//        Department targetDepartment = evaluation.getDepartments().stream()
//                .filter(department -> department.getDep_name().equals(request.getDep_name()))
//                .findFirst()
//                .orElseThrow(() -> new EntityNotFoundException("Department not found: " + request.getDep_name()));
//
//        UserEvaluation targetMember = targetDepartment.getMembers().stream()
//                .filter(member -> member.getName().equals(request.getMemberName()))
//                .findFirst()
//                .orElseThrow(() -> new EntityNotFoundException("Member not found: " + request.getMemberName()));
//
//        // Perform updates and other logic
//        targetMember.setAchievementMarks(request.getNewAchievementMarks());
//        targetMember.setRemarks(request.getNewRemarks());
//        targetMember.calculateAverage();
//
//        recalculateTeamValues(targetDepartment);
//
//        return evaluationRepository.save(evaluation);
//    }
//
//    private void recalculateTeamValues(Department department) {
//        int totalMarks = 0;
//        int totalAchievementMarks = 0;
//
//        // Iterate through all members in the department
//        for (UserEvaluation member : department.getMembers()) {
//            totalMarks += member.getTotalMarks();
//            totalAchievementMarks += member.getAchievementMarks();
//        }
//
//        // Calculate averages
//        double averageAchievement = (totalMarks == 0) ? 0 : (double) totalAchievementMarks / totalMarks * 100;
//        double averageTeamMark = department.getMembers().isEmpty() ? 0 : (double) totalAchievementMarks / department.getMembers().size();
//
//        // Create a new TeamValues object
//        Department.TeamValues teamValues = new Department.TeamValues();
//        teamValues.setTotalMarks(totalMarks);
//        teamValues.setAchievementMarks(totalAchievementMarks);
//        teamValues.setFormattedAverageAchievement(String.format("%.2f", averageAchievement) + "%");
//        teamValues.setAverageAchievement(averageAchievement);
//        teamValues.setAverageTeamMark(averageTeamMark);
//
//        // Update the department's team values
//        department.setTeamValues(teamValues);
//    }
//    public UserEvaluation getUserEvaluationByEmailAndPeriod(String email, String period) {
//        // Get the user by email using the userService
//        User user = userService.findByEmail(email);
//        if (user != null) {
//            // Get all evaluations
//            List<Evaluation> evaluations = evaluationRepository.findAll();
//
//            // Initialize variables for total achievement marks and remarks
//            int totalAchievementMarks = 0;
//            String remarks = "";
//
//            // Loop through evaluations to find matching user and calculate achievement marks for selected period
//            for (Evaluation evaluation : evaluations) {
//                if (evaluation.getPeriod().equals(period)) { // Ensure the period matches
//                    for (var department : evaluation.getDepartments()) {
//                        for (UserEvaluation member : department.getMembers()) {
//                            if (member.getName().equals(user.getName())) {
//                                // Accumulate the achievement marks for the user
//                                totalAchievementMarks += member.getAchievementMarks();
//                                remarks = member.getRemarks();  // You can combine remarks or handle them as needed
//                            }
//                        }
//                    }
//                }
//            }
//
//            // Set the calculated total achievement marks and remarks in the response object
//            UserEvaluation userEvaluation = new UserEvaluation();
//            userEvaluation.setName(user.getName());
//            userEvaluation.setTotalMarks(10); // Adjust as necessary
//            userEvaluation.setAchievementMarks(totalAchievementMarks);
//            userEvaluation.setAverage(totalAchievementMarks * 10 / 100.0);  // Adjust based on your total scale
//            userEvaluation.setRemarks(remarks);
//
//            return userEvaluation;  // Return the calculated user evaluation
//        }
//
//        return null;  // If no evaluation found for the user
//    }
//    public Department.TeamValues getAggregatedTeamValues(String email, String period) {
//        // Fetch user by email
//        Optional<User> userOptional = userRepository.findByEmail(email);
//
//        if (userOptional.isPresent()) {
//            User user = userOptional.get(); // Unwrap the user
//            String depName = user.getDepName(); // Department name of the user
//
//            // Get all evaluations
//            List<Evaluation> evaluations = evaluationRepository.findAll();
//
//            // Initialize variables for team values aggregation
//            int totalAchievementMarks = 0;
//            int totalMarks = 0;
//            int departmentCount = 0;
//
//            // Loop through evaluations to calculate team values
//            for (Evaluation evaluation : evaluations) {
//                if (evaluation.getPeriod().equals(period)) { // Match the evaluation period
//                    for (Department department : evaluation.getDepartments()) {
//                        if (department.getDep_name().equals(depName)) { // Match the department
//                            Department.TeamValues teamValues = department.getTeamValues();
//                            if (teamValues != null) {
//                                totalAchievementMarks += teamValues.getAchievementMarks();
//                                totalMarks += teamValues.getTotalMarks();
//                                departmentCount++;
//                            }
//                        }
//                    }
//                }
//            }
//
//            // Calculate aggregated team values
//            if (departmentCount > 0) {
//                Department.TeamValues aggregatedValues = new Department.TeamValues();
//                aggregatedValues.setTotalMarks(totalMarks);
//                aggregatedValues.setAchievementMarks(totalAchievementMarks);
//                aggregatedValues.setAverageAchievement((double) totalAchievementMarks / totalMarks * 100);
//                aggregatedValues.setFormattedAverageAchievement(String.format("%.2f%%", (double) totalAchievementMarks / totalMarks * 100));
//                aggregatedValues.setAverageTeamMark((double) totalMarks / departmentCount);
//
//                return aggregatedValues; // Return the aggregated team values
//            }
//        }
//
//        return null; // Return null if no data found
//    }
//
//}

package com.vys.staff_evaluation_system.service;

import com.vys.staff_evaluation_system.dto.EvaluationResponse;
import com.vys.staff_evaluation_system.dto.UpdateMemberRequest;
import com.vys.staff_evaluation_system.entity.*;
import com.vys.staff_evaluation_system.repository.EvaluationRepository;
import com.vys.staff_evaluation_system.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService ;

    public int getTotalAssessorsCount() {
        // Fetch all evaluations
        List<Evaluation> evaluations = evaluationRepository.findAll();

        // Extract unique assessors from evaluations
        Set<String> uniqueAssessors = evaluations.stream()
                .map(Evaluation::getAssessor) // Assuming `getAssessor()` gives the assessor name or ID
                .filter(Objects::nonNull) // Remove null values
                .collect(Collectors.toSet());

        // Return the count of unique assessors
        return uniqueAssessors.size();
    }



    public List<Evaluation> getEvaluationsByAssessor(String assessor) {
        return evaluationRepository.findByAssessor(assessor);
    }

    public List<String> getMissingAssessors(String period) {
        // Fetch all evaluations for the given period
        List<Evaluation> evaluations = evaluationRepository.findByPeriod(period);

        // Get all assessors (users with the MANAGER role)
        List<User> managers = userRepository.findByRole(Role.MANAGER); // Assuming `Role` enum has a `MANAGER` value

        // Get a list of assessors who have submitted evaluations
        List<String> assessorsWithEvaluations = evaluations.stream()
                .filter(evaluation -> evaluation.getDepartments() != null && !evaluation.getDepartments().isEmpty())
                .map(Evaluation::getAssessor)
                .collect(Collectors.toList());

        // Find the missing assessors by excluding those who have already submitted evaluations
        return managers.stream()
                .map(User::getEmail) // Assuming email is used as a unique identifier
                .filter(managerEmail -> !assessorsWithEvaluations.contains(managerEmail))
                .collect(Collectors.toList());
    }

    public Evaluation saveEvaluation(Evaluation evaluation) {
        // Perform calculations for department team values
        for (Department department : evaluation.getDepartments()) {
            double totalAchievementMarks = 0;
            double totalMarks = 0;

            // Calculate total achievement marks and total marks for each department member
            for (UserEvaluation member : department.getMembers()) {
                member.calculateAverage();
                totalAchievementMarks += member.getAchievementMarks();
                totalMarks += member.getTotalMarks();
            }

            // Calculate team values
            double averageAchievement = (totalMarks == 0) ? 0 : (totalAchievementMarks / totalMarks) * 100;
            double averageTeamMark = (department.getMembers().size() == 0) ? 0 : totalAchievementMarks / department.getMembers().size();

            // Create team values object
            Department.TeamValues teamValues = new Department.TeamValues();
            teamValues.setTotalMarks((int) totalMarks);
            teamValues.setAchievementMarks((int) totalAchievementMarks);

            // Set averageAchievement as a double (without '%')
            teamValues.setFormattedAverageAchievement(String.format("%.2f", averageAchievement) + "%");

            // Set averageTeamMark
            teamValues.setAverageTeamMark(averageTeamMark);

            // Set calculated team values in the department
            department.setTeamValues(teamValues);
        }

        // Save the evaluation object to the database
        return evaluationRepository.save(evaluation);
    }


    public List<Evaluation> fetchEvaluationByPeriod(String period) {
        // Log the period format received
        System.out.println("Fetching evaluations for period: " + period);
        return evaluationRepository.findByPeriod(period);
    }


    public List<Evaluation> fetchAllEvaluations() {
        return evaluationRepository.findAll();
    }
    // Fetch evaluation by ID
    public Optional<Evaluation> fetchEvaluationById(String id) {
        // Fetch a single evaluation by its ID
        return evaluationRepository.findById(id);
    }
    public List<User> getAssessorsWhoDidNotGiveMarks(String period) {
        // Fetch all evaluations for the period
        List<Evaluation> evaluations = evaluationRepository.findByPeriod(period);
        System.out.println("Evaluations for the period: " + evaluations);

        // Extract the assessors who provided evaluations
        Set<String> evaluatorsEmails = evaluations.stream()
                .map(Evaluation::getAssessor)
                .collect(Collectors.toSet());
        System.out.println("Evaluators who gave marks: " + evaluatorsEmails);

        // Fetch all users with ADMIN or MANAGER roles
        List<User> eligibleAssessors = userRepository.findByRoleIn(List.of(Role.ADMIN, Role.MANAGER));
        System.out.println("Eligible assessors (Admins/Managers): " + eligibleAssessors);

        // Filter assessors who have not given marks
        List<User> assessorsWithoutMarks = eligibleAssessors.stream()
                .filter(assessor -> !evaluatorsEmails.contains(assessor.getEmail()))
                .collect(Collectors.toList());
        System.out.println("Assessors who have not given marks: " + assessorsWithoutMarks);

        return assessorsWithoutMarks;
    }
    public Evaluation updateEvaluation(String evaluationId, UpdateMemberRequest request) {
        if (request.getDep_name() == null || request.getDep_name().isEmpty()) {
            throw new IllegalArgumentException("Department name cannot be null or empty");
        }

        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new EntityNotFoundException("Evaluation with ID " + evaluationId + " not found"));

        Department targetDepartment = evaluation.getDepartments().stream()
                .filter(department -> department.getDep_name().equals(request.getDep_name()))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Department not found: " + request.getDep_name()));

        UserEvaluation targetMember = targetDepartment.getMembers().stream()
                .filter(member -> member.getName().equals(request.getMemberName()))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Member not found: " + request.getMemberName()));

        // Perform updates and other logic
        targetMember.setAchievementMarks(request.getNewAchievementMarks());
        targetMember.setRemarks(request.getNewRemarks());
        targetMember.calculateAverage();

        recalculateTeamValues(targetDepartment);

        return evaluationRepository.save(evaluation);
    }

    private void recalculateTeamValues(Department department) {
        int totalMarks = 0;
        int totalAchievementMarks = 0;

        // Iterate through all members in the department
        for (UserEvaluation member : department.getMembers()) {
            totalMarks += member.getTotalMarks();
            totalAchievementMarks += member.getAchievementMarks();
        }

        // Calculate averages
        double averageAchievement = (totalMarks == 0) ? 0 : (double) totalAchievementMarks / totalMarks * 100;
        double averageTeamMark = department.getMembers().isEmpty() ? 0 : (double) totalAchievementMarks / department.getMembers().size();

        // Create a new TeamValues object
        Department.TeamValues teamValues = new Department.TeamValues();
        teamValues.setTotalMarks(totalMarks);
        teamValues.setAchievementMarks(totalAchievementMarks);
        teamValues.setFormattedAverageAchievement(String.format("%.2f", averageAchievement) + "%");
        teamValues.setAverageAchievement(averageAchievement);
        teamValues.setAverageTeamMark(averageTeamMark);

        // Update the department's team values
        department.setTeamValues(teamValues);
    }
    public UserEvaluation getUserEvaluationByEmailAndPeriod(String email, String period) {
        // Get the user by email using the userService
        User user = userService.findByEmail(email);
        if (user != null) {
            // Get all evaluations
            List<Evaluation> evaluations = evaluationRepository.findAll();

            // Initialize variables for total achievement marks and remarks
            int totalAchievementMarks = 0;
            String remarks = "";

            // Loop through evaluations to find matching user and calculate achievement marks for selected period
            for (Evaluation evaluation : evaluations) {
                if (evaluation.getPeriod().equals(period)) { // Ensure the period matches
                    for (var department : evaluation.getDepartments()) {
                        for (UserEvaluation member : department.getMembers()) {
                            if (member.getName().equals(user.getName())) {
                                // Accumulate the achievement marks for the user
                                totalAchievementMarks += member.getAchievementMarks();
                                remarks = member.getRemarks();  // You can combine remarks or handle them as needed
                            }
                        }
                    }
                }
            }

            // Set the calculated total achievement marks and remarks in the response object
            UserEvaluation userEvaluation = new UserEvaluation();
            userEvaluation.setName(user.getName());
            userEvaluation.setTotalMarks(10); // Adjust as necessary
            userEvaluation.setAchievementMarks(totalAchievementMarks);
            userEvaluation.setAverage(totalAchievementMarks * 10 / 100.0);  // Adjust based on your total scale
            userEvaluation.setRemarks(remarks);

            return userEvaluation;  // Return the calculated user evaluation
        }

        return null;  // If no evaluation found for the user
    }
    public Department.TeamValues getAggregatedTeamValues(String email, String period) {
        // Fetch user by email
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get(); // Unwrap the user
            String depName = user.getDepName(); // Department name of the user

            // Get all evaluations
            List<Evaluation> evaluations = evaluationRepository.findAll();

            // Initialize variables for team values aggregation
            int totalAchievementMarks = 0;
            int totalMarks = 0;
            int departmentCount = 0;

            // Loop through evaluations to calculate team values
            for (Evaluation evaluation : evaluations) {
                if (evaluation.getPeriod().equals(period)) { // Match the evaluation period
                    for (Department department : evaluation.getDepartments()) {
                        if (department.getDep_name().equals(depName)) { // Match the department
                            Department.TeamValues teamValues = department.getTeamValues();
                            if (teamValues != null) {
                                totalAchievementMarks += teamValues.getAchievementMarks();
                                totalMarks += teamValues.getTotalMarks();
                                departmentCount++;
                            }
                        }
                    }
                }
            }

            // Calculate aggregated team values
            if (departmentCount > 0) {
                Department.TeamValues aggregatedValues = new Department.TeamValues();
                aggregatedValues.setTotalMarks(totalMarks);
                aggregatedValues.setAchievementMarks(totalAchievementMarks);
                aggregatedValues.setAverageAchievement((double) totalAchievementMarks / totalMarks * 100);
                aggregatedValues.setFormattedAverageAchievement(String.format("%.2f%%", (double) totalAchievementMarks / totalMarks * 100));
                aggregatedValues.setAverageTeamMark((double) totalMarks / departmentCount);

                return aggregatedValues; // Return the aggregated team values
            }
        }

        return null; // Return null if no data found
    }

}
