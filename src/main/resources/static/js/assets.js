const assetsAPI = {
    one: "assets",
    all: "cost/assetsCost",
    exchangeRate: "assets/exchangeRate",
    newAssets: "assets/new",
    newCost: "cost/new"
}

const currencyName = ["台幣", "美金", "歐元", "日幣", "港幣", "英鎊", "人民幣", "韓幣(南韓)"];
const currencySymbol = ["$", "US$", "€", "JP¥", "HK$", "£", "CN¥", "₩"];

async function getAssets(){
    let result = await FetchData.get(assetsAPI.all);
    const json = await result.json();

    console.log(json);
    const assetsTbody = document.getElementById('assets-tbody');
    const negative = document.getElementById('negative');
    negative.innerHTML = 0;
    const positive = document.getElementById('positive');
    positive.innerHTML = 0;
    const total = document.getElementById('total');
    total.innerHTML = 0;
    let tmp = "";
    for(let assets of json){
        console.log(assets);
    //json.forEach(assets => {
        result = await FetchData.get(`${assetsAPI.one}/${assets.assetsId}`);
        const detail = await result.json();
        console.log(detail);
		let symbol = "";
		let toNTDollar = 0;
		
        let index = currencyName.findIndex(element => element == detail.currencyCountry);
        if(index != 0) {
            symbol = currencySymbol[index];
            toNTDollar = (assets.totalCost / detail.currency).toFixed(2);
            console.log(toNTDollar);
        }
		
        let totalCost = 0;
        let tmpTotalCostTd = "";
        if(toNTDollar == 0) tmpTotalCostTd = `<td>$ 0</td>`;
        else tmpTotalCostTd = `<td>${symbol} 0 ($ 0)</td>`

        if(assets.totalCost < 0){
            if(toNTDollar == 0) {
                tmpTotalCostTd = `<td class="cost">$ ${assets.totalCost * (-1)}</td>`;
                negative.innerHTML = parseFloat(negative.innerHTML) - assets.totalCost;
            }
            else {
                tmpTotalCostTd = `<td class="cost">${symbol} ${assets.totalCost * (-1)} ($ ${toNTDollar*(-1)})</td>`;
                negative.innerHTML = parseFloat(negative.innerHTML) - toNTDollar;
            }
        }
        else if(assets.totalCost > 0){
            if(toNTDollar == 0) {
                tmpTotalCostTd = `<td class="income">$ ${assets.totalCost}</td>`;
                positive.innerHTML = parseFloat(positive.innerHTML) + assets.totalCost;
            }
            else {
                tmpTotalCostTd = `<td class="income">${symbol} ${assets.totalCost} ($ ${toNTDollar})</td>`;
                positive.innerHTML = parseFloat(positive.innerHTML) + toNTDollar;
            }
        }
        tmp += `<tr onclick="updateAssetsModal('${assets.assetsId}', ${assets.totalCost})">
                <td>${assets.assets}</td>
                ${tmpTotalCostTd}
            </tr>`;
    //});
    }
    assetsTbody.innerHTML = tmp;
    total.innerHTML = parseFloat(positive.innerHTML) - parseFloat(negative.innerHTML);

}

async function newAssets(){
	const idSpan = document.getElementById('assets-id');
	if (document.forms['assets-form'].reportValidity()) {
        
		if(idSpan.innerHTML == -1){
            let result = await FetchData.post(assetsAPI.newAssets, {
                name: document.getElementById('assets-name').value,
                currencyCountry: $('#country :selected').text(),
                currency: window.exchangeRate
            });
            if(result.status == 201){
                alert('新增成功！');
                $("#add-assets-modal").modal('hide');
                getAssets();

                const currentMoney = document.getElementById('assets-money');
                if(currentMoney.value != 0){
                    result = await FetchData.post(assetsAPI.newCost, {
                        time: Date.parse(new Date()),
                        assets: document.getElementById('assets-name').value,
                        category: "another",
                        type: -1,
                        cost: currentMoney.value,
                        description: "修正差額"
                    });
                }
            }
            else {
                alert('請再試一次！');
            }
        }
        else {
            result = await FetchData.put(`${assetsAPI.one}/${idSpan.innerHTML}/update`, {
                name: document.getElementById('assets-name').value,
                currencyCountry: $('#country :selected').text(),
                currency: window.exchangeRate
            });
            if(result.status == 200){
                alert('修改成功！');
                $("#add-assets-modal").modal('hide');
                getAssets();
            }
            else {
                alert('請再試一次！');
            }
        }
        idSpan.innerHTML = -1;
    }
}

async function initialCountry(){
    const countrySelection = document.getElementById('country');
    const result = await FetchData.get(assetsAPI.exchangeRate);
    const json = await result.json();
    json.forEach(each => {
        let option = document.createElement("option");
        option.text = each.countryCH;
        option.value = each.countryEN;
        countrySelection.add(option);
    });
    updateExchangeRate();
}

async function updateAssetsModal(id, currentMoney){
    const result = await FetchData.get(`${assetsAPI.one}/${id}`);
    const detail = await result.json();
    console.log(detail);
    document.getElementById('assets-name').value = detail.name;
    document.getElementById('assets-money').value = currentMoney;
    document.getElementById('assets-money').disabled = true;
    $("#country").find(`option`).attr('selected',false);
    $("#country").find(`option:contains(${detail.currencyCountry})`).attr('selected',true);
    updateExchangeRate();
	
    document.getElementById('add-assets-btn').setAttribute('style', 'display: none;');
    document.getElementById('update-assets-btn').setAttribute('style', 'display: initial;');
    document.getElementById('delete-assets-btn').setAttribute('style', 'display: initial;');
    
	document.getElementById(`assets-id`).innerHTML = id;

    $('#add-assets-modal').modal('show');
}

async function deleteAssets(){
	const idSpan = document.getElementById('assets-id');
    const result = await FetchData.delete(`${assetsAPI.one}/${idSpan.innerHTML}/delete`);
    
	if(result.status == 204){
		alert('刪除成功！');
		getAssets();
	}	
	else {
		alert('請再試一次！');
    }
    idSpan.innerHTML = -1;
	$('#add-assets-modal').modal('hide');
}

async function clearModal(){
    document.getElementById('assets-name').value = "";
    document.getElementById('assets-money').value = "";
    document.getElementById('assets-money').disabled = false;
	$("#country").find(`option`).attr('selected',false);
    $('#country option')[0].selected = true; 
    updateExchangeRate();

	document.getElementById('add-assets-btn').setAttribute('style', 'display: initial;');
	document.getElementById('update-assets-btn').setAttribute('style', 'display: none;');
    document.getElementById('delete-assets-btn').setAttribute('style', 'display: none;');
    
	document.getElementById(`assets-id`).innerHTML = -1;
}

async function updateExchangeRate(){
    let categoryValue = $('#country :selected').val();
    const exchangeRateSpan = document.getElementById('exchange-rate');
    const result = await FetchData.get(assetsAPI.exchangeRate);
    const json = await result.json();
    json.forEach(each => {
        if(categoryValue == each.countryEN){
            exchangeRateSpan.innerHTML = `1 : ${each.exchangeRate} (1台幣可換算幣額)`;
            window.exchangeRate = each.exchangeRate;
        }
    });
}

function init(){
    getAssets();
    initialCountry();
    //updateType();
    
	document.getElementById('country').addEventListener('change', updateExchangeRate);

	document.getElementById('add-assets-btn').addEventListener('click', newAssets);
	document.getElementById('update-assets-btn').addEventListener('click', newAssets);
	document.getElementById('delete-assets-btn').addEventListener('click', deleteAssets);
}

window.addEventListener('load', init);