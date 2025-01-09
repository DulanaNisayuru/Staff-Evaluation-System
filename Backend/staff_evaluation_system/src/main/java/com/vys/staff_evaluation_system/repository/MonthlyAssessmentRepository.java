

package com.vys.staff_evaluation_system.repository;

import com.vys.staff_evaluation_system.entity.MonthlyAssessment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MonthlyAssessmentRepository extends MongoRepository<MonthlyAssessment, String> {
    // You can add custom query methods here if needed
}
