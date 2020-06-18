package moneyTravel.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import moneyTravel.entity.Assets;
import moneyTravel.entity.AssetsRequest;
import moneyTravel.entity.Diary;
import moneyTravel.entity.DiaryRequest;
import moneyTravel.repository.DiaryRepository;

@Service
public class DiaryService {
	
	@Autowired
	private DiaryRepository repository;

	
	public DiaryService(DiaryRepository repository) {
		this.repository = repository;
	}
	
	public List<Diary> getAllDiary(){
		Sort.Direction direction = Sort.Direction.DESC;
		Sort sort = null;
		sort = Sort.by(direction, "date");
		return repository.findAll(sort);
	}

	public Diary createDiary(DiaryRequest request) {
		Diary diary = new Diary();
		diary.setDate(request.getDate());
		diary.setTitle(request.getTitle());
		diary.setDescription(request.getDescription());
		diary.setCostId(request.getCostId());
		return repository.insert(diary);
	}
}
