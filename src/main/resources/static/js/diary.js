const diaryAPI = {
    all: "diary",
    oneCost: "cost",
    assets: "assets"
}

const currencyName = ["台幣", "美金", "歐元", "日幣", "港幣", "英鎊", "人民幣", "韓幣(南韓)"];
const currencySymbol = ["$", "US$", "€", "JP¥", "HK$", "£", "CN¥", "₩"];

function delayURL(url, time) {
    setTimeout(() => { window.location.href = `${url}`; }, time);
}

async function getDiary(){
    
	const monthnYear = document.getElementById('date-title').innerHTML;
	let result = await FetchData.get(`${diaryAPI.all}?date=${monthnYear}`);
    let json = await result.json();
    console.log(json);

    
	result = await FetchData.get(diaryAPI.assets);
	let assetsJson = await result.json();

    let tmp = "";
    const diaryCards = document.getElementById('diary-card');
    for(eachDiary of json){
    //json.forEach(eachDiary => {
        let descriptionArray = eachDiary.description.split('\n');
        let first = descriptionArray[0];
        let second = descriptionArray[1];
        if(descriptionArray.length == 1) second = " ";
        let description = first + "<br>" + second;

        let totalCost = [0, 0, 0, 0, 0, 0, 0, 0];
        for(costId of eachDiary.costId){
            const result = await FetchData.get(`${diaryAPI.oneCost}/${costId}`);
            const costDetail = await result.json();

            assetsJson.forEach(eachAssets => {
                if(eachAssets.name == costDetail.assets){
                    let index = currencyName.findIndex(element => element == eachAssets.currencyCountry);
                    totalCost[index] += costDetail.cost;
                }
            });
        }

        let costTmp = "";
        for(let i in totalCost){
            if(totalCost[i] == 0) continue;
            if(totalCost[i] < 0) costTmp += `<span class="cost"> ${currencySymbol[i]} ${totalCost[i]*(-1)}</span>`;
            else costTmp += `<span class="income"> ${currencySymbol[i]} ${totalCost[i]}</span>`;
        };

        tmp += `<div class="col-sm-4">
            <div class="card">
                <div class="card-header" style="text-align: center;">
                    ${eachDiary.date.split('T')[0]}
                </div>
                <div class="card-body" style="position: relative;">
                <h5 class="card-title">${eachDiary.title}</h5>
                <p class="card-text">${description}</p>
                <span class="total-cost">${costTmp}</span>
                <a href="edit-diary.html?id=${eachDiary.id}" class="btn btn-primary">繼續閱讀</a>
                </div>
            </div>
        </div>`;
    }
    diaryCards.innerHTML = tmp;
}

function changeMonth(action){
	const dateTitle = document.getElementById('date-title');
	let titleYear = parseInt(dateTitle.innerHTML.split('-')[0]);
	let titleMonth = parseInt(dateTitle.innerHTML.split('-')[1]);
	if(action == 'prev'){
		titleMonth--;
		if(titleMonth == 0) {
			titleYear--;
			titleMonth = 12;
		}
	}
	else if(action == 'next'){
		titleMonth++;
		if(titleMonth == 13){
			titleYear++;
			titleMonth = 1;
		}
	}
	if(titleMonth < 10) titleMonth = "0" + parseInt(titleMonth);
	dateTitle.innerHTML = `${titleYear}-${titleMonth}`;
	getDiary();
}

function initialDate(){
	const dateTitle = document.getElementById('date-title');
	let today = new Date();
	let year = today.getFullYear();
	let month = today.getMonth();
	if(month+1 < 10) month = "0" + parseInt(month+1);
	dateTitle.innerHTML = `${year}-${month}`;
}

function init(){
	initialDate();
	getDiary();
	
	document.getElementById('prev').addEventListener('click', function(){changeMonth('prev')});
	document.getElementById('next').addEventListener('click', function(){changeMonth('next')});

}

window.addEventListener('load', init);