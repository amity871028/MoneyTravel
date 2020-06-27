package moneyTravel.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import moneyTravel.entity.Assets;
import moneyTravel.entity.AssetsRequest;
import moneyTravel.entity.Cost;
import moneyTravel.entity.Diary;
import moneyTravel.entity.DiaryRequest;
import moneyTravel.repository.DiaryRepository;

@Service
public class DiaryService {

	static int monthEndDate[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
	
	@Autowired
	private DiaryRepository repository;

	
	public DiaryService(DiaryRepository repository) {
		this.repository = repository;
	}
	
	public Diary getDiary(String id) throws NotFoundException {
		return repository.findById(id).orElseThrow(() -> new NotFoundException());
	}
	
	public List<Diary> getDiaries(String date){
		Sort.Direction direction = Sort.Direction.DESC;
		Sort sort = null;
		sort = Sort.by(direction, "date");
		List<Diary> allDiary = repository.findAll(sort);

		List<Diary> result = new ArrayList<Diary>();
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		try {
			int year = Integer.valueOf(date.split("-")[0]);
			int month = Integer.valueOf(date.split("-")[1]);
			int endDate = monthEndDate[month-1];
			if(month == 2) {
				GregorianCalendar cal = (GregorianCalendar) GregorianCalendar.getInstance();
				if(cal.isLeapYear(year)) endDate = 29;
			}
			Date monthStart = sdf.parse(date + "-01 00:00:00");
			Date monthEnd = sdf.parse(date + "-" + endDate + " 23:59:59");

			for(int i = 0; i < allDiary.size(); i++) {
				if(allDiary.get(i).getDate().after(monthStart) && allDiary.get(i).getDate().before(monthEnd)) {
					Diary tmp = new Diary();
					tmp.setId(allDiary.get(i).getId());
					tmp.setDate(allDiary.get(i).getDate());
					tmp.setTitle(allDiary.get(i).getTitle());
					tmp.setCostId(allDiary.get(i).getCostId());
					tmp.setDescription(allDiary.get(i).getDescription());
					
					result.add(tmp);
				}
			}
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
	}

	public Diary createDiary(DiaryRequest request) {
		Diary diary = new Diary();
		diary.setDate(request.getDate());
		diary.setTitle(request.getTitle());
		diary.setDescription(request.getDescription());
		diary.setCostId(request.getCostId());
		return repository.insert(diary);
	}
	
	public void deleteDiary(String id) {
		repository.deleteById(id);
	}
}
