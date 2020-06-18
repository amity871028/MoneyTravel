const costAPI = {
	all: "cost",
	new: "cost/new"
};

const incomeCategory = {
	allowance: "津貼",
	salary: "薪資",
	pocketMoney: "零用錢",
	bonus: "紅利",
	another: "其他"
}

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

const categoryToType = {
	food: ["早餐", "午餐", "晚餐", "飲料", "宵夜", "水果", "其他"],
	trafic: ["公車", "捷運", "計程車", "私家車", "停車費", "油費", "其他"],
	entertainment: ["書籍", "電影", "音樂", "應用程式", "唱歌", "其他"],
	home: ["電器", "傢俱", "廚房", "廁所用具", "雜貨", "租金", "其他"],
	dress: ["上衣", "褲子", "裙子", "連身褲/裙", "外套", "鞋子", "襪子", "飾品", "其他"],
	beauty: ["化妝品", "保養品", "防曬乳", "其他"],
	healthy: ["瑜珈", "醫院", "藥物", "健身", "其他"],
	educate: ["文具", "課本", "補習班", "影印費", "其他"],
	another: [""]
}

const weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
async function getCost(){
	const monthnYear = document.getElementById('date-title').innerHTML;
	console.log(monthnYear);
	const result = await FetchData.get(`${costAPI.all}?date=${monthnYear}`);
	let json = await result.json();

	const listDiv = document.getElementById('list');
	listDiv.innerHTML = "";
	let currentDate = "";
	json.forEach(eachCost => {
		let date = new Date(eachCost.time).getDate();
		if(currentDate != date) {
			let week = new Date(eachCost.time).getDay();
			currentDate = date;
			const tmpTable = document.createElement('table');
			tmpTable.setAttribute('class', "table table-hover");
			tmpTable.id = `table-${date}`;
			tmpTable.innerHTML = `<thead><tr>
					<th colspan="2"><span class="date">${date}</span><span class="badge badge-primary">${weeks[week]}</span>
					</th>
					<th class="income">$ <span id="income-${date}">0</span></th>
					<th class="cost">$ <span id="cost-${date}">0</span></th>
				</tr></thead><tbody id="tbody-${date}"></tbody>`;
				listDiv.appendChild(tmpTable);	
		}
		const tbody = document.getElementById(`tbody-${date}`);
		
		let tmpCostTd = "";
		let tmpCategoryTd
		if(eachCost.cost > 0) {
			tmpCategoryTd = `<td>${incomeCategory[eachCost.category]}<br> </td>`;
			tmpCostTd = `<td class="income">$ ${parseInt(eachCost.cost)}</td>`;
		}
		else if(eachCost.cost < 0){
			tmpCategoryTd = `<td>${category[eachCost.category]}<br>${categoryToType[eachCost.category][eachCost.type]}</td>`;
			tmpCostTd = `<td class="cost">$ ${parseInt(eachCost.cost)*(-1)}</td>`;
		}
		else {
			tmpCostTd = `<td>$ ${parseInt(eachCost.cost)}</td>`;
		}
		let tmp = `<tr id="${eachCost.id}" onclick="updateCost('${eachCost.id}')">${tmpCategoryTd}
				<td>${eachCost.description}<br><span class="assets">日常花費</span>
				</td>
				<td></td>
				${tmpCostTd}
			</tr>`;
		
		if(eachCost.cost < 0) {
			const cost = document.getElementById(`cost-${date}`);
			let tmpCost = parseInt(cost.innerHTML);
			tmpCost -= eachCost.cost;
			cost.innerHTML = tmpCost;

			const sumCost = document.getElementById('sum-cost');
			tmpCost = parseInt(sumCost.innerHTML);
			tmpCost -= eachCost.cost;
			sumCost.innerHTML = tmpCost;
		}
		else {
			const income = document.getElementById(`income-${date}`);
			let tmpCost = parseInt(income.innerHTML);
			tmpCost += eachCost.cost;
			income.innerHTML = tmpCost;
			
			const sumIncome = document.getElementById('sum-income');
			tmpCost = parseInt(sumIncome.innerHTML);
			tmpCost += eachCost.cost;
			sumIncome.innerHTML = tmpCost;
		}

	tbody.innerHTML += tmp;
	});
	const sum = document.getElementById('sum');
	const sumCost = document.getElementById('sum-cost').innerHTML;
	const sumIncome = document.getElementById('sum-income').innerHTML;
	sum.innerHTML = parseInt(sumIncome) - parseInt(sumCost);
}

async function updateCost(id){
	const result = await FetchData.put(`${costAPI.all}/${id}/update`, {
		id: id,
		time: new Date(),
		assets: 0,
		category: 'pocketMoney',
		type: -1,
		cost: 300,
		description: "test"
	});
	//$('#add-cost-modal').modal('show');
	/*if (document.forms['cost-form'].reportValidity()) {
		const dateTime = document.getElementById('cost-datetime').value;
		let timestamp = Date.parse(dateTime);
		let categorySelection = document.getElementById('category');
		let categorySelectedIndex = categorySelection.selectedIndex;
		let categoryValue = categorySelection.options[categorySelectedIndex].value;

		let cost = parseInt(document.getElementById('cost-cost').value);
		if(Object.keys(category).find(element => element == categoryValue)) cost *= -1;
		const result = await FetchData.put(costAPI.new, {
			id: id,
			time: timestamp,
			assets: document.getElementById('assets').selectedIndex,
			category: categoryValue,
			type: document.getElementById('type').selectedIndex,
			cost: cost,
			description: document.getElementById('cost-description').value
		});
		if(result.status == 201){
			alert('新增成功！');
		}
		else {
			alert('請再試一次！');
		}
	}*/
}

async function newCost(){
	if (document.forms['cost-form'].reportValidity()) {
		const dateTime = document.getElementById('cost-datetime').value;
		let timestamp = Date.parse(dateTime);
		let categorySelection = document.getElementById('category');
		let categorySelectedIndex = categorySelection.selectedIndex;
		let categoryValue = categorySelection.options[categorySelectedIndex].value;

		console.log(timestamp);
		let cost = parseInt(document.getElementById('cost-cost').value);
		if(Object.keys(category).find(element => element == categoryValue)) cost *= -1;
		const result = await FetchData.post(costAPI.new, {
			time: timestamp,
			assets: document.getElementById('assets').selectedIndex,
			category: categoryValue,
			type: document.getElementById('type').selectedIndex,
			cost: cost,
			description: document.getElementById('cost-description').value
		});
		if(result.status == 201){
			alert('新增成功！');
		}
		else {
			alert('請再試一次！');
		}
	}
}

function updateType(){
	const typeSelection = document.getElementById('type');
	typeSelection.options.length = 0;
	let categoryId = $('#category :selected').val();
	categoryToType[categoryId].forEach((type, idx) =>{
		let option = document.createElement("option");
		option.text = type;
		option.value = idx;

		typeSelection.add(option);
	});
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
	getCost();
}

function updateModal(action){
	console.log(action);
	const categorySelection = document.getElementById('category');
	const typeSelection = document.getElementById('type');
	categorySelection.options.length = 0;
	typeSelection.options.length = 0;
	if(action == "income"){
		for(categoryKey in incomeCategory){
			let option = document.createElement("option");
			option.text = incomeCategory[categoryKey];
			option.value = categoryKey;
			categorySelection.add(option);
		}
		document.getElementById('type').style = "display:none;"
	}
	else if(action == "cost") {
		for(categoryKey in category){
			let option = document.createElement("option");
			option.text = category[categoryKey];
			option.value = categoryKey;
			categorySelection.add(option);
		}
		document.getElementById('type').style = "display:initial;"
		updateType();
	}
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
	getCost();
	updateType();
	
	document.getElementById('prev').addEventListener('click', function(){changeMonth('prev')});
	document.getElementById('next').addEventListener('click', function(){changeMonth('next')});

	document.getElementById('income-tab').addEventListener('click', function(){updateModal('income')});
	document.getElementById('cost-tab').addEventListener('click', function(){updateModal('cost')});

	document.getElementById('category').addEventListener('change', updateType);

	document.getElementById('add-cost-btn').addEventListener('click', newCost);
}

window.addEventListener('load', init);