package moneyTravel.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import moneyTravel.entity.Assets;


@Repository
public interface AssetsRepository extends MongoRepository<Assets, String> {
}