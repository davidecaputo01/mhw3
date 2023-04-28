const numResults=15;


function onJsonTop(json) {
    console.log(json);
    console.log('eccomi');
    //svuoto il contenitore
    const contenitore=document.querySelector('#top15');
    const old_cont=document.querySelector('#album-view');
    contenitore.innerHTML='';
    old_cont.innerHTML='';
    //aggiungo gli elementi
    for(const brano of json.toptracks.track){
        const branoinfo = brano.name;
        const link = brano.url;
        const Nomebrano = document.createElement('p');
        Nomebrano.classList.add('trackname');
        const linkbrano = document.createElement('a');
        linkbrano.classList.add('link');
       Nomebrano.textContent=branoinfo;
       linkbrano.href = link;
        contenitore.appendChild(Nomebrano);
        Nomebrano.appendChild(linkbrano);
    }


};

function onResponse(response){
    console.log('Risposta ricevuta');
    return response.json();   
}
function onResponseSpotify(response){
    console.log('Risposta ricevuta');
    return response.json();

}
function onJsonSpotify(json){
    console.log('JSON ricevuto');
    console.log(json);
   //aggiungo gli elementi
 const artista = json.artists.items[0];
    const id_artista=artista.id;
    console.log(id_artista);
    const album_endpoint='https://api.spotify.com/v1/artists/'+id_artista+'/albums';
    fetch(album_endpoint,{
        headers:
        {
          'Authorization': 'Bearer ' + token
        }
      }).then(onResponseAlbum).then(onJsonAlbum);
}

function onResponseAlbum(response){
    return response.json();
}
function onJsonAlbum(json){
    console.log(json);
    console.log("Hai ricevuto l'album");
    //svuotiamo il contenitore
    const contenitore=document.querySelector('#album-view');
    const old_cont=document.querySelector('#top15');
    old_cont.innerHTML='';
    contenitore.innerHTML='';
    for(const album of json.items){
        const nome = album.name;
        const img = album.images[1].url;
     // creo il div che contiene immagine e testo
        const copertina=document.createElement('div');
        copertina.classList.add('copertina');
        const immagine= document.createElement('img');
        immagine.src=img;
        const titolo=document.createElement('span');
        titolo.textContent = nome;
    //aggiungiamo i vari elementi
       copertina.appendChild(immagine);
       copertina.appendChild(titolo);
       contenitore.appendChild(copertina);
    } 

}
function search(event){
    event.preventDefault();
   const select = document.querySelector('#tipo');
   console.log(select.value);
   const input= encodeURIComponent(document.querySelector('#content').value);

   //con if, else divido i due casi
   if(select.value=='top'){
    const topTracks_url=topTracks_endpoint+'?method=artist.gettoptracks'+ '&artist='+input+'&api_key=' + api_key + '&format=json'+'&limit='+numResults;
    fetch(topTracks_url).then(onResponse).then(onJsonTop);
    }
    else{
       
        fetch(spotify_endpoint+'?type=artist&q='+input,
         {
            headers:
            {
              'Authorization': 'Bearer ' + token
            }
          }
          ).then(onResponseSpotify).then(onJsonSpotify);

        }
}


//api KEY
const api_key='105f76ffe5bbd852b50dedf5568dc42a';

//endpoint
const topTracks_endpoint='http://ws.audioscrobbler.com/2.0/';
const spotify_endpoint='https://api.spotify.com/v1/search';


//Credenziali Oauth
const client_id='643d8f91d6234be39d2d6a16210137a6';
const client_secret='ec07c63888fd4e7ebcee2f52c22b2cf0';
//token
let token;


//richiediamo il token
fetch("https://accounts.spotify.com/api/token",
	{
   method: "post",
   body: 'grant_type=client_credentials',
   headers:
   {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
   }
  }
).then(onTokenResponse).then(onTokenJson);

//funzioni 
function onTokenResponse(response){
    return response.json();
   }
   
   function onTokenJson(json){
       console.log(json);
       token = json.access_token;
   
   }
   

const bottone = document.querySelector('form').addEventListener('submit',search)