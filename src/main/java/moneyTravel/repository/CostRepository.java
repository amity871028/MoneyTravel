package moneyTravel.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import moneyTravel.entity.Cost;

@Repository
public interface CostRepository extends MongoRepository<Cost, String> {
	List<Cost> findAll(Sort sort);
	List<Cost> findByAssets(String assetsName);
}