package moneyTravel.controller;

import java.net.URISyntaxException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;

import moneyTravel.entity.Assets;
import moneyTravel.entity.AssetsRequest;
import moneyTravel.entity.Diary;
import moneyTravel.entity.DiaryRequest;
import moneyTravel.service.DiaryService;

@RestController
@RequestMapping(value = "/diary")
public class DiaryController {

	@Autowired
	private DiaryService diaryService;

	
	@GetMapping
	public ResponseEntity<List<Diary>> findDiary() {
		List<Diary> diaries = diaryService.getAllDiary();
		return ResponseEntity.ok(diaries);
	}
	
	@PostMapping(value = "/new")
	public ResponseEntity<Diary> createDiary(@Valid @RequestBody DiaryRequest request){
		Diary diary = diaryService.createDiary(request);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/new").buildAndExpand(diary.getId()).toUri();
		return ResponseEntity.created(location).body(diary);
		
	}
}
