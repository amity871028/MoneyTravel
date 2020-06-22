const statisticAPI = {
	all: "cost"
};

const categoryName = ["食物", "交通", "休閒娛樂", "家居", "服飾", "美容", "健康", "教育", "其他"];
const categoryColor = ["#FF9999", "#FFCC99", "#F5FAC8", "#99CC66", "#99CCFF", "#336699", "#CC99CC", "#E7E3C5", "#606470"];
const category = {
	food: "食物",
	trafic: "交通",
	entertainment: "休閒娛樂",
	home: "家居",
	dress: "服飾",
	beauty: "美容",
	healthy: "健康",
	educate: "教育",
	another: "其他"
};
const incomeCategoryName = ["津貼", "薪資", "零用錢", "紅利", "其他"];
const incomeCategory = {
	allowance: "津貼",
	salary: "薪資",
	pocketMoney: "零用錢",
	bonus: "紅利",
	another: "其他"
}

function drawCanvas(type, eachTotal, name){
    let ctx;
    if(type == 'expenses') ctx = document.getElementById("expenses-chart").getContext('2d');
    else ctx = document.getElementById("income-chart").getContext('2d');
    let cost = [];
    let i = 0;
    let count = 0;
    for(eachTotalCostKey in eachTotal){
        cost[i] = eachTotal[eachTotalCostKey];
        if(cost[i] == 0) count++;
        i++;
    }
	if(count == cost.length){
		let myChart = new Chart(ctx, {
		    type: 'pie',
		    data: {
		        labels: ["無"],
		        datasets: [{            
		            data: [1],
		            backgroundColor: [
		                '#a8d8ea'
		            ],
		            borderWidth: 1
		        }]
		    },
		    options: {}
		});
	}
	else {
		let myChart = new Chart(ctx, {
		    type: 'pie',
		    data: {
		        labels: name,
		        datasets: [{            
		            data: cost,
		            backgroundColor: categoryColor,
		            borderWidth: 1
		        }]
		    },
		    options: {}
		});
	}
}

async function getAll(){
	const monthnYear = document.getElementById('date-title').innerHTML;
    const result = await FetchData.get(`${statisticAPI.all}?date=${monthnYear}`);
    const json = await result.json();
    console.log(json);

    let eachTotalCost = {
      food: 0,
      trafic: 0,
      entertainment: 0,
      home: 0,
      dress: 0,
      beauty: 0,
      healthy: 0,
      educate: 0,
      another: 0
    };

    let eachTotalIncome = {
        allowance: 0,
        salary: 0,
        pocketMoney: 0,
        bonus: 0,
        another: 0
    }
    let totalCost = 0;
    let totalIncome = 0;
    json.forEach(cost => {
        if(cost.cost < 0){
            for(categoryKey in category){
                //console.log(categoryKey);
                if(cost.category == categoryKey){
                    eachTotalCost[categoryKey] -= cost.cost;
                    totalCost -= cost.cost;
                }
            }
        }
        else {
            for(categoryKey in incomeCategory){
                if(cost.category == categoryKey){
                    eachTotalIncome[categoryKey] += cost.cost;
                    totalIncome += cost.cost;
                }
            }
        }
    });

    const expensesTbody = document.getElementById('expenses-tbody');
    let tmp = "";
    let i = 0;
    for(categoryKey in category){
        if(totalCost == 0) break;
        let persent = (eachTotalCost[categoryKey]*100 / totalCost).toFixed(1);
        if(persent != 0.0){
            tmp += `<tr>
            <td><span class="badge" style="background-color: ${categoryColor[i]};">${persent}%</span></td>
                    <td>${category[categoryKey]}</td>
                    <td>$ ${eachTotalCost[categoryKey]}</td>
                </tr>`;
        }
        i++;
    }
    expensesTbody.innerHTML = tmp;
    drawCanvas('expenses', eachTotalCost, categoryName);

    const incomeTbody = document.getElementById('income-tbody');
    tmp = "";
    i = 0;
    for(categoryKey in incomeCategory){
        if(totalIncome == 0) break;
        persent = (eachTotalIncome[categoryKey]*100 / totalIncome).toFixed(1);
        if(persent != 0.0){
            tmp += `<tr>
            <td><span class="badge" style="background-color: ${categoryColor[i]};">${persent}%</span></td>
                    <td>${incomeCategory[categoryKey]}</td>
                    <td>$ ${eachTotalIncome[categoryKey]}</td>
                </tr>`;
        }
        i++;
    }
    incomeTbody.innerHTML = tmp;
    drawCanvas('income', eachTotalIncome, incomeCategoryName);
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
	getAll();
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
	getAll();
	document.getElementById('prev').addEventListener('click', function(){changeMonth('prev')});
	document.getElementById('next').addEventListener('click', function(){changeMonth('next')});
}

window.addEventListener('load', init);