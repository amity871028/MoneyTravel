package moneyTravel.entity;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cost")
public class Cost {
	private String id;
	private Date time;
	private String assets;
	private String category;
	private int type;
	private int cost;
	private String description;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Date getTime() {
		return time;
	}
	public void setTime(Date time) {
		this.time = time;
	}
	public String getAssets() {
		return assets;
	}
	public void setAssets(String assets) {
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
                "id='" + id + '\'' +
                ", time='" + time + '\'' +
                ", assets=" + assets +
                ", category=" + category +
                ", type=" + type +
                ", cost=" + cost +
                ", description=" + description +
                '}';
	}
}
