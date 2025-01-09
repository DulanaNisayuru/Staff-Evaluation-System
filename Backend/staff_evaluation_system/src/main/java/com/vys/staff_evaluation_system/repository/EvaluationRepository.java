package com.vys.staff_evaluation_system.repository;

import com.vys.staff_evaluation_system.entity.Evaluation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationRepository extends MongoRepository<Evaluation, String> {
    // You can add custom queries here if needed
    List<Evaluation> findByAssessor(String assessor);

    List<Evaluation> findByPeriod(String period);
    @Query("SELECT e.assessorEmail FROM Evaluation e WHERE e.period = :period")
    List<String> findEvaluationsForPeriod(String period);


    Optional<Evaluation> findById(String id);


}
