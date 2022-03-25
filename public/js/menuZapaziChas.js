

const dateElem = document.getElementById("date");

const btnSaveHour = document.getElementById("saveHour");

document.getElementById('formSaveHour').addEventListener('submit',postAppoitment);

btnSaveHour.addEventListener('click',returnHour);

DateSet();

async function postAppoitment(e){
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const date = formData.get('date');
    const time = formData.get('selectedHour');
    const name = formData.get('name');

    const serviceId = document.getElementById('service').dataset.id;

    if(time === ""){
        alert('Трябва да избереш час');
        return;
    }

    const data = {
        'date':date,
        'time':time,
        'name':name,
        'serviceId':serviceId
    }

    const response = await post('/saveAppoitment',data);

    if(response.status == 200){
        alert('Ти успешно запази час');
        window.location.href = '/myhours';
    }else if(response.status == 400){
        const error = JSON.parse(await response.text());
        alert(error.message);
        return
    }

}

async function returnHour(){

    const date = dateElem.value.split("-");
    const moduleDateElem = document.getElementById("moduleDate");
    moduleDateElem.textContent = date[1] + "-" + date[2] + "-" + date[0];
    const modelBody = document.querySelector('.modal-body');
    modelBody.textContent = '';

    const href = window.location.href;
    const id = href.slice(href.lastIndexOf('/') + 1);

    const response = await post('/appoitments',{'date':dateElem.value,'id': id});

    if(response.status == 400){
        const error = JSON.parse(await response.text());
        return alert(error.message);
    }

    const allFreeHours = JSON.parse(await response.text());

    if(Object.keys(allFreeHours.length !== 0)){
        allFreeHours.forEach(hour => {
        modelBody.append(hourVission(hour));
    });

    }else{
        const divRowElem = document.createElement('div');
        divRowElem.className = 'row mt-3';
        const divColElem = document.createElement('div');
        divColElem.className = 'col text-center fw-bold';
        const pHour = document.createElement('p');
        pHour.textContent = 'Няма Свободни Часове';
        pHour.className = 'fs-2';
        divColElem.append(pHour);
        divRowElem.append(divColElem);
        modelBody.append(divRowElem);
    }
    

}

async function post(url,data){

    const response = await fetch(url,{
        method:'post',

        headers:{
            'content-type':'application/json'
        },

        body: JSON.stringify(data)
    });

    return response;

}

function hourVission(info){
    const divRowElem = document.createElement('div');
    divRowElem.className = 'row mb-3';
    const divColElem = document.createElement('div');
    divColElem.className = 'col d-flex justify-content-between';
    const pHour = document.createElement('p');
    pHour.className = 'fs-3';
    pHour.textContent = info;
    const btnSelectHour = document.createElement('button');
    btnSelectHour.addEventListener('click',saveHour);
    btnSelectHour.setAttribute('data-bs-dismiss','modal');
    btnSelectHour.className = "btn btn-success w-25 p-0";
    btnSelectHour.textContent = "Запази";

    divColElem.append(pHour)
    divColElem.append(btnSelectHour)
    divRowElem.append(divColElem)

    return divRowElem;
}

function saveHour(e){
    const btn = e.target;

    const hour = btn.previousElementSibling.textContent;

    document.getElementById('selectedHour').value = hour;
}

function DateSet(){
    let today = new Date();

    let month = (today.getMonth() + 1) >= 10 ? (today.getMonth() + 1) : "0" + (today.getMonth() + 1);
    let day = today.getDate() >= 10 ? today.getDate() : "0" + today.getDate();
    
    const newDate = today.getFullYear() + "-" + month + "-" + day;
    
    dateElem.value = newDate;
    dateElem.min = newDate;

}
