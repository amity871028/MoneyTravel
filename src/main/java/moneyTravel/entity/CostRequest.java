package moneyTravel.entity;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Date;


public class CostRequest {
	//@NotEmpty(message = "Product name isn't provided.")
	private Date time;
	
	@NotNull
	private int assets;

	private String category;
	
	@NotNull
	private int type;
	
	@NotNull
	private int cost;

	private String description;

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

	public int getAssets() {
		return assets;
	}

	public void setAssets(int assets) {
		this.assets = assets;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getCost() {
		return cost;
	}

	public void setCost(int cost) {
		this.cost = cost;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	public String toString() {
		return "Cost{" +
                ", time='" + time + '\'' +
                ", assets=" + assets +
                ", category=" + category +
                ", type=" + type +
                ", cost=" + cost +
                ", description=" + description +
                '}';
	}
}
