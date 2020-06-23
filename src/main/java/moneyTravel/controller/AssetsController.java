package moneyTravel.controller;

import java.net.URI;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import moneyTravel.service.AssetsService;
import moneyTravel.entity.Assets;
import moneyTravel.entity.AssetsRequest;
import moneyTravel.entity.Cost;
import moneyTravel.entity.CostRequest;
import moneyTravel.entity.Country;

@RestController
@RequestMapping(value = "/assets")
public class AssetsController {
	@Autowired
	private AssetsService assetsService;
	
	@GetMapping
	public ResponseEntity<List<Assets>> findAssets() {
		List<Assets> assets = assetsService.getAllAssets();
		return ResponseEntity.ok(assets);
	}
	
	@GetMapping(value = "/{id}")
	public ResponseEntity<Assets> getAssets(@PathVariable("id") String id) throws NotFoundException {
		Assets assets = assetsService.getAssets(id);
		return ResponseEntity.ok(assets);
	}

	@GetMapping(value = "/exchangeRate")
	public ResponseEntity<List<Country>> getAllExchangeRate() {
		List<Country> countries = assetsService.getAllExchangeRate();
		return ResponseEntity.ok(countries);
	}
	
	@PostMapping(value = "/new")
	public ResponseEntity<Assets> createCost(@Valid @RequestBody AssetsRequest request){
		Assets assets = assetsService.createAssets(request);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/new").buildAndExpand(assets.getId()).toUri();
		return ResponseEntity.created(location).body(assets);
		
	}
	
	@PutMapping(value = "/{id}/update")
	public ResponseEntity<Assets> replaceassets(@PathVariable("id") String id, @Valid @RequestBody AssetsRequest request) throws NotFoundException{
		Assets assets = assetsService.replaceAssets(id, request);
		return ResponseEntity.ok(assets);	
	}
	
	@DeleteMapping(value = "/{id}/delete")
	public ResponseEntity<Cost> deleteAssets(@PathVariable("id") String id) throws NotFoundException{
		assetsService.deleteAssets(id);
		return ResponseEntity.noContent().build();
	}
}
