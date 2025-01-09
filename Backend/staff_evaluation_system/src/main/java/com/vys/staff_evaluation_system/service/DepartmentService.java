//package com.vys.staff_evaluation_system.service;//package com.vys.staff_evaluation_system.service;
//
//
//import com.vys.staff_evaluation_system.entity.Department;
//import com.vys.staff_evaluation_system.repository.DepartmentRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class DepartmentService {
//
//    @Autowired
//    private DepartmentRepository departmentRepository;
//
//    // Save a department
//    public Department saveDepartment(Department department) {
//        return departmentRepository.save(department);
//    }
//
//    // Retrieve all departments
//    public  List<Department> getAllDepartments() {
//        return departmentRepository.findAll();
//    }
//
//    // Retrieve a department by ID
//    public Department getDepartmentById(String id) {
//        return departmentRepository.findById(id).orElse(null);
//    }
//}
package com.vys.staff_evaluation_system.service;//package com.vys.staff_evaluation_system.service;


import com.vys.staff_evaluation_system.entity.Department;
import com.vys.staff_evaluation_system.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    // Save a department
    public Department saveDepartment(Department department) {
        return departmentRepository.save(department);
    }

    // Retrieve all departments
    public  List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    // Retrieve a department by ID
    public Department getDepartmentById(String id) {
        return departmentRepository.findById(id).orElse(null);
    }
}
