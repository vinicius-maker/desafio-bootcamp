let containerList   = document.querySelector('#container-list');
let loadContainer   = document.querySelector('#load');
let inputUser       = document.querySelector('#inputUser');
let listUser        = document.querySelector('#listUsers');
let buttonSearch    = document.querySelector('#buttonSearch');
let buttonClear     = document.querySelector('#buttonClear');
let isFilter        = false;
let dataUsers       = [];
let dataUsersFilter = [];

let qtdM        = 0;
let qtdF        = 0;
let totIdade    = 0;
let mediaIdade  = 0;

window.addEventListener('load', () => {
  buttonSearch.disabled   = true;
  buttonClear.disabled    = true;
  inputUser.focus();

  let form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    containerList.classList.add('hidden');
    containerList.classList.remove('show');

    event.preventDefault();
    showLoad();
    validateForm();
  });

  inputUser.addEventListener('keyup', (event) => {
    let inputValue = inputUser.value.trim();
    if (inputValue.length) {
      buttonSearch.disabled = false;
      return;
    }

    if (event.key === 'Enter') {
      validateForm();
      return;
    }

    buttonSearch.disabled = true;
  });

  buttonClear.addEventListener('click', () => {
    showLoad();
    clearFilter();
  })

  getData();
});

function validateForm() {
  disabledForm();
  let inputValue = inputUser.value.trim().toLowerCase();
  if (!inputValue.length) {
    hiddenLoad();
    alert('Informe um valor para pesquisa.');
    return;
  }

  clearListUser();
  setTimeout(() => {
    filterData(inputValue);
  }, 800);
}

function checkBtnClear() {
  if (isFilter) {
    buttonClear.disabled = false;
    return;
  }

  buttonClear.disabled = true;
}

function disabledForm() {
  inputUser.disabled = true;
  buttonSearch.disabled = true;
  buttonClear.disabled = true;
}

function enabledForm() {
  inputUser.disabled = false;
  buttonSearch.disabled = false;
  checkBtnClear();
}

function showLoad() {
  loadContainer.classList.add('show');
  loadContainer.classList.remove('hidden');
}

function hiddenLoad() {
  loadContainer.classList.remove('show');
  loadContainer.classList.add('hidden');
}

function clearListUser() {
  let items = document.querySelectorAll('#listUsers li');
  let itemArray = Array.from(items);
  itemArray.forEach(element => {
    if (element.id !== undefined) {
      document.querySelector(`#${element.id}`).remove();
    }
  });
}

function updateStatistic() {
  let title       = document.querySelector('#statisticTitle');
  let sexoM       = document.querySelector('#sexo-m');
  let sexoF       = document.querySelector('#sexo-f');
  let SomaIdade   = document.querySelector('#soma-idade');
  let MediaIdade  = document.querySelector('#media-idade');
  let data = isFilter ? dataUsersFilter : dataUsers;

  let qtdM      = data.filter(user => user.gender == "male").length
  let qtdF      = data.filter(user => user.gender == "female").length
  let totIdade  = data.reduce((sum, user) => {
    return sum + user.dob.age
  }, 0);
  let medIdade = totIdade/data.length;

  title.textContent = 'Estatística';
  sexoM.textContent = `Sexo Masculino: ${qtdM}`;
  sexoF.textContent = `Sexo Femininno: ${qtdF}`;
  SomaIdade.textContent = `A soma das idade é: ${totIdade}`;
  MediaIdade.textContent = `A média das idades é: ${parseFloat(medIdade.toFixed(2))}`;
}

function renderListUser() {
  function itemListUser(user, index) {
    let li      = document.createElement('li');
    let img     = document.createElement('img');
    let label   = document.createElement('label');
    let p       = document.createElement('p');

    li.classList.add('collection-item', 'avatar');
    li.id = `item-user-${index + 1}`;
    img.classList.add('circle');
    img.src = `${user.picture.thumbnail}`;
    img.alt = `Foto do usuário.`;
    label.classList.add('title');
    label.textContent = `${user.name.first} ${user.name.last}`;
    p.textContent = `${user.dob.age} anos`;

    li.appendChild(img);
    li.appendChild(label);
    li.appendChild(p);
  
    return li;
  }

  let listTitle       = document.querySelector('#listUsersTitle');
  let data = isFilter ? dataUsersFilter : dataUsers;
  if (data.length) {
    listTitle.textContent = `${data.length} usuário(s) localizado(s)`;
    data.forEach((user, index) => {
      listUser.appendChild(itemListUser(user, index));
    });
    
  } else {
    listTitle.textContent = 'Nenhum usuário localizado.';
  }
  hiddenLoad();
  updateStatistic();

  containerList.classList.add('show');
  containerList.classList.remove('hidden');
}

async function getData() {
  showLoad();

  let res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  let data = await res.json();
  dataUsers = data.results;
  dataUsers.sort((a, b) => {
    return (a.name.first > b.name.first) ? 1 : ((b.name.first > a.name.first) ? -1 : 0);
  });

  setTimeout(() => {
    hiddenLoad();
    renderListUser();
  }, 1500);
}

function filterData(params) {
  isFilter = true;
  dataUsersFilter = [];
  dataUsersFilter = dataUsers.filter(user => {
    let first = user.name.first.trim();
    let last = user.name.last.trim();
    let name = `${first} ${last}`;
    return name.toLowerCase().indexOf(params) >= 0;
  });

  enabledForm();
  checkBtnClear();
  renderListUser();
}

function clearFilter() {
  setTimeout(() => {
    isFilter = false;
    dataUsersFilter = [];
    inputUser.value = '';
    inputUser.focus();
    checkBtnClear();
    renderListUser();
  }, 800);
}