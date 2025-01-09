package com.vys.staff_evaluation_system.repository;

import com.vys.staff_evaluation_system.entity.UserEvaluation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserEvaluationRepository extends MongoRepository<UserEvaluation, String> {
    Optional<UserEvaluation> findByName(String name);
}
