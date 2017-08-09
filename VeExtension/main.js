
var log = function(item){
  chrome.runtime.getBackgroundPage(function(bkg){
    console.log(item);
  });
}//uses log() fonction to display in extension's background console (not console when inspected)

var listeClients = [];
//var listeYT = [];
function main(){

  function afficherContacts(){//display contacts
    var liste = rechercher();
    cleanAffichage();

    liste.forEach(function(element){//display customers
      //variables initialisation
      var row = document.createElement('div');
      var nom = document.createElement('div');
      var profileButton = document.createElement('a');
      var journeyButton = document.createElement('a');
      var veAppsDashboardButton = document.createElement('a');

      //variables settings
      row.setAttribute('class','row');

      nom.setAttribute('id',element.nom);
      nom.innerText=element.nom;
      nom.setAttribute('data-id',element.numero);
      nom.setAttribute('class','small-3 columns');

      //profile Button settings + action
      profileButton.innerText='Profile';
      profileButton.setAttribute('class','small-3 button');
      profileButton.url = "http://vecapture.veinteractive.com/Profiles.aspx?journeyId="+element.numero
      profileButton.addEventListener('click',clickAction);

      //journey buttons settings + action
      journeyButton.innerText='Journey';
      journeyButton.setAttribute('class','small-3 columns button');
      journeyButton.url = "http://vecapture.veinteractive.com/JourneyModify.aspx?journeyId="+element.numero
      journeyButton.addEventListener('click',clickAction);

      //appsDashboard settings + action
      veAppsDashboardButton.innerText='Dashboard';
      veAppsDashboardButton.setAttribute('class','small-3 columns button');
      veAppsDashboardButton.url = "http://vecapture.veinteractive.com/JourneyModify.aspx?journeyId="+element.numero
      veAppsDashboardButton.addEventListener('click',clickAction);

      //display in div
      row.appendChild(nom);
      row.appendChild(profileButton);
      row.appendChild(journeyButton);
      row.appendChild(veAppsDashboardButton);
      document.querySelector('#Contacts').appendChild(row);

    });
  }
  //function to change URL of the current tab.
  function clickAction(evt){
    chrome.tabs.query({"active":true},function(tab){
      chrome.tabs.update({url:evt.target.url})//redirect to URL in the buttons params (param name url)
    });
  }
  function ajouterContact(){//add contact

    //fetching inputs
    var nom = document.querySelector('#nomContact').value;
    var num = document.querySelector('#numContact').value;
    var key = {nom:nom,numero:num};
    listeClients.push(key);
    localStorage.setItem("Clients",JSON.stringify(listeClients));//sauvegarde

    //clearing inputs
    document.querySelector('#nomContact').value = '';
    document.querySelector('#numContact').value = '';

    //display
    afficherContacts();
  }

  function ajouterListe(){//mass insertion of contacts
    cleanAffichage();
    var insertMassContact = document.createElement('input');
    var textArea = document.createElement('textarea');

    textArea.setAttribute('id','textArea')

    insertMassContact.setAttribute('id','insertMassContact');
    insertMassContact.setAttribute('type','button');
    insertMassContact.setAttribute('value','GO FOR IT !');
    insertMassContact.addEventListener('click',function(){//Save all contacts (give serialized contacts so we can save them in a file)
      var resTab = [];
      var res = document.querySelector('#textArea').value.split(';');
      res.forEach(function(element){
        var resNom = element.split(',')[0];
        var resNumero = element.split(',')[1];
        resTab.push({nom:resNom,numero:resNumero});
      });
      localStorage.setItem("Clients",JSON.stringify(resTab));//save in cookies
      afficherContacts();
    });
    document.querySelector("#Contacts").appendChild(insertMassContact);
    document.querySelector("#Contacts").appendChild(textArea);
  }

  function cleanAffichage(){//clean div contact in html
    var contacts = document.querySelector('#Contacts');
    while(contacts.firstChild){
      contacts.removeChild(contacts.firstChild);
    }
  }

  //return serialized contacts
  function parsingContacts(){
    cleanAffichage();
    var resClients = document.createElement('textArea');
    var jsonData=JSON.parse(localStorage.getItem('Clients'));
    for (var i = 0;i<jsonData.length;i++){
      resClients.value+=jsonData[i].nom+','+jsonData[i].numero+';';
    }
    document.querySelector('#Contacts').appendChild(resClients);
  }


  function rechercher(){//search in list of contacts
    var recherche = document.querySelector('#filtre').value;
    var res=[];
    if (!isNaN(recherche)){
      res = listeClients.filter(function(element){return recherche===element.numero;});
    }
    else if (typeof recherche ==='string'){
      res=listeClients.filter(function(element){return element.nom.toLowerCase().indexOf(recherche.toLowerCase())>-1;});
    }

    if (recherche) localStorage.setItem('Temp',JSON.stringify(recherche));//save search in cookies

    if (recherche == '')
    {
      localStorage.removeItem('Temp');//if empty
      res = listeClients;
    }

    return res;
  }
  /*


 ---------------------  NE SERT PLUS ------------------------


  function stopYT(){//if you want to mute / unmute tabs with sounds
    chrome.tabs.query({'audible':true},function(tab){
      tab.forEach(element=>{
        chrome.tabs.update(element.id,{muted:!element.mutedInfo.muted});//toggle on / off the sound of the tab
      });
    });
  }
  function addYT(){
    chrome.tabs.query({'audible':true},function(tab){
      if (tab[0].url.indexOf('youtube.com')>-1)
      {
        var url = tab[0].url;
        var finDeChaine = url.indexOf('&')>-1?url.indexOf('&'):url.length;
        var num = url.substr((url.indexOf('v=')+2),finDeChaine);

        //Parsing
        var nom = document.querySelector('#nomYT').value;
        var key = {nom:nom,numero:num};
        listeYT.push(key);
        localStorage.setItem("YT",JSON.stringify(listeYT));//sauvegarde

        //clearing inputs
        document.querySelector('#nomYT').value = '';
      }
    });
  }
  function displayYT(element){
      var div = document.createElement('div')
      div.setAttribute('class','row');

      var jpp = document.createElement('a');
      jpp.innerText = element.nom;
      jpp.setAttribute('class','button');
      jpp.addEventListener('click',function(){
        chrome.tabs.query({'audible':true},function(tabs){
          var id = tabs[0].id;
          chrome.tabs.update(id,{url:'https://www.youtube.com/watch?v='+element.numero});//change url of tab and redirect
          chrome.tabs.executeScript(id,{code:'window.scrollTo(0,1000)'});
        });
      });

      div.appendChild(jpp);
      document.querySelector('.dropdown-content').appendChild(div);
  }

  function scrollYT(){
    chrome.tabs.query({'audible':true},function(tabs){
      chrome.tabs.executeScript(tabs[0].id,{code:'window.scrollTo(0,500)'});
    })
  }

*/
  //WHEN PAGE LOADS
  document.addEventListener('DOMContentLoaded',function(){

    var jsonData=JSON.parse(localStorage.getItem('Clients'));//For Clients
    for (var i = 0;i<jsonData.length;i++){
      listeClients.push(jsonData[i]);
    }

    /*var jsonData=JSON.parse(localStorage.getItem('YT'));//For YOUTUBE
    if (jsonData)
    {
      for (var i = 0;i<jsonData.length;i++){
        listeYT.push(jsonData[i]);
      }
    }
    listeYT.forEach(function(element){
      displayYT(element);
    });*/


    var temp = JSON.parse(localStorage.getItem('Temp'));//if closed during a search, reopen on the search / if not display all contacts
    if (!temp) temp ='';

    document.querySelector('#filtre').setAttribute('value',temp);
    //document.querySelector('#scrollYT').addEventListener('click',scrollYT);
    //document.querySelector("#stopYT").addEventListener('click',stopYT);
    //document.querySelector("#addYT").addEventListener('click',addYT);
    document.querySelector('#ajouterContact').addEventListener('click',ajouterContact);
    document.querySelector("#majContact").addEventListener('click',ajouterListe);
    document.querySelector('#afficher').addEventListener('click',afficherContacts);
    document.querySelector('#sauvegarder').addEventListener('click',parsingContacts);
    document.querySelector('#filtre').addEventListener('keyup',afficherContacts);
    afficherContacts();
    $(document).foundation();
  });
}
main();
