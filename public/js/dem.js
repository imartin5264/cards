//Grabing info from doc
const dbAnswer = document.querySelector('#dbanswer');
const submit = document.querySelector('#submit');
const card = document.querySelector('.card');
console.log(dbAnswer);
console.log(submit);
console.log(card);

// Getting the DataBase answer
let innerHtmlDbA = dbAnswer.innerHTML;
console.log(innerHtmlDbA);

//Gather info from url
const myUrl = new URL(window.location.href);
let splitPath = myUrl.pathname.split('/');
let deck = splitPath[2];
let i = parseInt(splitPath[4]);
let bol = splitPath[3];
let inc_count = splitPath[5];
console.log(myUrl);
console.log(splitPath);
console.log(deck);
console.log(i);
console.log(bol);
console.log(inc_count);

// Changing requested question and answer
if(bol != 'true'){
    
    submit.addEventListener('click', () => {
        let usanswer = document.querySelector('#usanswer');
        let usanwerValue = usanswer.value;
        console.log(usanswer);
        console.log(usanwerValue);
        if(inc_count > 2){
            window.location(`http://localhost:5000/card/${deck}/true/${i}/${inc_count}/toManyTries`);
        }else if(usanwerValue != innerHtmlDbA){
            inc_count ++;
            console.log('incoreect answer compair', usanwerValue, innerHtmlDbA);
            window.location(`http://localhost:5000/card/${deck}/false/${i}/${inc_count}/inorrect`);
        }else{
            console.log(usanswer, innerHtmlDbA);
            window.location(`http://localhost:5000/card/${deck}/true/${i}/${inc_count}/correct`);
        }
    });
    
}else{
    card.classList.toggle('flip');    
    i++;
    myUrl.pathname = `card/${deck}/false/${i}/0/noError`;
    console.log(myUrl);    
    let url = myUrl.href; 
    //console.log(url);
    //i++;
    //console.log(i);    
    alink.setAttribute("href", url);       
    
}



newq.addEventListener('click', () => {
        
    card.classList.toggle('flip');    
});