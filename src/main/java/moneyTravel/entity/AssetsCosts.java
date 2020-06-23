package moneyTravel.entity;

public class AssetsCosts {
	private String assetsId;
	private String assets;
	private int totalCost;

	public String getAssetsId() {
		return assetsId;
	}
	public void setAssetsId(String assetsId) {
		this.assetsId = assetsId;
	}
	public String getAssets() {
		return assets;
	}
	public void setAssets(String assets) {
		this.assets = assets;
	}
	public int getTotalCost() {
		return totalCost;
	}
	public void setTotalCost(int totalCost) {
		this.totalCost = totalCost;
	}

	public String toString() {
		return "AssetsCosts{" +
                ", assets=" + assets +
                ", totalCost=" + totalCost +
                '}';
	}
}
