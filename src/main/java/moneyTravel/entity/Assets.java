package moneyTravel.entity;

public class Assets {
	private String id;
	private String name;
	private float currency;
	private String currencyCountry;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public float getCurrency() {
		return currency;
	}
	public void setCurrency(float currency) {
		this.currency = currency;
	}
	public String getCurrencyCountry() {
		return currencyCountry;
	}
	public void setCurrencyCountry(String currencyCountry) {
		this.currencyCountry = currencyCountry;
	}
}
