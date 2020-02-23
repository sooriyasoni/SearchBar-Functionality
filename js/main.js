'use strict';
//make sure service worked are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('../sw_cachedPage.js')
            .then(reg => console.log('Service Worker Registered'))
            .catch(err => console.log(`service worker :Error:${err}`))
    })
}

const url = 'http://localhost:5000/';

function onLoad() {
    document.getElementById('prev').style.display = 'none';
    document.getElementById('curr').style.display = 'none';
    document.getElementById('next').style.display = 'none';
}

async function onClickPage(pageId) {
    var aspects = ['title'];
    var pageNo = document.getElementById(pageId).value;
    pageNo = parseInt(pageNo);
    var resultContext = {
        offset: pageNo,
        aspects: aspects,
        maxResults: 10
    };

    fetch(url, {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                queryString: document.getElementById('query').value,
                resultContext: resultContext
            })
        })
        .then(response => {
            return response.json();
        })
        .then(myJson => {
            console.log(myJson);
            if (myJson.error == false) {
                var res = myJson.data;
                var txt = '';

                txt += "<table border='1'>";
                for (let i in res.results[0].results) {
                    var title = res.results[0].results[i].title;
                    var apiUrl = res.results[0].results[i].apiUrl;
                    txt +=
                        '<tr><td>' + '<a href=' + apiUrl + '>' + title.title + '</a>'; +
                    '</tr><td>';
                }
                txt += '</table>';
                document.getElementById('demo').innerHTML = txt;
                document.getElementById('prev').style.display = 'block';
                document.getElementById('curr').style.display = 'block';
                document.getElementById('next').style.display = 'block';
                console.log(pageId);
                console.log('pageNo', pageNo);
                document.getElementById('curr').value = pageNo;
                document.getElementById('prev').value = pageNo - 1;
                document.getElementById('next').value = pageNo + 1;
                if (pageNo == 0) {
                    document.getElementById('prev').style.display = 'none';
                }
            }
        })
        .catch(err => {
            console.log(err);
            document.getElementById('demo').innerHTML = err;
        });
}
