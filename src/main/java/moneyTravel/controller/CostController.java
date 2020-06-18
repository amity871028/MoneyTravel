package moneyTravel.controller;

import java.io.IOException;
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

import moneyTravel.entity.Cost;
import moneyTravel.entity.CostRequest;
import moneyTravel.service.CostService;

@RestController
@RequestMapping(value = "/cost")
public class CostController{
	
	@Autowired
	private CostService costService;
	
	
	@GetMapping(value = "/{id}")
	public ResponseEntity<Cost> getCost(@PathVariable("id") String id) throws NotFoundException {
		Cost cost = costService.getCost(id);
		return ResponseEntity.ok(cost);
	}
	
	@GetMapping
	public ResponseEntity<List<Cost>> findCost(@RequestParam("date") String date) {
		List<Cost> costs = costService.getCosts(date);
		return ResponseEntity.ok(costs);
		
	}
	
	@PostMapping(value = "/new")
	public ResponseEntity<Cost> createCost(@Valid @RequestBody CostRequest request){
		Cost cost = costService.createCost(request);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/new").buildAndExpand(cost.getId()).toUri();
		 
		return ResponseEntity.created(location).body(cost);
		
	}
	
	@PutMapping(value = "/{id}/update")
	public ResponseEntity<Cost> replaceCost(@PathVariable("id") String id, @Valid @RequestBody CostRequest request) throws NotFoundException{
		Cost cost = costService.replaceCost(id, request);
		return ResponseEntity.ok(cost);	
	}
	
	@DeleteMapping(value = "/{id}/delete")
	public ResponseEntity<Cost> deleteNote(@PathVariable("id") String id){
		costService.deleteNote(id);
		return ResponseEntity.noContent().build();
	}
}