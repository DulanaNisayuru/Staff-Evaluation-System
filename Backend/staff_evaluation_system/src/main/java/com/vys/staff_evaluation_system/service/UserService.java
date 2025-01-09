////package com.vys.staff_evaluation_system.service;
////
////import com.vys.staff_evaluation_system.dto.DepartmentCategorizedResponse;
////import com.vys.staff_evaluation_system.dto.UserProfileResponse;
////import com.vys.staff_evaluation_system.entity.User;
////import com.vys.staff_evaluation_system.entity.Department;
////import com.vys.staff_evaluation_system.repository.UserRepository;
////import com.vys.staff_evaluation_system.repository.DepartmentRepository;
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.stereotype.Service;
////
////import java.util.List;
////import java.util.Map;
////import java.util.Optional;
////import java.util.stream.Collectors;
////
////@Service
////public class UserService {
////    @Autowired
////    private UserRepository userRepository;
////
////    public List<User> getAllUsers() {
////        return userRepository.findAll();
////    }
////
////    public User getUserById(String id) {
////        return userRepository.findById(id).orElse(null);
////    }
////
////    public User createUser(User user) {
////        return userRepository.save(user);
////    }
////
////    public User updateUser(String id, User userDetails) {
////        User user = userRepository.findById(id).orElse(null);
////        if (user != null) {
////            user.setName(userDetails.getName());
////            user.setEmail(userDetails.getEmail());
////
////            return userRepository.save(user);
////        }
////        return null;
////    }
////
////    public void deleteUser(String id) {
////        userRepository.deleteById(id);
////    }
////
////    public User findByEmail(String email) {
////        Optional<User> user = userRepository.findByEmail(email);  // Assuming you have this method in your repository
////        return user.orElse(null);  // If user is found, return it, otherwise return null
////    }
////
////
////
////    public Map<String, List<UserProfileResponse>> getUsersCategorizedByDepartment() {
////        List<User> users = userRepository.findAll();  // Fetch all users from the repository
////
////        // Categorizing users by department
////        Map<String, List<UserProfileResponse>> categorizedUsers = users.stream()
////                .map(user -> new UserProfileResponse(user.getName(), user.getEmail(), user.getRole().name(), user.getDep_name()))
////                .collect(Collectors.groupingBy(UserProfileResponse::getDep_name));
////
////        return categorizedUsers;  // Return the categorized list
////    }
////
////    // Optional: Method to get users by a specific department name
////    public List<UserProfileResponse> getUsersByDepartment(String dep_name) {
////        List<User> users = userRepository.findByDep_name(dep_name);  // Custom method in the repository to find by department name
////
////        // Map the users into DTOs and return
////        return users.stream()
////                .map(user -> new UserProfileResponse(user.getName(), user.getEmail(), user.getRole().name(), user.getDep_name()))
////                .collect(Collectors.toList());
////    } }
//
//
//package com.vys.staff_evaluation_system.service;
//
//import com.vys.staff_evaluation_system.dto.UserProfileResponse;
//import com.vys.staff_evaluation_system.entity.Role;
//import com.vys.staff_evaluation_system.entity.User;
//import com.vys.staff_evaluation_system.entity.UserProjection;
//import com.vys.staff_evaluation_system.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.Arrays;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@Service
//public class UserService {
//    @Autowired
//    private UserRepository userRepository;
//
//    // Get all users
//    public List<User> getAllUsers() {
//        return userRepository.findAll();
//    }
//
//    // Get user by ID
//    public User getUserById(String id) {
//        return userRepository.findById(id).orElse(null);
//    }
//
//    // Create user
//    public User createUser(User user) {
//        return userRepository.save(user);
//    }
//
//    // Update user
//    public User updateUser(String id, User userDetails) {
//        User user = userRepository.findById(id).orElse(null);
//        if (user != null) {
//            user.setName(userDetails.getName());
//            user.setEmail(userDetails.getEmail());
//            return userRepository.save(user);
//        }
//        return null;
//    }
//
//    // Delete user
//    public void deleteUser(String id) {
//        userRepository.deleteById(id);
//    }
//
//    // Find user by email
//    public User findByEmail(String email) {
//        Optional<User> user = userRepository.findByEmail(email);
//        return user.orElse(null);
//    }
//
//
//    public Map<String, List<UserProfileResponse>> getUsersCategorizedByDepartment() {
//        // Fetch all users
//        List<User> users = userRepository.findAll();
//
//        // Group users by department, excluding null department names
//        return users.stream()
//                .map(user -> new UserProfileResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getDepName()))
//                .filter(userProfileResponse -> userProfileResponse.getDep_name() != null) // Filter out null departments
//                .collect(Collectors.groupingBy(UserProfileResponse::getDep_name));
//    }
//
//    public List<User> getAssessors() {
//        List<Role> roles = Arrays.asList(Role.ADMIN, Role.MANAGER);
//        return userRepository.findByRoleIn(roles);
//    }
//}


package com.vys.staff_evaluation_system.service;

import com.vys.staff_evaluation_system.dto.UserProfileResponse;
import com.vys.staff_evaluation_system.entity.Role;
import com.vys.staff_evaluation_system.entity.User;
import com.vys.staff_evaluation_system.entity.UserProjection;
import com.vys.staff_evaluation_system.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    // Create user
    public User createUser(User user) {
        return userRepository.save(user);
    }
    @Autowired
    private MongoTemplate mongoTemplate;


    public User updateUser(String userId, User updatedUser) throws Exception {
        // Validate if the userId is a valid MongoDB ObjectId
        if (!ObjectId.isValid(userId)) {
            throw new IllegalArgumentException("Invalid MongoDB ID format");
        }

        // Create a query to find the user by _id
        Query query = new Query(Criteria.where("_id").is(new ObjectId(userId)));
        User existingUser = mongoTemplate.findOne(query, User.class);

        if (existingUser == null) {
            throw new Exception("User not found with ID: " + userId);
        }

        // Update the fields of the existing user with the new values
        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setRole(updatedUser.getRole());
        existingUser.setDep_name(updatedUser.getDep_name());

        // Save the updated user
        return mongoTemplate.save(existingUser);
    }
    // Delete user
    public void deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }
    // Find user by email
    public User findByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.orElse(null);
    }


    public Map<String, List<UserProfileResponse>> getUsersCategorizedByDepartment() {
        // Fetch all users
        List<User> users = userRepository.findAll();

        // Group users by department, excluding null department names
        return users.stream()
                .map(user -> new UserProfileResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getDepName()))
                .filter(userProfileResponse -> userProfileResponse.getDep_name() != null) // Filter out null departments
                .collect(Collectors.groupingBy(UserProfileResponse::getDep_name));
    }

    public List<User> getAssessors() {
        List<Role> roles = Arrays.asList(Role.ADMIN, Role.MANAGER);
        return userRepository.findByRoleIn(roles);
    }
}