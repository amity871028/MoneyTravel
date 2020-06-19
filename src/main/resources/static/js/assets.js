const assetsAPI = {
    exchangeRate: "assets/exchangeRate",
    new: "assets/new"
}

async function newAssets(){
	if (document.forms['assets-form'].reportValidity()) {
        const result = await FetchData.post(assetsAPI.new, {
            name: document.getElementById('assets-name').value,
            currencyCountry: $('#country :selected').val(),
            currency: window.exchangeRate
        });
        if(result.status == 201){
            alert('新增成功！');
            $("#add-assets-modal").modal('hide');
            //getAssets();
		}
		else {
			alert('請再試一次！');
		}
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
    //getAssets();
    initialCountry();
    //updateType();
    
	document.getElementById('country').addEventListener('change', updateExchangeRate);

	document.getElementById('add-assets-btn').addEventListener('click', newAssets);
}

window.addEventListener('load', init);