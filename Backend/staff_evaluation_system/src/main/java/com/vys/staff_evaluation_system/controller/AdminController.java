//package com.vys.staff_evaluation_system.controller;
//
//import com.vys.staff_evaluation_system.auth.AuthenticationResponse;
//import com.vys.staff_evaluation_system.auth.AuthenticationService;
//import com.vys.staff_evaluation_system.auth.RegisterRequest;
//import com.vys.staff_evaluation_system.dto.EvaluationResponse;
//import com.vys.staff_evaluation_system.dto.MonthlyAssessmentRequest;
//import com.vys.staff_evaluation_system.dto.UpdateMemberRequest;
//import com.vys.staff_evaluation_system.dto.UserProfileResponse;
//import com.vys.staff_evaluation_system.entity.*;
//import com.vys.staff_evaluation_system.repository.UserRepository;
//import com.vys.staff_evaluation_system.service.DepartmentService;
//import com.vys.staff_evaluation_system.service.EvaluationService;
//import com.vys.staff_evaluation_system.service.MonthlyAssessmentService;
//import com.vys.staff_evaluation_system.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.net.URLDecoder;
//import java.nio.charset.StandardCharsets;
//import java.security.Principal;
//import java.time.LocalDate;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
////
////@RestController
////@RequestMapping("/api/v1/admin") // Grouping the endpoints under /api/v1/admin
////public class AdminController {
////
////    @Autowired
////    private DepartmentService departmentService;
////
////    @Autowired
////    private MonthlyAssessmentService monthlyAssessmentService;
////
////    @Autowired
////    private EvaluationService evaluationService;
////
////    @Autowired
////    private UserService userService;
////
////    // Only accessible by ADMIN role
////    @PreAuthorize("hasRole('ADMIN')")
////    @PostMapping("/departments") // Endpoint to create department
////    public Department createDepartment(@RequestBody Department department) {
////        return departmentService.saveDepartment(department);
////    }
////
////    @GetMapping("/departments")
////    public List<Department> getAllDepartments() {
////        return departmentService.getAllDepartments();
////    }
////
////    @GetMapping("/profile")
////    public ResponseEntity<UserProfileResponse> getUserProfile(Principal principal) {
////        // Fetch the authenticated user using the principal
////        User user = userService.findByEmail(principal.getName());
////
////        // If user is found, return the profile data
////        if (user != null) {
////            // Create the UserProfileResponse DTO and map the user data
////            // Use dep_name field here
////            UserProfileResponse profile = new UserProfileResponse(
////                    user.getId(),
////                    user.getName(),
////                    user.getEmail(),
////                    user.getRole(),
////                    user.getDepName()  // Return the dep_name directly
////            );
////            return ResponseEntity.ok(profile);
////        } else {
////            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
////        }
////    }
////
////    @GetMapping("/user")
////    public List<User> getAllUsers() {
////        return userService.getAllUsers();
////    }
////
////    @GetMapping("user/{id}")
////    public ResponseEntity<User> getUserById(@PathVariable String id) {
////        User user = userService.getUserById(id);
////        return ResponseEntity.ok(user);
////    }
////
////
////
////// Get all assessments - Admin-only
////@PreAuthorize("hasRole('ADMIN')")
////@GetMapping("/assessment")
////public ResponseEntity<List<MonthlyAssessment>> getAllAssessments() {
////    return ResponseEntity.ok(monthlyAssessmentService.getAllAssessments());
////}
////
////// Get an assessment by ID - Admin-only
////@PreAuthorize("hasRole('ADMIN')")
////@GetMapping("assessment/{id}")
////public ResponseEntity<MonthlyAssessment> getAssessmentById(@PathVariable String id) {
////    Optional<MonthlyAssessment> assessment = monthlyAssessmentService.getAssessmentById(id);
////    return assessment.map(ResponseEntity::ok)
////            .orElseGet(() -> ResponseEntity.notFound().build());
////}
////
////// Create a new assessment - Admin-only
////@PreAuthorize("hasRole('ADMIN')")
////@PostMapping("/assessment")
////
////public ResponseEntity<?> createAssessment(@RequestBody MonthlyAssessmentRequest request) {
////    try {
////        MonthlyAssessment savedAssessment = monthlyAssessmentService.saveAssessment(request);
////        return ResponseEntity.status(HttpStatus.CREATED).body(savedAssessment);
////    } catch (Exception e) {
////        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error saving assessment");
////    }
////}
////
////
////
////// Delete an assessment - Admin-only
////@PreAuthorize("hasRole('ADMIN')")
////@DeleteMapping("assessment/{id}")
////public ResponseEntity<Void> deleteAssessment(@PathVariable String id) {
////    Optional<MonthlyAssessment> existingAssessment = monthlyAssessmentService.getAssessmentById(id);
////
////    if (existingAssessment.isPresent()) {
////        monthlyAssessmentService.deleteAssessmentById(id);
////        return ResponseEntity.noContent().build();
////    } else {
////        return ResponseEntity.notFound().build();
////    }
////}
////
////
////
////
////
////@PostMapping("/evaluation")
////public Evaluation addEvaluation(@RequestBody Evaluation evaluation, Principal principal) {
////    // Set logged-in manager's name as the assessor
////    evaluation.setAssessor(principal.getName());
////
////    // Save the evaluation and update department team values
////    return evaluationService.saveEvaluation(evaluation);
////}
////
////
////
////
////    }
////
//@RestController
//@RequestMapping("/api/v1/admin") // Grouping the endpoints under /api/v1/admin
//public class AdminController {
//
//    @Autowired
//    private DepartmentService departmentService;
//
//    @Autowired
//    private MonthlyAssessmentService monthlyAssessmentService;
//
//    @Autowired
//    private EvaluationService evaluationService;
//
//    @Autowired
//    private UserService userService;
//
//    @Autowired
//    private AuthenticationService service;
//
//    // Registration endpoint
//    @PostMapping("/register")
//    public ResponseEntity<AuthenticationResponse> register(
//            @RequestBody RegisterRequest request
//    ) {
//        return ResponseEntity.ok(service.register(request));
//    }
//
//    // Only accessible by ADMIN role
//    @PreAuthorize("hasRole('ADMIN') OR hasRole('MANAGER')")
//    @PostMapping("/departments") // Endpoint to create department
//    public Department createDepartment(@RequestBody Department department) {
//        return departmentService.saveDepartment(department);
//    }
//
//    @PreAuthorize("hasRole('ADMIN') OR hasRole('MANAGER')")
//    @GetMapping("/department-users")
//    public Map<String, List<UserProfileResponse>> getDepartmentUsers() {
//        return userService.getUsersCategorizedByDepartment();
//    }
//
//
//    @GetMapping("/departments")
//    public List<Department> getAllDepartments() {
//        return departmentService.getAllDepartments();
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/profile")
//    public ResponseEntity<UserProfileResponse> getUserProfile(Principal principal) {
//        // Fetch the authenticated user using the principal
//        User user = userService.findByEmail(principal.getName());
//
//        // If user is found, return the profile data
//        if (user != null) {
//            UserProfileResponse profile = new UserProfileResponse(
//                    user.getId(),
//                    user.getName(),
//                    user.getEmail(),
//                    user.getRole(),
//                    user.getDepName()  // Return the dep_name directly
//            );
//            return ResponseEntity.ok(profile);
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//        }
//    }
//
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/user")
//    public List<User> getAllUsers() {
//        return userService.getAllUsers();
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("user/{id}")
//    public ResponseEntity<User> getUserById(@PathVariable String id) {
//        User user = userService.getUserById(id);
//        return ResponseEntity.ok(user);
//    }
//
//    @GetMapping("/assessors")
//    public ResponseEntity<List<User>> getAssessors() {
//        List<User> assessors = userService.getAssessors();
//        return ResponseEntity.ok(assessors);
//    }
//
//    // Update user details - Admin only
//    @PreAuthorize("hasRole('ADMIN')")
//    @PutMapping("/user/{id}")
//    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
//        User updated = userService.updateUser(id, updatedUser);
//        return ResponseEntity.ok(updated);
//    }
//
//    @Autowired
//    private UserRepository userRepository; // Inject UserRepository
//
//
//    // Get all assessments - Admin-only
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/assessment")
//    public ResponseEntity<List<MonthlyAssessment>> getAllAssessments() {
//        return ResponseEntity.ok(monthlyAssessmentService.getAllAssessments());
//    }
//
//    // Get an assessment by ID - Admin-only
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("assessment/{id}")
//    public ResponseEntity<MonthlyAssessment> getAssessmentById(@PathVariable String id) {
//        Optional<MonthlyAssessment> assessment = monthlyAssessmentService.getAssessmentById(id);
//        return assessment.map(ResponseEntity::ok)
//                .orElseGet(() -> ResponseEntity.notFound().build());
//    }
//
//    // Create a new assessment - Admin-only
//    @PreAuthorize("hasRole('ADMIN')")
//    @PostMapping("/assessment")
//    public ResponseEntity<?> createAssessment(@RequestBody MonthlyAssessmentRequest request) {
//        try {
//            MonthlyAssessment savedAssessment = monthlyAssessmentService.saveAssessment(request);
//            return ResponseEntity.status(HttpStatus.CREATED).body(savedAssessment);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error saving assessment");
//        }
//    }
//
//    // Delete an assessment - Admin-only
//    @PreAuthorize("hasRole('ADMIN')")
//    @DeleteMapping("assessment/{id}")
//    public ResponseEntity<Void> deleteAssessment(@PathVariable String id) {
//        Optional<MonthlyAssessment> existingAssessment = monthlyAssessmentService.getAssessmentById(id);
//
//        if (existingAssessment.isPresent()) {
//            monthlyAssessmentService.deleteAssessmentById(id);
//            return ResponseEntity.noContent().build();
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//    @PutMapping("/assessment/{id}")
//    public ResponseEntity<MonthlyAssessment> updateAssessment(
//            @PathVariable String id, @RequestBody MonthlyAssessmentRequest request) {
//
//        MonthlyAssessment updatedAssessment = monthlyAssessmentService.updateAssessment(id, request);
//
//        if (updatedAssessment != null) {
//            return ResponseEntity.ok(updatedAssessment); // Return updated assessment
//        } else {
//            return ResponseEntity.notFound().build(); // If assessment is not found
//        }
//    }
//
//    // Add a new evaluation
////    @PostMapping("/evaluation")
////    public Evaluation addEvaluation(@RequestBody Evaluation evaluation, Principal principal) {
////        evaluation.setAssessor(principal.getName()); // Set logged-in manager's name as the assessor
////        return evaluationService.saveEvaluation(evaluation);
////    }
//
//    @PostMapping("/evaluation")
//    public Evaluation addEvaluation(@RequestBody Evaluation evaluation, Principal principal) {
//        // Set the assessor (manager) for the evaluation
//        evaluation.setAssessor(principal.getName());
//
//        // Calculate the average for each user's evaluation
//        evaluation.getDepartments().forEach(department -> {
//            department.getMembers().forEach(userEvaluation -> {
//                userEvaluation.calculateAverage();
//            });
//        });
//
//        // Save the evaluation and return the saved entity
//        return evaluationService.saveEvaluation(evaluation);
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/evaluations")
//    public ResponseEntity<List<Evaluation>> getAllEvaluations() {
//        List<Evaluation> evaluations = evaluationService.fetchAllEvaluations();
//        return ResponseEntity.ok(evaluations);
//
//    }
////    @GetMapping("/missing-assessors")
////    public List<String> getMissingAssessors(@RequestParam String period) {
////        // Fetch all assessors for the selected period
////        List<String> allAssessors = evaluationService.getAllAssessorsForPeriod(period);
////
////        // Get the list of missing assessors (those who haven't submitted evaluations)
////        return evaluationService.getMissingAssessors(allAssessors, period);
////    }
//
//
////    @GetMapping("/evaluation/{id}")
////    public ResponseEntity<Evaluation> getEvaluationById(@PathVariable String id) {
////        return evaluationService.fetchEvaluationById(id)
////                .map(ResponseEntity::ok)
////                .orElseGet(() -> ResponseEntity.notFound().build());
////    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/evaluation/{period}")
//    public ResponseEntity<List<Evaluation>> getEvaluationByPeriod(@PathVariable String period) {
//        // Example of decoding the period if needed
//        String decodedPeriod = URLDecoder.decode(period, StandardCharsets.UTF_8);
//        List<Evaluation> evaluations = evaluationService.fetchEvaluationByPeriod(decodedPeriod);
//        if (evaluations.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        } else {
//            return ResponseEntity.ok(evaluations);
//        }
//    }
//    @PutMapping("/{evaluationId}")
//    public ResponseEntity<Evaluation> updateEvaluation(
//            @PathVariable String evaluationId,
//            @RequestBody UpdateMemberRequest request
//    ) {
//        Evaluation updatedEvaluation = evaluationService.updateEvaluation(evaluationId, request);
//        return ResponseEntity.ok(updatedEvaluation);
//    }
//    @GetMapping("/evaluations/assessor/{assessor}")
//    public List<Evaluation> getEvaluationsByAssessor(@PathVariable String assessor) {
//        return evaluationService.getEvaluationsByAssessor(assessor);
//    }
//
//    @GetMapping("/evaluation-report")
//    public ResponseEntity<String> generateEvaluationReport(@RequestParam String period) {
//        // Fetch evaluations by period using the service
//        List<Evaluation> evaluations = evaluationService.fetchEvaluationByPeriod(period);
//
//        if (evaluations.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No evaluations found for the given period.");
//        }
//
//        // Start building the report
//        StringBuilder report = new StringBuilder();
//        report.append("Personal Assessment Report\n")
//                .append("Date: ").append(LocalDate.now()).append("\n")
//                .append("Assessor: ").append(evaluations.get(0).getAssessor()).append("\n");
//                //.append("Period: ").append(period).append("\n\n");
//
//        // Loop through each evaluation and its departments
//        for (Evaluation evaluation : evaluations) {
//            for (Department department : evaluation.getDepartments()) {
//                report.append("Department: ").append(department.getDep_name()).append("\n");
//
//                // Loop through each member in the department
//                for (UserEvaluation member : department.getMembers()) {
//                    report.append("Person: ").append(member.getName()).append("\n")
//                            .append("Total Marks: ").append(member.getTotalMarks()).append("\n")
//                            .append("Achievement Marks: ").append(member.getAchievementMarks()).append("\n")
//                            // .append("Average Team Achievement: ").append(member.getAverageAchievement()).append("\n")
//                            .append("Average Team Mark: ").append(department.getTeamValues().getAverageTeamMark()).append("\n")
//                            .append("Remarks: ").append(member.getRemarks()).append("\n");
//                }
//
//                Department.TeamValues teamValues = department.getTeamValues();
//                report.append("Team Values:\n")
//                        .append("Total Marks: ").append(teamValues.getTotalMarks()).append("\n")
//                        .append("Achievement Marks: ").append(teamValues.getAchievementMarks()).append("\n")
//                        .append("Average Achievement: ").append(teamValues.getFormattedAverageAchievement()).append("\n") // Use formatted method
//                        .append("Average Team Mark: ").append(teamValues.getAverageTeamMark()).append("\n\n");
//            }
//        }
//
//        // Return the generated report after looping through all evaluations and departments
//        return ResponseEntity.ok(report.toString());
//    }
//    @GetMapping("/assessors/count")
//    public ResponseEntity<Integer> getAllAssessorsCount() {
//        int count = evaluationService.getTotalAssessorsCount();
//        return ResponseEntity.ok(count);
//    }
//    @GetMapping("/missing-assessors")
//    public ResponseEntity<?> getMissingAssessors(@RequestParam(required = false) String period) {
//        if (period == null || period.isEmpty()) {
//            return ResponseEntity.badRequest().body("Error: The 'period' parameter is required.");
//        }
//
//        try {
//            List<User> missingAssessors = evaluationService.getAssessorsWhoDidNotGiveMarks(period);
//
//            if (missingAssessors.isEmpty()) {
//                return ResponseEntity.ok("No assessors are missing for the given period.");
//            }
//
//            return ResponseEntity.ok(missingAssessors);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("An unexpected error occurred: " + e.getMessage());
//        }
//    }
//}

package com.vys.staff_evaluation_system.controller;

import com.vys.staff_evaluation_system.auth.AuthenticationResponse;
import com.vys.staff_evaluation_system.auth.AuthenticationService;
import com.vys.staff_evaluation_system.auth.RegisterRequest;
import com.vys.staff_evaluation_system.dto.EvaluationResponse;
import com.vys.staff_evaluation_system.dto.MonthlyAssessmentRequest;
import com.vys.staff_evaluation_system.dto.UpdateMemberRequest;
import com.vys.staff_evaluation_system.dto.UserProfileResponse;
import com.vys.staff_evaluation_system.entity.*;
import com.vys.staff_evaluation_system.repository.UserRepository;
import com.vys.staff_evaluation_system.service.DepartmentService;
import com.vys.staff_evaluation_system.service.EvaluationService;
import com.vys.staff_evaluation_system.service.MonthlyAssessmentService;
import com.vys.staff_evaluation_system.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin") // Grouping the endpoints under /api/v1/admin
public class AdminController {

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private MonthlyAssessmentService monthlyAssessmentService;

    @Autowired
    private EvaluationService evaluationService;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationService service;

    // Registration endpoint
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    // Only accessible by ADMIN role
    @PreAuthorize("hasRole('ADMIN') OR hasRole('MANAGER')")
    @PostMapping("/departments") // Endpoint to create department
    public Department createDepartment(@RequestBody Department department) {
        return departmentService.saveDepartment(department);
    }

    @PreAuthorize("hasRole('ADMIN') OR hasRole('MANAGER')")
    @GetMapping("/department-users")
    public Map<String, List<UserProfileResponse>> getDepartmentUsers() {
        return userService.getUsersCategorizedByDepartment();
    }


    @GetMapping("/departments")
    public List<Department> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(Principal principal) {
        // Fetch the authenticated user using the principal
        User user = userService.findByEmail(principal.getName());

        // If user is found, return the profile data
        if (user != null) {
            UserProfileResponse profile = new UserProfileResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole(),
                    user.getDepName()  // Return the dep_name directly
            );
            return ResponseEntity.ok(profile);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/assessors")
    public ResponseEntity<List<User>> getAssessors() {
        List<User> assessors = userService.getAssessors();
        return ResponseEntity.ok(assessors);
    }
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    // Update user details - Admin only
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable String userId, @RequestBody User updatedUser) {
        try {
            User updated = userService.updateUser(userId, updatedUser);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error updating user with ID: {}. Error: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(500).body(null); // Internal Server Error response
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build(); // Return 204 No Content if successful
        } catch (Exception e) {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if the user doesn't exist
        }
    }

    @Autowired
    private UserRepository userRepository; // Inject UserRepository


    // Get all assessments - Admin-only
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/assessment")
    public ResponseEntity<List<MonthlyAssessment>> getAllAssessments() {
        return ResponseEntity.ok(monthlyAssessmentService.getAllAssessments());
    }

    // Get an assessment by ID - Admin-only
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("assessment/{id}")
    public ResponseEntity<MonthlyAssessment> getAssessmentById(@PathVariable String id) {
        Optional<MonthlyAssessment> assessment = monthlyAssessmentService.getAssessmentById(id);
        return assessment.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new assessment - Admin-only
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/assessment")
    public ResponseEntity<?> createAssessment(@RequestBody MonthlyAssessmentRequest request) {
        try {
            MonthlyAssessment savedAssessment = monthlyAssessmentService.saveAssessment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAssessment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error saving assessment");
        }
    }

    // Delete an assessment - Admin-only
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("assessment/{id}")
    public ResponseEntity<Void> deleteAssessment(@PathVariable String id) {
        Optional<MonthlyAssessment> existingAssessment = monthlyAssessmentService.getAssessmentById(id);

        if (existingAssessment.isPresent()) {
            monthlyAssessmentService.deleteAssessmentById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/assessment/{id}")
    public ResponseEntity<MonthlyAssessment> updateAssessment(
            @PathVariable String id, @RequestBody MonthlyAssessmentRequest request) {

        MonthlyAssessment updatedAssessment = monthlyAssessmentService.updateAssessment(id, request);

        if (updatedAssessment != null) {
            return ResponseEntity.ok(updatedAssessment); // Return updated assessment
        } else {
            return ResponseEntity.notFound().build(); // If assessment is not found
        }
    }

    // Add a new evaluation
//    @PostMapping("/evaluation")
//    public Evaluation addEvaluation(@RequestBody Evaluation evaluation, Principal principal) {
//        evaluation.setAssessor(principal.getName()); // Set logged-in manager's name as the assessor
//        return evaluationService.saveEvaluation(evaluation);
//    }

    @PostMapping("/evaluation")
    public Evaluation addEvaluation(@RequestBody Evaluation evaluation, Principal principal) {
        // Set the assessor (manager) for the evaluation
        evaluation.setAssessor(principal.getName());

        // Calculate the average for each user's evaluation
        evaluation.getDepartments().forEach(department -> {
            department.getMembers().forEach(userEvaluation -> {
                userEvaluation.calculateAverage();
            });
        });

        // Save the evaluation and return the saved entity
        return evaluationService.saveEvaluation(evaluation);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/evaluations")
    public ResponseEntity<List<Evaluation>> getAllEvaluations() {
        List<Evaluation> evaluations = evaluationService.fetchAllEvaluations();
        return ResponseEntity.ok(evaluations);

    }
//    @GetMapping("/missing-assessors")
//    public List<String> getMissingAssessors(@RequestParam String period) {
//        // Fetch all assessors for the selected period
//        List<String> allAssessors = evaluationService.getAllAssessorsForPeriod(period);
//
//        // Get the list of missing assessors (those who haven't submitted evaluations)
//        return evaluationService.getMissingAssessors(allAssessors, period);
//    }


//    @GetMapping("/evaluation/{id}")
//    public ResponseEntity<Evaluation> getEvaluationById(@PathVariable String id) {
//        return evaluationService.fetchEvaluationById(id)
//                .map(ResponseEntity::ok)
//                .orElseGet(() -> ResponseEntity.notFound().build());
//    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/evaluation/{period}")
    public ResponseEntity<List<Evaluation>> getEvaluationByPeriod(@PathVariable String period) {
        // Example of decoding the period if needed
        String decodedPeriod = URLDecoder.decode(period, StandardCharsets.UTF_8);
        List<Evaluation> evaluations = evaluationService.fetchEvaluationByPeriod(decodedPeriod);
        if (evaluations.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(evaluations);
        }
    }
    @PutMapping("/evaluation/{evaluationId}")
    public ResponseEntity<Evaluation> updateEvaluation(
            @PathVariable String evaluationId,
            @RequestBody UpdateMemberRequest request
    ) {
        Evaluation updatedEvaluation = evaluationService.updateEvaluation(evaluationId, request);
        return ResponseEntity.ok(updatedEvaluation);
    }
    @GetMapping("/evaluations/assessor/{assessor}")
    public List<Evaluation> getEvaluationsByAssessor(@PathVariable String assessor) {
        return evaluationService.getEvaluationsByAssessor(assessor);
    }

    @GetMapping("/evaluation-report")
    public ResponseEntity<String> generateEvaluationReport(@RequestParam String period) {
        // Fetch evaluations by period using the service
        List<Evaluation> evaluations = evaluationService.fetchEvaluationByPeriod(period);

        if (evaluations.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No evaluations found for the given period.");
        }

        // Start building the report
        StringBuilder report = new StringBuilder();
        report.append("Personal Assessment Report\n")
                .append("Date: ").append(LocalDate.now()).append("\n")
                .append("Assessor: ").append(evaluations.get(0).getAssessor()).append("\n");
        //.append("Period: ").append(period).append("\n\n");

        // Loop through each evaluation and its departments
        for (Evaluation evaluation : evaluations) {
            for (Department department : evaluation.getDepartments()) {
                report.append("Department: ").append(department.getDep_name()).append("\n");

                // Loop through each member in the department
                for (UserEvaluation member : department.getMembers()) {
                    report.append("Person: ").append(member.getName()).append("\n")
                            .append("Total Marks: ").append(member.getTotalMarks()).append("\n")
                            .append("Achievement Marks: ").append(member.getAchievementMarks()).append("\n")
                            // .append("Average Team Achievement: ").append(member.getAverageAchievement()).append("\n")
                            .append("Average Team Mark: ").append(department.getTeamValues().getAverageTeamMark()).append("\n")
                            .append("Remarks: ").append(member.getRemarks()).append("\n");
                }

                Department.TeamValues teamValues = department.getTeamValues();
                report.append("Team Values:\n")
                        .append("Total Marks: ").append(teamValues.getTotalMarks()).append("\n")
                        .append("Achievement Marks: ").append(teamValues.getAchievementMarks()).append("\n")
                        .append("Average Achievement: ").append(teamValues.getFormattedAverageAchievement()).append("\n") // Use formatted method
                        .append("Average Team Mark: ").append(teamValues.getAverageTeamMark()).append("\n\n");
            }
        }

        // Return the generated report after looping through all evaluations and departments
        return ResponseEntity.ok(report.toString());
    }
    @GetMapping("/assessors/count")
    public ResponseEntity<Integer> getAllAssessorsCount() {
        int count = evaluationService.getTotalAssessorsCount();
        return ResponseEntity.ok(count);
    }
    @GetMapping("/missing-assessors")
    public ResponseEntity<?> getMissingAssessors(@RequestParam(required = false) String period) {
        if (period == null || period.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: The 'period' parameter is required.");
        }

        try {
            List<User> missingAssessors = evaluationService.getAssessorsWhoDidNotGiveMarks(period);

            if (missingAssessors.isEmpty()) {
                return ResponseEntity.ok("No assessors are missing for the given period.");
            }

            return ResponseEntity.ok(missingAssessors);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
        }
    }
}