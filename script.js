const inputPokemon = document.querySelector("#iptPokemon");

// dados do pokemon
const dadosPokemon = document.querySelector(".dadosPokemon");
const nomePokemon = document.querySelector(".nome");
const spritePokemon = document.querySelector(".sprite");
const movesPokemon = document.querySelector("#moves");
const tipoPokemon = document.querySelectorAll(".tipo > span");
const habilidadesPokemon = document.querySelectorAll(".habilidades > p");

const pokedex = document.querySelector(".pokedex-lista");
let pokedexDiv;
const btnInput = document.querySelector(".btnInput");
const btnMais = document.querySelector(".btnMaisPokemon");

let inicioBusca = 1;
let limiteBusca = 100;

// Inicializa a página
document.body.onload = iniciaPokedex;

btnInput.addEventListener("click", function () {
  buscaPokemon(inputPokemon.value.toLowerCase());
});

btnMais.addEventListener("click", function () {
  inicioBusca = limiteBusca + 1;
  limiteBusca += 100;
  if (limiteBusca >= 898) {
    limiteBusca = 898;
    btnMais.classList.add("escondido");
  }
  iniciaPokedex();
});

function iniciaPokedex() {
  for (let i = inicioBusca; i <= limiteBusca; i++) {
    const promiseResposta = fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);

    promiseResposta.then(function (resposta) {
      const promiseBody = resposta.json();
      promiseBody.then(function (pokemon) {
        const divPokemon = document.createElement("div");
        divPokemon.classList.add("pokedex-div");
        divPokemon.setAttribute("id", i);

        const img = document.createElement("img");
        img.src = pokemon.sprites.front_default;

        divPokemon.appendChild(img);

        pokedex.appendChild(divPokemon);
        if (i === limiteBusca) {
          pokedexDiv = document.querySelectorAll(".pokedex-div");
          pokedexDiv.forEach((div) => {
            div.addEventListener("click", function () {
              buscaPokemon(div.id);
            });
          });
        }
      });
    });
  }
}

function removeMoves() {
  for (let i = movesPokemon.length; i >= 0; i--) {
    movesPokemon.remove(i);
  }
}

function formataNomePokemon(nomePokemon) {
  const index = nomePokemon.indexOf(" ");
  nomePokemon = nomePokemon.substr(index).trim();
  console.log(nomePokemon);
  buscaPokemon(nomePokemon);
}

function buscaPokemon(pokemonSrc) {
  removeMoves();
  dadosPokemon.classList.remove("escondido");

  const promiseResposta = fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonSrc}`
  );

  promiseResposta.then(function (resposta) {
    if (!resposta.ok || pokemonSrc.trim() === "") {
      console.log("ERRO");
      nomePokemon.textContent = "Invalid Pokemon";
      spritePokemon.src = "";
      return;
    }

    const promiseBody = resposta.json();
    promiseBody.then(function (pokemon) {
      nomePokemon.textContent = `#${
        pokemon.id
      }-${pokemon.name[0].toUpperCase()}${pokemon.name.substr(1)}`;
      spritePokemon.src = pokemon.sprites.front_default;

      tipoPokemon[0].textContent = pokemon.types[0].type.name.toUpperCase();

      tipoPokemon[0].className = "";
      tipoPokemon[0].classList.add("tipo-geral");
      tipoPokemon[0].classList.add(
        `tipo-${pokemon.types[0].type.url.split("/")[6]}`
      );

      if (pokemon.types.length > 1) {
        tipoPokemon[1].className = "";
        tipoPokemon[1].textContent = pokemon.types[1].type.name.toUpperCase();
        tipoPokemon[1].classList.add("tipo-geral");
        tipoPokemon[1].classList.add(
          `tipo-${pokemon.types[1].type.url.split("/")[6]}`
        );
      } else {
        tipoPokemon[1].textContent = "";
        tipoPokemon[1].classList.add("escondido");
      }

      for (let i = 0; i < habilidadesPokemon.length; i++) {
        if (!pokemon.abilities[i]) {
          habilidadesPokemon[i].textContent = "";
        } else if (!pokemon.abilities[i].is_hidden) {
          habilidadesPokemon[i].textContent = `${pokemon.abilities[
            i
          ].ability.name[0].toUpperCase()}${pokemon.abilities[
            i
          ].ability.name.substr(1)}`;

          spritePokemon.src = pokemon.sprites.front_default;
        } else {
          habilidadesPokemon[i].textContent = `${pokemon.abilities[
            i
          ].ability.name[0].toUpperCase()}${pokemon.abilities[
            i
          ].ability.name.substr(1)} (hidden)`;
        }
      }

      const movesArray = pokemon.moves;
      console.log(pokemon);
      for (let i = 0; i < movesArray.length; i++) {
        const move = document.createElement("option");
        const moveId = movesArray[i].move.url.split("/");

        move.text = `#${moveId[6]} ${movesArray[i].move.name}`;

        movesPokemon.add(move);
      }
    });
  });
}
