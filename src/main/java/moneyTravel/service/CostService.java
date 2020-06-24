package moneyTravel.service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;

import moneyTravel.entity.Assets;
import moneyTravel.entity.AssetsCosts;
import moneyTravel.entity.Cost;
import moneyTravel.entity.CostRequest;
import moneyTravel.repository.CostRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.GregorianCalendar;

import org.springframework.data.domain.Sort;
@Service
public class CostService {
	
	private static final Cost Null = null;
	static int monthEndDate[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
	
	@Autowired
	private CostRepository repository;
	

	@Autowired
	private AssetsService assetsService;
	
	public CostService(CostRepository repository) {
		this.repository = repository;
	}
	
	public List<Cost> getCosts(String date) {
		Sort.Direction direction = Sort.Direction.DESC;
		Sort sort = null;
		sort = Sort.by(direction, "time");
		List<Cost> allCost = repository.findAll(sort);;
		List<Cost> result = new ArrayList<Cost>();
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

			for(int i = 0; i < allCost.size(); i++) {
				if(allCost.get(i).getTime().after(monthStart) && allCost.get(i).getTime().before(monthEnd)) {
					Cost tmp = new Cost();
					tmp.setId(allCost.get(i).getId());
					tmp.setTime(allCost.get(i).getTime());
					tmp.setAssets(allCost.get(i).getAssets());
					tmp.setCategory(allCost.get(i).getCategory());
					tmp.setType(allCost.get(i).getType());
					tmp.setCost(allCost.get(i).getCost());
					tmp.setDescription(allCost.get(i).getDescription());
					
					result.add(tmp);
				}
			}
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
		//return repository.findAll(sort);
	}
	
	
	public Cost getCost(String id) throws NotFoundException {
		return repository.findById(id).orElseThrow(() -> new NotFoundException());
	}
	
	public Cost createCost(CostRequest request) {
		Cost cost = new Cost();
		cost.setTime(request.getTime());
		cost.setAssets(request.getAssets());
		cost.setCategory(request.getCategory());
		cost.setType(request.getType());
		cost.setCost(request.getCost());
		cost.setDescription(request.getDescription());
		System.out.println(cost);
		return repository.insert(cost);
		
	}
	
	public Cost replaceCost(String costId, CostRequest request) throws NotFoundException {
		Cost oldCost = getCost(costId);
		
		Cost cost = new Cost();
		cost.setId(oldCost.getId());
		cost.setTime(request.getTime());
		cost.setAssets(request.getAssets());
		cost.setCategory(request.getCategory());
		cost.setType(request.getType());
		cost.setCost(request.getCost());
		cost.setDescription(request.getDescription());

		return repository.save(cost);
		
	}
	
	public void deleteCost(String id) {
		repository.deleteById(id);
	}
	
	public List<AssetsCosts> getAssetsCost(){
		List<Assets> allAssets = assetsService.getAllAssets();
		List<AssetsCosts> assetsCosts = new ArrayList<AssetsCosts>();
		for(int i = 0; i < allAssets.size(); i++) {
			AssetsCosts tmp = new AssetsCosts();
			tmp.setAssetsId(allAssets.get(i).getId());
			tmp.setAssets(allAssets.get(i).getName());
			tmp.setTotalCost(0);
			assetsCosts.add(tmp);
		}
		Sort.Direction direction = Sort.Direction.DESC;
		Sort sort = null;
		sort = Sort.by(direction, "assets");
		List<Cost> allCosts = repository.findAll(sort);
		for(int i = 0; i < assetsCosts.size(); i++) {
			for(int j = 0 ; j < allCosts.size(); j++) {
				if(assetsCosts.get(i).getAssets().equals(allCosts.get(j).getAssets())) {
					assetsCosts.get(i).setTotalCost(assetsCosts.get(i).getTotalCost() + allCosts.get(j).getCost());
				}
			}
		}
		return assetsCosts;
	}
	
	public List<Cost> findByAssets(String assetsName){
		return repository.findByAssets(assetsName);
	}
	
	public void replaceAssets(String oldName, String newName) throws NotFoundException{
		
		List<Cost> costs = findByAssets(oldName);
		System.out.println(costs);
		for(int i = 0; i < costs.size(); i++) {
			CostRequest request = new CostRequest();
			request.setTime(costs.get(i).getTime());
			request.setAssets(newName);
			request.setCategory(costs.get(i).getCategory());
			request.setType(costs.get(i).getType());
			request.setCost(costs.get(i).getCost());
			request.setDescription(costs.get(i).getDescription());
			replaceCost(costs.get(i).getId(), request);
		}
	}
	
	public void deleteCostsContainAssetsName(String assetsName) {
		List<Cost> costs = findByAssets(assetsName);
		for(int i = 0; i < costs.size(); i++) {
			deleteCost(costs.get(i).getId());
		}
	}
}
