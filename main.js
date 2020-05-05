let mainUrl = `https://swapi.dev/api/`;
let fetchList;
let searchList
let fetchPreloader = document.getElementById('fetchPreloader');


function startFetch() {
    if (fetchList) {
        fetchList.remove();
    }
    fetchList = document.createElement('ul');
    let prop = document.getElementById('propTypeFetch').value;
    fetchPreloader.style.display = "block";
    let fetchButton = document.getElementById('fetchButton');
    let promise = fetch(mainUrl + prop).then(response => response.json()).then(data => fetch(data.results[0].url))
        .then(response => response.json()).then(data => {

            for (key in data) {
                if (typeof (data[key]) == "object") {
                    let subList = document.createElement('ol');
                    subList.innerHTML = `${key}`;
                    for (let i = 0; i < data[key].length; i++) {
                        let subListItem = document.createElement('li');

                        fetch(data[key][i]).then(response => response.json())
                            .then(data => {
                                subListItem.innerHTML = `<span>${data.name || data.title}</span>`;
                                subList.append(subListItem);
                            });


                    };
                    fetchList.append(subList);
                } else {
                    let listElem = document.createElement('li');
                    listElem.innerHTML = `${key} : <span>${data[key]}</span>;`
                    fetchList.append(listElem);
                }
            }
            fetchPreloader.style.display = "none";

            fetchButton.after(fetchList);
            let closeList = document.createElement('button');
            closeList.addEventListener('click', function () {
                fetchList.remove();
                closeList.style.display = "none";
            })
            closeList.innerHTML = "Close list";
            console.log(closeList);
            fetchList.after(closeList);


        });

}

function startSearch() {
    if (searchList) {
        searchList.remove();
    }
    searchList = document.createElement('ul');
    searchPreloader.style.display = "block";
    let searchButton = document.getElementById('searchButton');
    let prop = document.getElementById('propTypeSearch').value;
    let searchValue = document.getElementById('searchInput').value;
    if (!searchValue) {
        searchList.innerHTML = `<div>Input value required.</div>`;
        searchPreloader.style.display = "none";
        searchButton.after(searchList);
    }
    fetch(mainUrl + `${prop}/?search=${searchValue}`).then(response => response.json())
        .then(data => {
            if (data.count === 0) {
                searchList.innerHTML = `<div>No such value "${searchValue}" in "${prop}" category</div>`;
                searchPreloader.style.display = "none";
                searchButton.after(searchList);

            }

            if (data.results.length === 1) {
                let obj = data.results[0];
                console.log('obj: ', obj);
                for (key in obj) {
                    if (key === "homeworld") {
                        let home = key;
                        console.log('key before fetch: ', key);
                        console.log('obj[key]: ', obj[key]);
                        /*Чому я не можу в 96 рядку замісь ${home} прописати ${key}, чому значення key з homeworld  змінюється на url?*/
                        fetch(obj[key]).then(response => response.json())
                            .then(data => {
                                console.log('fetch data :', data);
                                console.log('key in fetch: ', key);
                                console.log('fetch data[key]: ', data[key]);
                                let listElem = document.createElement('li');
                                listElem.innerHTML = `${home} : <span>${data.name}</span>;`
                                searchList.append(listElem);
                            });
                    }
                    else
                        if (typeof (obj[key]) == "object") {
                            let subList = document.createElement('ol');
                            subList.innerHTML = `${key}`;
                            for (let i = 0; i < obj[key].length; i++) {
                                let subListItem = document.createElement('li');

                                fetch(obj[key][i]).then(response => response.json())
                                    .then(data => {
                                        subListItem.innerHTML = `<span>${data.name || data.title}</span>`;
                                        subList.append(subListItem);
                                    });


                            };
                            searchList.append(subList);
                        } else {

                            let listElem = document.createElement('li');
                            listElem.innerHTML = `${key} : <span>${obj[key]}</span>;`
                            searchList.append(listElem);

                        }
                }
                searchPreloader.style.display = "none";
                searchButton.after(searchList);

            } else {
                let arr = data.results;
                arr.map(item => searchList.innerHTML += `<li>${item.name}</li>`);
                searchPreloader.style.display = "none";
                searchButton.after(searchList);
            }
        })


}