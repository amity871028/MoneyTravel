package moneyTravel.repository;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import moneyTravel.entity.Cost;

@Repository
public interface CostRepository extends MongoRepository<Cost, String> {
	List<Cost> findAll(Sort sort); 
}