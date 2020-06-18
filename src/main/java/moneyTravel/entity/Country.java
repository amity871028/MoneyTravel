package moneyTravel.entity;

public class Country {
	private String countryEN;
	private String countryCH;
	private double exchangeRate;
	public String getCountryEN() {
		return countryEN;
	}
	public void setCountryEN(String countryEN) {
		this.countryEN = countryEN;
	}
	public String getCountryCH() {
		return countryCH;
	}
	public void setCountryCH(String countryCH) {
		this.countryCH = countryCH;
	}
	public double getExchangeRate() {
		return exchangeRate;
	}
	public void setExchangeRate(double exchangeRate) {
		this.exchangeRate = exchangeRate;
	} 
	public String toString() {
		return "Country{" +
                ", countryEN='" + countryEN + '\'' +
                ", countryCH=" + countryCH +
                ", exchangeRate=" + exchangeRate +
                '}';
	}
}
