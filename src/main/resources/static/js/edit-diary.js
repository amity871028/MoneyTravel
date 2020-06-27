const diaryAPI = {
	allCost: "cost",
	newCost: "cost/new/getId",
    assets: "assets",
	newDiary: "diary/new",
	oneDiary: "diary"
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

function delayURL(url, time) {
    setTimeout(() => { window.location.href = `${url}`; }, time);
}

async function getDiary(){
	var url = location.href;
	if(url.match("id=")) idPosition = url.match("id=").index + 3;
	else return;
	var id = url.substring(idPosition);
	document.getElementById("date").readOnly = true;
	document.getElementById('delete-diary-btn').setAttribute("style", "display: initial");
	document.getElementById('new-cost-btn').setAttribute("style", "display: none");
	document.getElementById('ok-btn').setAttribute("style", "display: none");
	document.getElementById('back').setAttribute("style", "display: initial");

	let result = await FetchData.get(`${diaryAPI.oneDiary}/${id}`);
	const detail = await result.json();

	document.getElementById('date').value = detail.date.split('T')[0];
	document.getElementById('title').value = detail.title;
	document.getElementById('title').setAttribute('readonly', "readonly");
	document.getElementById('description').value = detail.description;
	document.getElementById('description').setAttribute('readonly', "readonly");

	let tmp = [];
	for(let i in detail.costId){
		result = await FetchData.get(`${diaryAPI.allCost}/${detail.costId[i]}`);
		tmp.push(await result.json());
	}
	localStorage.setItem('cost', JSON.stringify(tmp));
}

async function newDiary(){
    
	if (document.forms['diary-form'].reportValidity()) {
        const date = document.getElementById('date').value;
        let timestamp = Date.parse(date);
        let costIds = await newCosts();    
        const result = await FetchData.post(diaryAPI.newDiary, {
            date: timestamp,
            title: document.getElementById('title').value,
            costId: costIds,
            description: document.getElementById('description').value
        });
        
        if(result.status == 201){
            alert("新增成功！將為你導入日記頁面");
            localStorage.removeItem('cost');
            delayURL('./diary.html', 800);

        }
        else {
            alert("請再重試一次！");
        }
    }
}

async function newCosts(){
    let allCosts = [];
    if(localStorage.getItem('cost')) allCosts = JSON.parse(localStorage.getItem('cost'));
    else return [];
    let costsId = [];
    for(cost of allCosts){
        const date = document.getElementById('date').value;
        let timestamp = Date.parse(date);
        cost.time = timestamp;

        const result = await FetchData.post(diaryAPI.newCost, {
            time: cost.time,
            assets: cost.assets,
            category: cost.category,
            type: cost.type,
            cost: cost.cost,
            description: cost.description
        });

        let json = await result.json();
        
        if(result.status != 200){
            alert('失敗！');
        }
        else costsId.push(json.id);
    }
    return costsId;
}

function updateCostModal(index){
	const allCosts =  JSON.parse(localStorage.getItem('cost'));

	$("#assets").find(`option`).attr('selected',false);
	$("#assets").find(`option:contains(${allCosts[index].assets})`).attr('selected',true);
	$(`#category option`).attr('selected',false);
	$(`#category option[value="${allCosts[index].category}"]`).attr('selected',true);
	updateType();
	$('#type option')[allCosts[index].type].selected = true; 
	if(allCosts[index].cost < 0)document.getElementById('cost-cost').value = parseFloat(allCosts[index].cost * (-1));
	else document.getElementById('cost-cost').value = allCosts[index].cost;
	document.getElementById('cost-description').value = allCosts[index].description;

	document.getElementById('add-cost-btn').setAttribute("style", "display: none");
	document.getElementById('update-cost-btn').setAttribute("style", "display: initial");
	document.getElementById('delete-cost-btn').setAttribute("style", "display: initial");
	document.getElementById('cost-id').innerHTML = index;
	$('#add-cost-modal').modal('show');
}

function newCostToLocalStorage(){
	const idSpan = document.getElementById('cost-id');
	if (document.forms['cost-form'].reportValidity()) {
		const date = document.getElementById('date').value;
		let timestamp = Date.parse(date);
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
        let tmpJson = {
            time: timestamp,
            assets: assets,
            category: categoryValue,
            type: document.getElementById('type').selectedIndex,
            cost: cost,
            description: document.getElementById('cost-description').value
		};
		let crtJson = [];
		if(localStorage.getItem('cost')) crtJson = JSON.parse(localStorage.getItem('cost'));
		let idSpan = document.getElementById('cost-id');
		if(idSpan.innerHTML != -1){
			crtJson[idSpan.innerHTML] = tmpJson;
			idSpan.innerHTML = -1;
			alert('修改成功！');
		}
		else{
			crtJson.push(tmpJson);
			alert('新增成功！');
		}
		
		localStorage.setItem('cost', JSON.stringify(crtJson));
		getCost();
		$("#add-cost-modal").modal('hide');
	}
}

async function deleteCost(){
	const idSpan = document.getElementById('cost-id');
	
	const allCost = JSON.parse(localStorage.getItem('cost'));
	allCost.splice(idSpan.innerHTML, 1);
	idSpan.innerHTML = -1;
	alert('刪除成功！');
	localStorage.setItem('cost', JSON.stringify(allCost));
	getCost();
	$('#add-cost-modal').modal('hide');
}

async function getCost(){
    let allCosts = "";
    if(localStorage.getItem('cost')) allCost = JSON.parse(localStorage.getItem('cost'));
    else return;
	let result = await FetchData.get(diaryAPI.assets);
	let assetsJson = await result.json();

    const costList = document.getElementById('cost-list');
    let tmp = "";
	let index = 0;
    allCost.forEach(eachCost => {
        let tmpCostTd = "";
        let tmpCategoryTd;
        let symbol = "";
		let toNTDollar = 0;
        assetsJson.forEach(eachAssets => {
            if(eachCost.assets == eachAssets.name){
                let index = currencyName.findIndex(element => element == eachAssets.currencyCountry);
                if(index == 0) return;
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

        }
        else if(eachCost.cost < 0){
            tmpCategoryTd = `<td>${category[eachCost.category]}<br>${categoryToType[eachCost.category][eachCost.type]}</td>`;
            if(toNTDollar == 0) tmpCostTd = `<td class="cost">$ ${parseFloat(eachCost.cost)*(-1)}</td>`;
            else  tmpCostTd = `<td class="cost">${symbol} ${parseFloat(eachCost.cost)*(-1)} ($ ${toNTDollar*(-1)})</td>`;
        
		}
		
		let url = location.href;
		if(url.match("id=")) {
			tmp += `<tr>${tmpCategoryTd}
					<td>${eachCost.description}<br><span class="assets">${eachCost.assets}</span>
					</td>
					${tmpCostTd}
				</tr>`;
		}
		else {
			tmp += `<tr onclick="updateCostModal(${index})">${tmpCategoryTd}
					<td>${eachCost.description}<br><span class="assets">${eachCost.assets}</span>
					</td>
					${tmpCostTd}
				</tr>`;
			index+=1;
		}
    });
    costList.innerHTML = tmp;
}

async function deleteDiary(){
	let url = location.href;
	idPosition = url.match("id=").index + 3;
	let id = url.substring(idPosition);
	const result = await FetchData.delete(`${diaryAPI.oneDiary}/${id}/delete`);
	alert("刪除成功！(記帳記錄還是會存在哦！)");
	delayURL('./diary.html', 800);
}

function clearModal(){
	$("#assets").find(`option`).attr('selected', false);
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
	const result = await FetchData.get(diaryAPI.assets);
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

function init(){
	localStorage.removeItem('cost');
	getDiary();
	updateAssets();
	updateType();
	
	document.getElementById('category').addEventListener('change', updateType);

	document.getElementById('income-tab').addEventListener('click', function(){updateModal('income')});
    document.getElementById('cost-tab').addEventListener('click', function(){updateModal('cost')});
    
	document.getElementById('add-cost-btn').addEventListener('click', newCostToLocalStorage);
	document.getElementById('update-cost-btn').addEventListener('click', newCostToLocalStorage);
    document.getElementById('delete-cost-btn').addEventListener('click', deleteCost);
    
	document.getElementById('delete-diary-btn').addEventListener('click', deleteDiary);
    document.getElementById('ok-btn').addEventListener('click', newDiary);
}

window.addEventListener('load', init);