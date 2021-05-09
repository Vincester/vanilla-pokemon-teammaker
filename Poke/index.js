const pokeList = document.querySelector('#m_pl')
const ranPoke = document.querySelector('#m_rp')
const teamPoke = document.querySelector('#m_yt')
const n_pokeList = document.querySelector('#nav_m_pl')
const n_ranPoke = document.querySelector('#nav_m_rp')
const n_teamPoke = document.querySelector('#nav_m_yt')
let showcase = document.querySelector('#side_showcase')
let side_display = document.querySelector('#side_display')
var buttons = document.querySelector('#buttons')
var prev_btn = document.querySelector('#prev_btn')
var next_btn = document.querySelector('#next_btn')
var poke_types = document.querySelector('#poke_types')
var poke_pic = document.querySelector('#poke_pic')
var poke_name = document.querySelector('#poke_name')
var poke_viewer = document.querySelector('#poke_viewer')
var ran_poke_viewer = document.querySelector('#ran_poke_viewer')
var ran_poke_name = document.querySelector('#ran_poke_name')
var random_viewer = document.querySelector('#random_viewer')
var dice = document.querySelector('#dice')
var searchBox = document.querySelector('#searchBox')
var team_viewer = document.querySelector('#team_viewer')
var add_to_Team = document.querySelector('#addToTeamBtn')
var add_to_Team2 = document.querySelector('#addToTeamBtn2')
var team_viewer_display = document.querySelector('#team_viewer_display')
var hamb_nav = document.querySelector('#hamb_nav')
var dropdown_box = document.querySelector('#dropdown_box')
var max = 0
var counter = 1
var isNavOpen = true;
var yourTeam = []
if (!localStorage.getItem("yourTeam")) {
    localStorage.setItem("yourTeam", [])
} else {
    yourTeam = JSON.parse(localStorage.getItem("yourTeam"))
}
var yourTeamLocal = localStorage.getItem("yourTeam")
var currentPokemon = ""
pokeList.addEventListener('click', () => {
    showButtons();
    listCaller(max)
});

n_pokeList.addEventListener('click', () => {
    showButtons();
    listCaller(max)
});
hamb_nav.addEventListener('click', () => {
    if (isNavOpen == true) {
        dropdown_box.style.display = "none"
        isNavOpen = false
    } else {
        dropdown_box.style.display = "flex"
        isNavOpen = true;
    }

})
prev_btn.addEventListener('click', () => { prevNext("prev") })
next_btn.addEventListener('click', () => { prevNext("next") })
ranPoke.addEventListener('click', genRandomPoke)
n_ranPoke.addEventListener('click', genRandomPoke)
dice.addEventListener('click', genRandomPoke)
searchBox.addEventListener('keyup', searcher)
teamPoke.addEventListener('click', teamViewer)
n_teamPoke.addEventListener('click', teamViewer)
add_to_Team.addEventListener('click', addToTeam)
add_to_Team2.addEventListener('click', addToTeam)

function teamViewer() {
    team_viewer_display.innerHTML = ""
    pokeList.classList.remove("active");
    teamPoke.classList.add("active")
    ranPoke.classList.remove("active");
    poke_viewer.style.display = "none";
    showcase.style.display = "none"
    buttons.style.display = "none"
    random_viewer.style.display = "none";
    team_viewer.style.display = "block"
    var yourTeamLocal = JSON.parse(localStorage.getItem("yourTeam"))

    yourTeamLocal.map(p => {
        var list = fetch(`https://pokeapi.co/api/v2/pokemon/${p}`)
            .then(response => response.json())
            .then(data => {
                team_viewer_display.innerHTML += `<div class="team_slot"><img src="${data.sprites.front_default}" style="height:15vh;width:auto" /><div class="p_name">${data.name}</div><div ><button  class="rft" onclick="removeFromTeam(this)">remove</button></div></div>`
            })
    })
}

// function teamUpdater() {
// window.localStorage.setItem("yourTeam", yourTeam)
// }
function addToTeam() {
    if (yourTeam.length < 5) {
        if (currentPokemon != "") {
            yourTeam.push(currentPokemon)
            localStorage.setItem("yourTeam", JSON.stringify(yourTeam))
        } else {
            alert('no pokemon selected')
        }
    } else {
        alert('the slots in your team is full')
    }

}

function removeFromTeam(e) {
    e.parentElement.parentElement.style.display = "none";
    var pokemon_name = e.parentElement.parentElement.querySelector('.p_name').textContent;
    var duplicateName = yourTeam.filter(p => p == pokemon_name)[0]
    var duplicate = yourTeam.filter(p => p == pokemon_name).length
    yourTeam = yourTeam.filter(p => p != pokemon_name)
    console.log("before: ", yourTeam, duplicateName)
    if (duplicate > 1) {
        for (i = 1; i < duplicate; i++) {
            yourTeam.push(duplicateName)
        }

    }

    console.log("after: ", yourTeam, duplicateName)
    localStorage.setItem("yourTeam", JSON.stringify(yourTeam))
}
async function searcher() {
    showcase.innerHTML = ""
    if (searchBox.value == "" || searchBox.value == " " || !searchBox.value) {
        listCaller(max)
        buttons.style.display = "flex"
        next_btn.style.display = "block"
        prev_btn.style.display = "block"
        buttons.style.justifyContent = "space-between"
    } else {
        var plist = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0`)
            .then(response => response.json())
            .then(data => data.results.filter(p => p.name.includes(searchBox.value)))
            .then(data => data.map(e => showcase.innerHTML += `<li class="poke" onclick="viewPoke('${e.name}')"> ${e.name}</li>`))
        buttons.style.display = "flex"
        prev_btn.style.display = "none"
        next_btn.style.display = "none"
        buttons.style.justifyContent = "center"
        buttons.querySelector('#addToTeamBtn').style.display = "block"

    }


}

function prevNext(arg) {
    if (arg == "prev") {
        if (max <= 0) return false
        max -= 100
    } else {
        max += 100
    }
    console.log(max)
    listCaller(max)

}

function showButtons() {
    counter += 0
    console.log(counter)
    if (counter % 2 == 0) {
        buttons.style.display = "none";
    } else {
        buttons.style.display = "flex";
        pokeList.classList.add("active");
    }
}

function listCaller(max) {

    searchBox.style.display = "block"
    poke_viewer.style.display = "block";
    showcase.style.display = "grid"
    buttons.style.display = "flex"
    random_viewer.style.display = "none";
    team_viewer.style.display = "none"
    pokeList.classList.add("active");
    teamPoke.classList.remove("active")
    ranPoke.classList.remove("active");
    showcase.innerHTML = ""

    var offset = max;
    console.log(max, offset);
    var list = fetch(`https://pokeapi.co/api/v2/pokemon?limit=100&offset=${offset}`)
        .then(response => response.json())
        .then(data => data.results.map(p => {
            showcase.innerHTML += `<li class="poke" onclick="viewPoke('${p.name}')"> ${p.name}</li>`;

        }))
}

function viewPoke(name) {
    poke_pic.setAttribute("src", "imgs/load.gif");
    poke_name.textContent = ""
    var list = fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then(response => response.json())
        .then(data => {
            currentPokemon = data.name
            poke_pic.setAttribute("src", data.sprites.front_default);
            poke_name.textContent = data.name
            poke_types.textContent = data.types[0].type.name
            if (data.types[1]) {
                poke_types.textContent += ("-" +
                    data.types[1].type.name)
            }
        })



}

function genRandomPoke() {
    ran_poke_viewer.innerHTML = `<img src="imgs/dice_load.gif" style="height:30vh;width:auto" />`
    ran_poke_name.textContent = ""
    poke_viewer.style.display = "none";
    showcase.style.display = "none"
    buttons.style.display = "none"
    random_viewer.style.display = "flex";
    team_viewer.style.display = "none"
    dice.style.display = "block"
    pokeList.classList.remove("active");
    teamPoke.classList.remove("active")
    ranPoke.classList.add("active");
    var ranId = Math.floor((Math.random() * 1000) + 1);
    var poke = fetch(`https://pokeapi.co/api/v2/pokemon/${ranId}`)
        .then(response => response.json())
        .then(data => {
            ran_poke_viewer.innerHTML = `<img src="${data.sprites.front_default}" style="height:30vh;width:auto" />`
            ran_poke_name.textContent = data.name
            currentPokemon = data.name
        }).catch((error) => {
            alert("Unexpected error has occcured, The page will be automatically reloaded")
            window.location.reload(false)
        });
}