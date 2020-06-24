const costAPI = {
	all: "cost",
	new: "cost/new",
	assets: "assets"
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

const currencyName = ["台幣", "美金", "歐元", "日幣", "港幣", "英鎊", "人民幣", "韓幣(南韓)"];
const currencySymbol = ["$", "US$", "€", "JP¥", "HK$", "£", "CN¥", "₩"];
const weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

async function getCost(){
	document.getElementById('sum').innerHTML = 0;
	document.getElementById('sum-cost').innerHTML = 0;
	document.getElementById('sum-income').innerHTML = 0;

	let result = await FetchData.get(costAPI.assets);
	let assetsJson = await result.json();

	const monthnYear = document.getElementById('date-title').innerHTML;
	result = await FetchData.get(`${costAPI.all}?date=${monthnYear}`);
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
			tmpTable.innerHTML = `<thead><tr onclick="updateCostModal('${eachCost.id}')">
					<th colspan="2"><span class="date">${date}</span><span class="badge badge-primary">${weeks[week]}</span>
					</th>
					<th class="income">$ <span id="income-${date}">0</span></th>
					<th class="cost">$ <span id="cost-${date}">0</span></th>
				</tr></thead><tbody id="tbody-${date}"></tbody>`;
				listDiv.appendChild(tmpTable);	
		}
		const tbody = document.getElementById(`tbody-${date}`);
		
		let tmpCostTd = "";
		let tmpCategoryTd;
		let symbol = "";
		let toNTDollar = 0;
		assetsJson.forEach(eachAssets => {
			if(eachCost.assets == eachAssets.name){
				let index = currencyName.findIndex(element => element == eachAssets.currencyCountry);
				if(index == 0) {
					return;
				}
				symbol = currencySymbol[index];
				toNTDollar = (eachCost.cost / eachAssets.currency).toFixed(2);
			}
		});
		
		if(toNTDollar == 0) tmpCostTd = `<td>$ 0</td>`;
		else tmpCostTd = `<td>${symbol} 0 ($ 0)</td>`;

		if(eachCost.cost > 0) {
			tmpCategoryTd = `<td>${incomeCategory[eachCost.category]}<br> </td>`;
			if(toNTDollar == 0) tmpCostTd = `<td class="income">$ ${parseFloat(eachCost.cost)}</td>`;
			else tmpCostTd = `<td class="income">${symbol} ${parseFloat(eachCost.cost)} ($ ${toNTDollar})</td>`;

			const income = document.getElementById(`income-${date}`);
			const sumIncome = document.getElementById('sum-income');
			let tmpCost1 = parseFloat(income.innerHTML);
			let tmpCost2 = parseFloat(sumIncome.innerHTML);
			if(toNTDollar == 0) {
				tmpCost1 += parseFloat(eachCost.cost);
				tmpCost2 += parseFloat(eachCost.cost);
			}
			else {
				tmpCost1 += parseFloat(toNTDollar);
				tmpCost2 += parseFloat(toNTDollar);
			}
			income.innerHTML = tmpCost1.toFixed(2);
			sumIncome.innerHTML = tmpCost2.toFixed(2);
		}
		else if(eachCost.cost < 0){
			tmpCategoryTd = `<td>${category[eachCost.category]}<br>${categoryToType[eachCost.category][eachCost.type]}</td>`;
			if(toNTDollar == 0) tmpCostTd = `<td class="cost">$ ${parseFloat(eachCost.cost)*(-1)}</td>`;
			else  tmpCostTd = `<td class="cost">${symbol} ${parseFloat(eachCost.cost)*(-1)} ($ ${toNTDollar*(-1)})</td>`;
		
			const cost = document.getElementById(`cost-${date}`);
			const sumCost = document.getElementById('sum-cost');
			let tmpCost1 = parseFloat(cost.innerHTML);
			let tmpCost2 = parseFloat(sumCost.innerHTML);
			if(toNTDollar == 0) {
				tmpCost1 -= eachCost.cost;
				tmpCost2 -= eachCost.cost;
			}
			else {
				tmpCost1 -= toNTDollar;
				tmpCost2 -= toNTDollar;
			}
			cost.innerHTML = tmpCost1.toFixed(2);
			sumCost.innerHTML = tmpCost2.toFixed(2);
		
		}
		let tmp = `<tr id="${eachCost.id}" onclick="updateCostModal('${eachCost.id}')">${tmpCategoryTd}
				<td>${eachCost.description}<br><span class="assets">${eachCost.assets}</span>
				</td>
				<td></td>
				${tmpCostTd}
			</tr>`;
			
	tbody.innerHTML += tmp;
	});
	const sum = document.getElementById('sum');
	const sumCost = document.getElementById('sum-cost').innerHTML;
	const sumIncome = document.getElementById('sum-income').innerHTML;
	sum.innerHTML = parseFloat(sumIncome) - parseFloat(sumCost);
}

async function updateCostModal(id){
	const result = await FetchData.get(`${costAPI.all}/${id}`);
	const detail = await result.json();
	let date = new Date(detail.time).toLocaleDateString();
	if(date.split('/')[1].length == 1) {
		let tmp = '0' + date.split('/')[1];
		date = `${date.split('/')[0]}/${tmp}/${date.split('/')[2]}`;
	}
	if(date.split('/')[2].length == 1) {
		let tmp = '0' + date.split('/')[2];
		date = `${date.split('/')[0]}/${date.split('/')[1]}/${tmp}`;
	}
	date = date.replace(new RegExp('/', 'g'), '-');
	let time = new Date(detail.time).toTimeString().split(' ')[0];
	document.getElementById('cost-datetime').value = `${date}T${time}`;
	$("#assets").find(`option`).attr('selected',false);
	$("#assets").find(`option:contains(${detail.assets})`).attr('selected',true);
	$(`#category option`).attr('selected',false);
	$(`#category option[value="${detail.category}"]`).attr('selected',true);
	updateType();
	$('#type option')[detail.type].selected = true; 
	if(detail.cost < 0)document.getElementById('cost-cost').value = parseFloat(detail.cost * (-1));
	else document.getElementById('cost-cost').value = detail.cost;
	document.getElementById('cost-description').value = detail.description;

	document.getElementById('add-cost-btn').setAttribute("style", "display: none");
	document.getElementById('update-cost-btn').setAttribute("style", "display: initial");
	document.getElementById('delete-cost-btn').setAttribute("style", "display: initial");
	document.getElementById('cost-id').innerHTML = id;
	$('#add-cost-modal').modal('show');
}

async function newCost(){
	const idSpan = document.getElementById('cost-id');
	if (document.forms['cost-form'].reportValidity()) {
		const dateTime = document.getElementById('cost-datetime').value;
		let timestamp = Date.parse(dateTime);
		let assetsSelection = document.getElementById('assets');
		let assetsSelectedIndex = assetsSelection.selectedIndex;
		let assets = assetsSelection.options[assetsSelectedIndex].innerHTML;
		
		let categorySelection = document.getElementById('category');
		let categorySelectedIndex = categorySelection.selectedIndex;
		let categoryValue = categorySelection.options[categorySelectedIndex].value;

		let cost = parseInt(document.getElementById('cost-cost').value);
		if(Object.keys(category).find(element => element == categoryValue)) {
			if(categoryValue == "another" && categorySelectedIndex != 8) ;
			else cost *= -1;
		}
		if(idSpan.innerHTML == -1){
			const result = await FetchData.post(costAPI.new, {
				time: timestamp,
				assets: assets,
				category: categoryValue,
				type: document.getElementById('type').selectedIndex,
				cost: cost,
				description: document.getElementById('cost-description').value
			});
			if(result.status == 201){
				alert('新增成功！');
				$("#add-cost-modal").modal('hide');
				getCost();
			}
			else {
				alert('請再試一次！');
			}
		}
		else {
			const result = await FetchData.put(`${costAPI.all}/${idSpan.innerHTML}/update`, {
				time: timestamp,
				assets: assets,
				category: categoryValue,
				type: document.getElementById('type').selectedIndex,
				cost: cost,
				description: document.getElementById('cost-description').value
			});
			if(result.status == 200){
				alert('修改成功！');
				$("#add-cost-modal").modal('hide');
				getCost();
			}
			else {
				alert('請再試一次！');
			}
			idSpan.innerHTML = -1;
		}
	}
}

async function deleteCost(){
	const idSpan = document.getElementById('cost-id');
	const result = await FetchData.delete(`${costAPI.all}/${idSpan.innerHTML}/delete`);
	if(result.status == 204){
		alert('刪除成功！');
		getCost();
	}	
	else {
		alert('請再試一次！');
	}
	idSpan.innerHTML = -1;
	$('#add-cost-modal').modal('hide');
}
function clearModal(){
	document.getElementById('cost-datetime').value = "";
	$("#assets").find(`option`).attr('selected',false);
	$('#assets option')[0].selected = true; 
	$(`#category option`).attr('selected',false);
	$("#category").find(`option:contains(食物)`).attr('selected',true);
	updateType();
	document.getElementById('cost-cost').value = "";
	document.getElementById('cost-description').value = "";

	document.getElementById('add-cost-btn').setAttribute('style', 'display: initial;');
	document.getElementById('update-cost-btn').setAttribute('style', 'display: none;');
	document.getElementById('delete-cost-btn').setAttribute('style', 'display: none;');
	
	document.getElementById(`cost-id`).innerHTML = -1;
}

async function updateAssets(){
	const assetsSelection = document.getElementById('assets');
	const result = await FetchData.get(costAPI.assets);
	const json = await result.json();
	json.forEach(assets =>{
		let option = document.createElement("option");
		option.text = assets.name;
		option.value = assets.id;
		assetsSelection.add(option);
	});
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
	updateAssets();
	updateType();
	
	document.getElementById('prev').addEventListener('click', function(){changeMonth('prev')});
	document.getElementById('next').addEventListener('click', function(){changeMonth('next')});

	document.getElementById('income-tab').addEventListener('click', function(){updateModal('income')});
	document.getElementById('cost-tab').addEventListener('click', function(){updateModal('cost')});

	document.getElementById('category').addEventListener('change', updateType);

	document.getElementById('add-cost-btn').addEventListener('click', newCost);
	document.getElementById('update-cost-btn').addEventListener('click', newCost);
	document.getElementById('delete-cost-btn').addEventListener('click', deleteCost);
}

window.addEventListener('load', init);