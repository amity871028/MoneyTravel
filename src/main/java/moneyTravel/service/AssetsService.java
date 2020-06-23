package moneyTravel.service;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;

import moneyTravel.entity.Assets;
import moneyTravel.entity.AssetsRequest;
import moneyTravel.entity.Cost;
import moneyTravel.entity.Country;
import moneyTravel.repository.AssetsRepository;

@Service
public class AssetsService {

	@Autowired
	private AssetsRepository repository;

	@Autowired
	private CostService costService;
	public AssetsService(AssetsRepository repository) {
		this.repository = repository;
	}
	
	public List<Assets> getAllAssets(){
		return repository.findAll();
	}
	
	public Assets getAssets(String id) throws NotFoundException {
		return repository.findById(id).orElseThrow(() -> new NotFoundException());
	}
	
	public Assets createAssets(AssetsRequest request) {
		Assets assets = new Assets();
		assets.setCurrency(request.getCurrency());
		assets.setCurrencyCountry(request.getCurrencyCountry());
		assets.setName(request.getName());
		return repository.insert(assets);
	}
	
	public Assets replaceAssets(String assetsId, AssetsRequest request) throws NotFoundException {
		Assets oldAssets = getAssets(assetsId);
		
		Assets assets = new Assets();
		assets.setId(oldAssets.getId());;
		assets.setName(request.getName());
		assets.setCurrency(request.getCurrency());
		assets.setCurrencyCountry(request.getCurrencyCountry());
		
		costService.replaceAssets(oldAssets.getName(), request.getName());
		
		return repository.save(assets);
	}
	
	public void deleteAssets(String id) throws NotFoundException {
		Assets assets = getAssets(id);
		costService.deleteCostsContainAssetsName(assets.getName());
		
		repository.deleteById(id);
	}
	
	public List<Country> getAllExchangeRate() {
		String CountryEN[] = {"TWD", "USD", "EUR", "JPY", "HKD", "GBP", "CNY", "KRW"};
		String CountryCH[] = {"台幣", "美金", "歐元", "日幣", "港幣", "英鎊", "人民幣", "韓幣(南韓)"};
		
		String TARGET_URL = "https://tw.rter.info/capi.php";
		Connection con = Jsoup.connect(TARGET_URL).ignoreContentType(true);
		Document doc = null;
		try {
			doc = con.post();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		JSONObject jsonObj = new JSONObject(doc.text());
		
		double USAToTaiwanExchangeRate = jsonObj.getJSONObject("USDTWD").getDouble("Exrate");
		
		List<Country> countries = new ArrayList<Country>();
		for(int i = 0; i < CountryEN.length; i++) {
			Country country = new Country();
			country.setCountryEN(CountryEN[i]);
			country.setCountryCH(CountryCH[i]);
			if(i == 1) {
				double exchangeRate  = (double)(Math.round(USAToTaiwanExchangeRate*10000))/10000;
				country.setExchangeRate(exchangeRate);
			}
			else {
				double USDtoCountry = jsonObj.getJSONObject("USD" + CountryEN[i]).getDouble("Exrate");
				double exchangeRate = USDtoCountry/USAToTaiwanExchangeRate;
				exchangeRate  = (double)(Math.round(exchangeRate*10000))/10000;
				country.setExchangeRate(exchangeRate);
			}
			countries.add(country);
		}
		return countries;
	}
	
	public Assets findByName(String name) {
		Assets assets = repository.findByName(name);
		return assets;
	}
}
