package moneyTravel.entity;

public class AssetsRequest {
	private String name;
	private float currency;
	private String currencyCountry;
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
