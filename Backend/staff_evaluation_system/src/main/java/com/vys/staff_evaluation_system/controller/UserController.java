//package com.vys.staff_evaluation_system.controller;//package com.vys.staff_evaluation_system.controller;
//
//
//import com.vys.staff_evaluation_system.dto.EvaluationResponse;
//import com.vys.staff_evaluation_system.dto.UserProfileResponse;
//import com.vys.staff_evaluation_system.entity.*;
//import com.vys.staff_evaluation_system.repository.EvaluationRepository;
//import com.vys.staff_evaluation_system.repository.UserRepository;
//import com.vys.staff_evaluation_system.service.DepartmentService;
//import com.vys.staff_evaluation_system.service.EvaluationService;
//import com.vys.staff_evaluation_system.service.MonthlyAssessmentService;
//import com.vys.staff_evaluation_system.service.UserService;
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.*;
//
//import java.lang.reflect.Member;
//import java.net.URLDecoder;
//import java.nio.charset.StandardCharsets;
//import java.security.Principal;
//import java.util.*;
//
//@RestController
//@RequestMapping("/api/v1/users")
//public class UserController {
//
//    @Autowired
//    private UserService userService;
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
//    // Users can view departments (read-only)
//    @PreAuthorize("hasRole('USER')")
//    @GetMapping("/departments")
//    public List<Department> getDepartmentsForUsers() {
//        return departmentService.getAllDepartments();
//    }
//
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
//    @PreAuthorize("hasRole('USER')")
//    @GetMapping("/assessment")
//    public ResponseEntity<List<MonthlyAssessment>> getAllAssessments() {
//        return ResponseEntity.ok(monthlyAssessmentService.getAllAssessments());
//    }
//
//    // Get an assessment by ID - Accessible to USER
//    @PreAuthorize("hasRole('USER')")
//    @GetMapping("assessment/{id}")
//    public ResponseEntity<MonthlyAssessment> getAssessmentById(@PathVariable String id) {
//        Optional<MonthlyAssessment> assessment = monthlyAssessmentService.getAssessmentById(id);
//        return assessment.map(ResponseEntity::ok)
//                .orElseGet(() -> ResponseEntity.notFound().build());
//    }
//
//    @GetMapping("/user-evaluations/{period}")
//    public ResponseEntity<?> getEvaluationsByPeriod(@PathVariable String period) {
//
//        // Fetch evaluations for the given period
//        List<Evaluation> evaluations = evaluationService.fetchEvaluationByPeriod(period);
//
//        if (evaluations.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No evaluations found for the given period");
//        }
//
//        // Process data
//        List<Map<String, Object>> response = evaluations.stream().flatMap(evaluation ->
//                evaluation.getDepartments().stream().flatMap(department ->
//                        department.getMembers().stream().map(member -> {
//                            Map<String, Object> memberMap = new HashMap<>();
//                            memberMap.put("department", department.getDep_name());
//                            memberMap.put("name", member.getName());
//                            memberMap.put("totalMarks", member.getTotalMarks());
//                            memberMap.put("achievementMarks", member.getAchievementMarks());
//                            memberMap.put("average", member.getAverage());
//                            memberMap.put("remarks", member.getRemarks());
//                            memberMap.put("teamAverageAchievement", department.getTeamValues().getFormattedAverageAchievement());
//                            return memberMap;
//                        })
//                )
//        ).toList();
//
//        return ResponseEntity.ok(response);
//    }
//
//    @GetMapping("/evaluations")
//    public ResponseEntity<List<Evaluation>> getAllEvaluations() {
//        List<Evaluation> evaluations = evaluationService.fetchAllEvaluations();
//        return ResponseEntity.ok(evaluations);
//
//    }
//    @GetMapping("/assessors/count")
//    public ResponseEntity<Integer> getAllAssessorsCount() {
//        int count = evaluationService.getTotalAssessorsCount();
//        return ResponseEntity.ok(count);
//    }
//    @Autowired
//    private EvaluationRepository evaluationRepository;
//    @GetMapping("/user-evaluations/{email}/{period}")
//    public ResponseEntity<List<Map<String, Object>>> getUserEvaluations(
//            @PathVariable String email,
//            @PathVariable String period) {
//
//        // Fetch evaluations for the specific period
//        List<Evaluation> evaluations = evaluationRepository.findByPeriod(period);
//
//        List<Map<String, Object>> userEvaluations = new ArrayList<>();
//
//        // Loop through evaluations and check if the user exists in any department
//        for (Evaluation evaluation : evaluations) {
//            for (Department department : evaluation.getDepartments()) {
//                for (UserEvaluation member : department.getMembers()) {
//                    // Match user by email (name)
//                    if (member.getName().equalsIgnoreCase(email)) {
//                        // Create a map to store relevant data
//                        Map<String, Object> evaluationData = new HashMap<>();
//                        evaluationData.put("department", department.getDep_name());
//                        evaluationData.put("name", member.getName());
//                        evaluationData.put("totalMarks", member.getTotalMarks());
//                        evaluationData.put("achievementMarks", member.getAchievementMarks());
//                        evaluationData.put("average", member.getAverage());
//                        evaluationData.put("remarks", member.getRemarks());
//
//                        // Add to the list of evaluations
//                        userEvaluations.add(evaluationData);
//                    }
//                }
//            }
//        }
//
//        // Check if any evaluations were found for the user
//        if (userEvaluations.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(List.of(Map.of("message", "No evaluations found for the given user and period.")));
//        }
//
//        // Return the response with user evaluations
//        return ResponseEntity.ok(userEvaluations);
//
//
//    }
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @GetMapping("/marks")
//
//    public ResponseEntity<UserEvaluation> getUserEvaluation(@RequestParam("period") String period) {
//        // Get the currently logged-in user's email (assuming the email is stored as username)
//        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        String email = userDetails.getUsername();  // This dynamically fetches the logged-in user's email
//
//        // Fetch the user evaluation data for the specified period
//        UserEvaluation userEvaluation = evaluationService.getUserEvaluationByEmailAndPeriod(email, period);
//
//        if (userEvaluation != null) {
//            return ResponseEntity.ok(userEvaluation);  // Return user evaluation data
//        } else {
//            return ResponseEntity.notFound().build();  // If no evaluation found
//        }
//    }
//}

package com.vys.staff_evaluation_system.controller;//package com.vys.staff_evaluation_system.controller;


import com.vys.staff_evaluation_system.dto.EvaluationResponse;
import com.vys.staff_evaluation_system.dto.UserProfileResponse;
import com.vys.staff_evaluation_system.entity.*;
import com.vys.staff_evaluation_system.repository.EvaluationRepository;
import com.vys.staff_evaluation_system.repository.UserRepository;
import com.vys.staff_evaluation_system.service.DepartmentService;
import com.vys.staff_evaluation_system.service.EvaluationService;
import com.vys.staff_evaluation_system.service.MonthlyAssessmentService;
import com.vys.staff_evaluation_system.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Member;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private MonthlyAssessmentService monthlyAssessmentService;

    @Autowired
    private EvaluationService evaluationService;

    // Users can view departments (read-only)
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/departments")
    public List<Department> getDepartmentsForUsers() {
        return departmentService.getAllDepartments();
    }

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

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/assessment")
    public ResponseEntity<List<MonthlyAssessment>> getAllAssessments() {
        return ResponseEntity.ok(monthlyAssessmentService.getAllAssessments());
    }

    // Get an assessment by ID - Accessible to USER
    @PreAuthorize("hasRole('USER')")
    @GetMapping("assessment/{id}")
    public ResponseEntity<MonthlyAssessment> getAssessmentById(@PathVariable String id) {
        Optional<MonthlyAssessment> assessment = monthlyAssessmentService.getAssessmentById(id);
        return assessment.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user-evaluations/{period}")
    public ResponseEntity<?> getEvaluationsByPeriod(@PathVariable String period) {

        // Fetch evaluations for the given period
        List<Evaluation> evaluations = evaluationService.fetchEvaluationByPeriod(period);

        if (evaluations.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No evaluations found for the given period");
        }

        // Process data
        List<Map<String, Object>> response = evaluations.stream().flatMap(evaluation ->
                evaluation.getDepartments().stream().flatMap(department ->
                        department.getMembers().stream().map(member -> {
                            Map<String, Object> memberMap = new HashMap<>();
                            memberMap.put("department", department.getDep_name());
                            memberMap.put("name", member.getName());
                            memberMap.put("totalMarks", member.getTotalMarks());
                            memberMap.put("achievementMarks", member.getAchievementMarks());
                            memberMap.put("average", member.getAverage());
                            memberMap.put("remarks", member.getRemarks());
                            memberMap.put("teamAverageAchievement", department.getTeamValues().getFormattedAverageAchievement());
                            return memberMap;
                        })
                )
        ).toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/evaluations")
    public ResponseEntity<List<Evaluation>> getAllEvaluations() {
        List<Evaluation> evaluations = evaluationService.fetchAllEvaluations();
        return ResponseEntity.ok(evaluations);

    }
    @GetMapping("/assessors/count")
    public ResponseEntity<Integer> getAllAssessorsCount() {
        int count = evaluationService.getTotalAssessorsCount();
        return ResponseEntity.ok(count);
    }
    @Autowired
    private EvaluationRepository evaluationRepository;
    @GetMapping("/user-evaluations/{email}/{period}")
    public ResponseEntity<List<Map<String, Object>>> getUserEvaluations(
            @PathVariable String email,
            @PathVariable String period) {

        // Fetch evaluations for the specific period
        List<Evaluation> evaluations = evaluationRepository.findByPeriod(period);

        List<Map<String, Object>> userEvaluations = new ArrayList<>();

        // Loop through evaluations and check if the user exists in any department
        for (Evaluation evaluation : evaluations) {
            for (Department department : evaluation.getDepartments()) {
                for (UserEvaluation member : department.getMembers()) {
                    // Match user by email (name)
                    if (member.getName().equalsIgnoreCase(email)) {
                        // Create a map to store relevant data
                        Map<String, Object> evaluationData = new HashMap<>();
                        evaluationData.put("department", department.getDep_name());
                        evaluationData.put("name", member.getName());
                        evaluationData.put("totalMarks", member.getTotalMarks());
                        evaluationData.put("achievementMarks", member.getAchievementMarks());
                        evaluationData.put("average", member.getAverage());
                        evaluationData.put("remarks", member.getRemarks());

                        // Add to the list of evaluations
                        userEvaluations.add(evaluationData);
                    }
                }
            }
        }

        // Check if any evaluations were found for the user
        if (userEvaluations.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(List.of(Map.of("message", "No evaluations found for the given user and period.")));
        }

        // Return the response with user evaluations
        return ResponseEntity.ok(userEvaluations);


    }

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/marks")

    public ResponseEntity<UserEvaluation> getUserEvaluation(@RequestParam("period") String period) {
        // Get the currently logged-in user's email (assuming the email is stored as username)
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();  // This dynamically fetches the logged-in user's email

        // Fetch the user evaluation data for the specified period
        UserEvaluation userEvaluation = evaluationService.getUserEvaluationByEmailAndPeriod(email, period);

        if (userEvaluation != null) {
            return ResponseEntity.ok(userEvaluation);  // Return user evaluation data
        } else {
            return ResponseEntity.notFound().build();  // If no evaluation found
        }
    }
    @GetMapping("/team-values")
    public ResponseEntity<Department.TeamValues> getTeamValuesForUser(
            @RequestParam String email,
            @RequestParam String period
    ) {
        Department.TeamValues teamValues = evaluationService.getAggregatedTeamValues(email, period);

        if (teamValues != null) {
            return ResponseEntity.ok(teamValues);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}