package moneyTravel.entity;

import java.util.Date;

public class DiaryRequest {
	private Date date;
	private String title;
	private String[] costId;
	private String description;
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String[] getCostId() {
		return costId;
	}
	public void setCostId(String[] costId) {
		this.costId = costId;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}

}
