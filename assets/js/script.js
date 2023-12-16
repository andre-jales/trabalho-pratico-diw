const apiURLAlbums = "https://json-server-web-tp-diw.andrejales1.repl.co/albuns";
const apiURLFotos = "https://json-server-web-tp-diw.andrejales1.repl.co/fotos";
const checkbox = $('#myHeart');
const label = $('.heart-label');
var map;
var albuns = [];

function showAlbums(albums) {
    albuns = albums;
    let containerAlbums = $("#container-albums");
    let currentRow;
    for (let i = 0; i < albums.length; i++) {
        if (i % 4 === 0) {
            currentRow = $('<div class="row row-cols-1 row-cols-md-4">');
            containerAlbums.append(currentRow);
        }

        $(`<div class="col">
            <div class="card p-0 m-2">
                <img
                    src="${albums[i].imagem}"
                    class="card-img-top"
                    alt="${albums[i].titulo}"
                />
                <div class="card-body">
                    <h5 class="card-title">${albums[i].titulo}</h5>
                    <p class="card-text">${albums[i].descricaoCurta}</p>
                    <a href="album.html?id=${albums[i].id}" class="btn btn-primary">Ver álbum</a>
                </div>
            </div>
        </div>`).appendTo(currentRow);
    }
}

function showMarkers(albums) {
    if ($('#map').length)
    for (let i = 0; i < albums.length; i++) {
        let coordenadas = albums[i].localizacao.split(',').map(coord => parseFloat(coord.trim()));
        let marker = new mapboxgl.Marker()
            .setLngLat([coordenadas[0], coordenadas[1]])
            .setPopup(new mapboxgl.Popup().setHTML(`<p><a href="album.html?id=${albums[i].id}">${albums[i].titulo}</a></p>`))
            .addTo(map);
    }
}

function showItems(items, albumID) {
    let filteredItems = items.filter(item => item.album == albumID);
    const containerItems = $('.container-items');
    const carouselInner = $('.carousel-inner');
    let currentRow;
    for (let i = 0; i < filteredItems.length; i++) {
        if (i % 4 === 0) {
            currentRow = $('<div class="row row-cols-1 row-cols-md-4">');
            containerItems.append(currentRow);
        }
        
        $(`<div class="col">
        <div class="card p-0 m-2">
          <img
            src="${filteredItems[i].url}"
            class="card-img-top"
            alt="${filteredItems[i].titulo}"
          />
          <div class="card-body">
            <h5 class="card-title">${filteredItems[i].titulo}</h5>
            <p class="card-text">
            ${filteredItems[i].descricao}
            </p>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#carouselModal"><span data-bs-target="#carouselExampleCaptions" data-bs-slide-to="${i}">Ver item</span></button>
          </div>
        </div>
      </div>`).appendTo(currentRow);

      if (i == 0) {
        $(`<div class="carousel-item active">
        <img src="${filteredItems[i].url}" class="d-block" alt="${filteredItems[i].titulo}">
        <div class="carousel-caption d-none d-md-block bg-dark opacity-75">
          <h5>${filteredItems[i].titulo}</h5>
          <p>${filteredItems[i].descricao}</p>
        </div>
      </div>`).appendTo(carouselInner);
      }
      else {
        $(`<div class="carousel-item">
        <img src="${filteredItems[i].url}" class="d-block" alt="${filteredItems[i].titulo}">
        <div class="carousel-caption d-none d-md-block bg-dark opacity-75">
          <h5>${filteredItems[i].titulo}</h5>
          <p>${filteredItems[i].descricao}</p>
        </div>
      </div>`).appendTo(carouselInner);
      }
    }
}

function showAlbum(albums) {
    let params = new URLSearchParams(location.search);
    let id = params.get('id');
    let album = albums.find(function (elem) {return elem.id == id});
    $('#carouselModalLabel').text(`${album.titulo}`);
    if (album) {
        if (album.destaque) {
            checkbox.prop('checked', true);
            label.html('<i class="bi bi-heart-fill"></i>');
        }
        checkbox.change(function () {
            if (this.checked) {
                label.html('<i class="bi bi-heart-fill"></i>');
                fetch(`${apiURLAlbums}/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ destaque: true }),
                })
                    .then(response => response.json())
                    .catch(error => {
                    console.error(error);
                    });
            }
            else {
                label.html('<i class="bi bi-heart"></i>');
                fetch(`${apiURLAlbums}/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ destaque: false }),
                })
                    .then(response => response.json())
                    .catch(error => {
                    console.error(error);
                    });
            }
                
        });
        const albumTitle = $('.album-title');
        albumTitle.text(`Álbum ${album.titulo}`);
        const albumImage = $('.album-imagem');
        albumImage.attr("src", `${album.imagem}`);
        const albumDescription = $('.album-descricao');
        albumDescription.text(`${album.descricao}`);
        const albumLocation = $('.album-localizacao');
        albumLocation.text(`${album.localizacao}`);
        const albumDate = $('.album-data');
        albumDate.text(`${album.data}`);

        fetch(apiURLFotos, {
            method: 'GET',
            headers: { 'Content-Type': 'application/JSON' }
          })
            .then(res => res.json())
            .then(data => {if($(".container-items").length){showItems(data, id)}})
            .catch(error => {
              console.error(error)
            });

    }
}

function showDestaques(albums) {
    let carousel = $('.carousel-destaques');
    let featAlbums = albums.filter(album => album.destaque == true);

    for (let i = 0; i < featAlbums.length; i++) {
        if (i == 0) {
            $(`<div class="carousel-item active">
            <img src="${featAlbums[i].imagem}" class="w-100 m-auto" alt="${featAlbums[i].descricaoCurta}">
            <div class="carousel-caption d-none d-md-block bg-dark opacity-75">
                <a href="album.html?id=${featAlbums[i].id}" class="text-light">${featAlbums[i].titulo}</a>
            </div>
        </div>`).appendTo(carousel);
        }
        else {
            $(`<div class="carousel-item">
            <img src="${featAlbums[i].imagem}" class="w-100 m-auto" alt="${featAlbums[i].descricaoCurta}">
            <div class="carousel-caption d-none d-md-block bg-dark opacity-75">
                <a href="album.html?id=${featAlbums[i].id}" class="text-light">${featAlbums[i].titulo}</a>
            </div>
        </div>`).appendTo(carousel);
        }
    }
}

$(document).ready(function () {
    if($('#map').length) {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmVqYWxlcyIsImEiOiJjbHBuMW1qbDMwZDBpMmhvNXFidm5rcTQ0In0.c_P2-57ihjJdk378BlCcbA';

        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-43.938641, -19.919118],
            zoom: 10,
        });
    }
    
    fetch(apiURLAlbums, {
        method: 'GET',
        headers: { 'Content-Type': 'application/JSON' }
      })
        .then(res => res.json())
        .then(data => {if($("#container-albums").length){showAlbums(data)} if($('.album').length){showAlbum(data)} if($('#map').length){showMarkers(data)} if($('.carousel-destaques').length){showDestaques(data)}})
        .catch(error => {
          console.error(error)
        });
});

