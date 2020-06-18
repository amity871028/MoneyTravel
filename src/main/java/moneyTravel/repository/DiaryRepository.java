package moneyTravel.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import moneyTravel.entity.Diary;

@Repository
public interface DiaryRepository extends MongoRepository<Diary, String> {
	List<Diary> findAll(Sort sort); 
}
