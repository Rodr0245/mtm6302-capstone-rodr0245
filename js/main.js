// Waits for the document to fully load to prevent any errors
document.addEventListener('DOMContentLoaded', function() {
  // === Search Icon Toggle ===
  // Search functionality currently does not work, will be added on a later date
  const searchInput = document.getElementById('search');
  const searchIcon = document.querySelector('.searchIcon');

  // Function to toggle search icon based on input state
  function toggleSearchIcon() {
    searchIcon.style.display = searchInput.value.trim() ? 'none' : 'inline-block';
  }

  // Initial check on page load
  toggleSearchIcon();

  // Add focus and blur event listeners to search input and toggle search icon
  searchInput.addEventListener('focus', () => searchIcon.style.display = 'none');
  searchInput.addEventListener('blur', toggleSearchIcon);

  // === Variables ===
  const pokemonGrid = document.querySelector('.cs-card-group');
  const loadMore = document.querySelector('#loadMore');

  
  // Fetch and populate the type icons from pokeAPI (Feature does not work 100% yet, may fix later on in the future)
  // const typeIcons = {
  //   normal: '<img class="pokemonTypeIcon normal" src="icons/normal.svg" alt="Normal Icon">',
  //   fire: '<img class="pokemonTypeIcon fire" src="icons/fire.svg" alt="Fire Icon">',
  //   water: '<img class="pokemonTypeIcon water" src="icons/water.svg" alt="Water Icon">',
  //   grass: '<img class="pokemonTypeIcon grass" src="icons/grass.svg" alt="Grass Icon">',
  //   electric: '<img class="pokemonTypeIcon electric" src="icons/electric.svg" alt="Electric Icon">',
  //   ice: '<img class="pokemonTypeIcon ice" src="icons/ice.svg" alt="Ice Icon">',
  //   fighting: '<img class="pokemonTypeIcon fighting" src="icons/fighting.svg" alt="Fighting Icon">',
  //   poison: '<img class="pokemonTypeIcon poison" src="icons/poison.svg" alt="Poison Icon">',
  //   ground: '<img class="pokemonTypeIcon ground" src="icons/ground.svg" alt="Ground Icon">',
  //   flying: '<img class="pokemonTypeIcon flying" src="icons/flying.svg" alt="Flying Icon">',
  //   psychic: '<img class="pokemonTypeIcon psychic" src="icons/psychic.svg" alt="Psychic Icon">',
  //   bug: '<img class="pokemonTypeIcon bug" src="icons/bug.svg" alt="Bug Icon">',
  //   rock: '<img class="pokemonTypeIcon rock" src="icons/rock.svg" alt="Rock Icon">',
  //   ghost: '<img class="pokemonTypeIcon ghost" src="icons/ghost.svg" alt="Ghost Icon">',
  //   dark: '<img class="pokemonTypeIcon dark" src="icons/dark.svg" alt="Dark Icon">',
  //   dragon: '<img class="pokemonTypeIcon dragon" src="icons/dragon.svg" alt="Dragon Icon">',
  //   steel: '<img class="pokemonTypeIcon steel" src="icons/steel.svg" alt="Steel Icon">',
  //   fairy: '<img class="pokemonTypeIcon fairy" src="icons/fairy.svg" alt="Fairy Icon">'
  // };


  // const fetchTypeIcon = async (typeName) => {
  //   try {
  //     const response = await fetch(`https://your-icon-source-url/${typeName}`);
  //     const data = await response.json();
  //     const iconUrl = data.iconUrl;
  //     typeIcons[typeName] = `<img src="${iconUrl}" alt="${typeName} Icon">`;
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  // // Fetch and populate the type icons
  // Object.keys(typeIcons).forEach(async (typeName) => {
  //   await fetchTypeIcon(typeName);
  // });

  // Normal emojis used for type icons
  const typeIcons = {
    normal: '⚪', fire: '🔥', water: '💧', grass: '🌿', electric: '⚡', ice: '❄️',
    fighting: '🥊', poison: '☠️', ground: '🌍', flying: '🌪️', psychic: '🔮', 
    bug: '🐛', rock: '🪨', ghost: '👻', dark: '🌑', dragon: '🐉', steel: '⚙️', 
    fairy: '✨'
  };
  // Pokemon type colors
  const typeColors = {
    normal: '#a8a878', fire: '#f08030', water: '#6890f0', grass: '#78c850', 
    electric: '#f8d030', ice: '#98d8d8', fighting: '#c03028', poison: '#a040a0', 
    ground: '#f4b2b3', flying: '#6390f0', psychic: '#f85888', bug: '#a8b820', 
    rock: '#b8a038', ghost: '#705898', dark: '#705848', dragon: '#7038f8', 
    steel: '#b8b8d0', fairy: '#ee99ac'
  };

  let offset = 0;

  // === Fetch Data from PokeAPI ===
  async function fetchData() {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
    return await response.json();
  }

  // Function to format Pokemon ID
  function addZero(id) {
    return id < 10 ? '00' + id : id < 100 ? '0' + id : id;
  }

  // === Add Pokemon to the Grid ===
  async function addPokemon() {
    const pokeData = await fetchData();
    pokeData.results.forEach(async (pokemon) => {
      const pokemonContainer = document.createElement('li');
      pokemonContainer.classList.add('cs-item');
      const res = await fetch(pokemon.url);
      const pokemonInfo = await res.json();
      const typeColor = typeColors[pokemonInfo.types[0].type.name] || '';
      const isCaught = caughtPokemon.some(p => p.id === pokemonInfo.id);
      const HTMLtemplate = `
      <style>
        .cs-item.${pokemonInfo.types[0].type.name} { background-color: ${typeColor}; }
      </style>
      <div class="pokemonCard">
          <i class="fa-regular fa-circle-check fa-lg"></i>
          <picture class="cs-picture">
              <source media="(max-width: 600px)"
                      srcset="${pokemonInfo.sprites.other['home'].front_default}">
              <source media="(min-width: 601px)"
                      srcset="${pokemonInfo.sprites.other['home'].front_default}">
              <img decoding="async"
                      src="${pokemonInfo.sprites.other['home'].front_default}"
                      alt="${pokemonInfo.name} Image" width="413" height="374" aria-hidden="true">
          </picture>
          <div class="cs-link">
            <span class="pokemonId">${addZero(pokemonInfo.id)}</span>
            <h3 class="cs-h3">${pokemonInfo.name.charAt(0).toUpperCase() + pokemonInfo.name.slice(1)}</h3>
            <div class="pokemonTypeContainer">
            ${pokemonInfo.types.map(type => `
              <div class="pokemonType">
                <span class="type-icon">${typeIcons[type.type.name] || ''}</span>
                <p>${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</p>
              </div>`).join('')}
              </div>
              <button class="catch-btn">${isCaught ? 'Release' : 'Catch'}</button>
          </div>
      </div>`;
      pokemonContainer.innerHTML = HTMLtemplate;
      pokemonContainer.classList.add(pokemonInfo.types[0].type.name);
      pokemonGrid.appendChild(pokemonContainer);

      // Event listener to show overlay
      pokemonContainer.addEventListener('click', () => {
        showOverlay(pokemonInfo);
      }); 
      // Event listener for "Catch" button // To catch/release pokemon
      const catchBtn = pokemonContainer.querySelector('.catch-btn');
        catchBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents the overlay from showing when clicking "Catch"
        catchPokemon(pokemonInfo, catchBtn);
    });
      // Event listener to change type background color on hover
      document.querySelectorAll('.pokemonCard').forEach(card => {
        card.addEventListener('mouseover', function() {
          const pokemonTypes = card.querySelectorAll('.pokemonType');
          pokemonTypes.forEach(type => {
            type.style.backgroundColor = typeColors[type.querySelector('p').textContent.toLowerCase()];
            type.style.color = 'white';
          });
        });
        // Reset background color on mouseout
        card.addEventListener('mouseout', function() {
          const pokemonTypes = card.querySelectorAll('.pokemonType');
          pokemonTypes.forEach(type => {
            type.style.backgroundColor = '';
            type.style.color = 'var(--secondary)';
          });
        });
      });
    });
  }


  addPokemon();

  // === Load More Pokemon ===
  loadMore.addEventListener('click', async () => {
    offset += 20;
    await addPokemon();
  });

  // === Show Overlay with Pokemon Details ===
  /**
   * Shows the overlay with the details of a Pokemon.
   * @param {Object} pokemonInfo - The information of the Pokemon.
   */
  async function showOverlay(pokemonInfo) {
    // Fetch the Pokemon's species data
    const speciesRes = await fetch(pokemonInfo.species.url);
    const speciesData = await speciesRes.json();
    const isCaught = caughtPokemon.some(p => p.id === pokemonInfo.id);

    // Find the English flavor text entry
    const englishFlavorText = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');

    // Set the text content of the overlay's title and name elements
    document.getElementById('overlay-title').textContent = pokemonInfo.name.charAt(0).toUpperCase() + pokemonInfo.name.slice(1);
    document.querySelector('.overlayPokemonName').textContent = pokemonInfo.name.charAt(0).toUpperCase() + pokemonInfo.name.slice(1);

    // Set the source of the overlay's image element
    document.getElementById('overlay-image').src = pokemonInfo.sprites.other['home'].front_default;

    // Set the text content of the overlay's ID, height, and weight elements
    document.getElementById('overlay-id').textContent = `${addZero(pokemonInfo.id)}`;
    document.getElementById('overlay-height').textContent = `${pokemonInfo.height / 10}m`;
    document.getElementById('overlay-weight').textContent = `${pokemonInfo.weight / 10}kg`;

    // Set the HTML content of the overlay's description element
    const biographyText = englishFlavorText ? `Biography: ${englishFlavorText.flavor_text.replace(/\n/g, ' ')}` : 'No description available.';
    document.getElementById('overlay-description').innerHTML = `<strong>Biography:</strong> ${biographyText.replace('Biography: ', '')}`;

    // Set the text content of the overlay's abilities element
    const abilities = pokemonInfo.abilities.map(abilityInfo => abilityInfo.ability.name.charAt(0).toUpperCase() + abilityInfo.ability.name.slice(1)).join(', ');
    document.getElementById('overlay-abilities').textContent = `${abilities}`;

    // Set the text content of the overlay's weaknesses element using the getWeaknesses function
    const weaknesses = await getWeaknesses(pokemonInfo.types);
    document.getElementById('overlay-weaknesses').textContent = `${weaknesses.join(', ')}`;
    
    // Event listener for "Catch" button // To catch/release pokemon
    const catchBtn = document.querySelector('#overlay-catch-btn');
      catchBtn.textContent = `${isCaught ? 'Release' : 'Catch'}`;
      catchBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      catchPokemon(pokemonInfo, catchBtn);
    });

    // Set the HTML content of the overlay's types element
    document.getElementById('overlay-types').innerHTML = `
    <style>
      .overlayPokemonType.${pokemonInfo.types[0].type.name} { border: 1px solid ${typeColors[pokemonInfo.types[0].type.name]}; }
    </style>
    <div class="overlayPokemonTypeContainer">
      ${pokemonInfo.types.map(type => `
        <div class="overlayPokemonType" style="border-color: ${typeColors[type.type.name]}; background-color: ${typeColors[type.type.name]};">
          <span class="type-icon">${typeIcons[type.type.name] || ''}</span>
          <p>${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</p>
        </div>`).join('')}
    </div>`;

    // Show the overlay by setting its visibility and opacity
    const overlay = document.getElementById('overlay');
    const overlayContent = document.querySelector('.overlay-content');
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    overlayContent.style.transform = 'translateY(0)';
    overlayContent.style.visibility = 'visible';
    overlayContent.style.opacity = '1';

    // Set the background color of the overlay's about element to match the first type's color
    const overlayAbout = document.querySelector('.overlayAbout');
    overlayAbout.style.backgroundColor = typeColors[pokemonInfo.types[0].type.name];
  }

  // === Get Weaknesses of Pokemon ===
  async function getWeaknesses(types) {
    const weaknesses = new Set();
    for (const type of types) {
      const typeRes = await fetch(type.type.url);
      const typeData = await typeRes.json();
      typeData.damage_relations.double_damage_from.forEach(weakness => {
        weaknesses.add(weakness.name.charAt(0).toUpperCase() + weakness.name.slice(1));
      });
    }
    return Array.from(weaknesses);
  }

  // === Close Overlay ===
  document.querySelector('.close-button').addEventListener('click', () => {
    const overlay = document.getElementById('overlay');
    const overlayContent = document.querySelector('.overlay-content');
    overlay.style.visibility = 'hidden';
    overlay.style.opacity = '0';
    overlayContent.style.transform = 'translateY(100%)';
    overlayContent.style.visibility = 'hidden';
    overlayContent.style.opacity = '0';
  });

  // Close overlay when clicking outside of it
  window.addEventListener('click', function(event) {
    const overlay = document.getElementById('overlay');
    const overlayContent = document.querySelector('.overlay-content');
    if (event.target == overlay) {
      overlay.style.visibility = 'hidden';
      overlay.style.opacity = '0';
      overlayContent.style.transform = 'translateY(100%)';
      overlayContent.style.visibility = 'hidden';
      overlayContent.style.opacity = '0';
    }
  });

  // === Catch/Release Pokemon section ===
  let caughtPokemon = [];
  // Function to catch pokemon
  function catchPokemon(pokemonInfo, buttonElement) {
    const isCaught = caughtPokemon.some(pokemon => pokemon.id === pokemonInfo.id);

    if (isCaught) {
      releasePokemon(pokemonInfo, buttonElement);
    } else {
      const capitalizedName = pokemonInfo.name.charAt(0).toUpperCase() + pokemonInfo.name.slice(1);
      showNotification(`You've caught ${capitalizedName}, Keep going!`);
      buttonElement.textContent = 'Release';
      caughtPokemon.push({ id: pokemonInfo.id, name: pokemonInfo.name });
      saveCaughtPokemon();
    }
    console.log(caughtPokemon);
  }

  // Function to release pokemon
  function releasePokemon(pokemonInfo, buttonElement) {
    const index = caughtPokemon.findIndex(pokemon => pokemon.id === pokemonInfo.id);
    if (index > -1) {
      const capitalizedName = `${pokemonInfo.name.charAt(0).toUpperCase()}${pokemonInfo.name.slice(1)}`;
      showNotification(`You've released ${capitalizedName}!`);
      buttonElement.textContent = 'Catch';
      caughtPokemon.splice(index, 1);
      saveCaughtPokemon();
    }
  }

  // Function to save caught pokemon
  function saveCaughtPokemon() {
  const caughtPokemonData = caughtPokemon.map(pokemon => ({
    id: pokemon.id,
    name: pokemon.name
  }));
  localStorage.setItem('caughtPokemon', JSON.stringify(caughtPokemonData));
  }
  // Loads caught Pokémon from localStorage
  loadCaughtPokemon();
  function loadCaughtPokemon() {
    const storedCaughtPokemon = localStorage.getItem('caughtPokemon');
    if (storedCaughtPokemon) {
      const caughtPokemonData = JSON.parse(storedCaughtPokemon);
      caughtPokemon = caughtPokemonData.map(pokemon => ({
        id: pokemon.id,
        name: pokemon.name
      }));
    }
  }

  // Function to show notification on catch/release
  let notificationTimeout;
  function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    notificationMessage.textContent = message;
    notification.classList.add('show');
    
    // Close notification on button click
    document.getElementById('notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
    });

    // Auto hide notification after 3 seconds
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
  
  // Reset the timer when the pokemon is added or removed
  document.querySelector('.catch-btn').addEventListener('click', () => {
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
      document.getElementById('notification').classList.remove('show');
    }, 3000);
  });





  // Gets the button with class caughtPokemonUi
const caughtPokemonButton = document.querySelector('.caughtPokemonUi');

// event listener for the button
caughtPokemonButton.addEventListener('click', () => {
  const pokemonToggleGrid = document.getElementById('pokemonGrid');
  if (pokemonToggleGrid.style.visibility !== 'hidden') {
    pokemonToggleGrid.style.visibility = 'hidden';
    caughtPokemonButton.classList.add('buttonActive');
  } else {
    pokemonToggleGrid.style.visibility = 'visible';
    caughtPokemonButton.classList.remove('buttonActive');
  }
});


// let showingCaughtPokemon = false;
// let originalPokemonGridHTML;

// caughtPokemonButton.addEventListener('click', () => {
//   const pokemonGrid = document.querySelector('.cs-card-group');
//   let caughtPokemonGrid = document.querySelector('.caught-pokemon-grid');

//   if (showingCaughtPokemon) {
//     // Restores the original grid content
//     pokemonGrid.innerHTML = originalPokemonGridHTML;
//     pokemonGrid.style.display = 'grid';
//     if (caughtPokemonGrid) caughtPokemonGrid.remove();
//     showingCaughtPokemon = false;
//   } else {
//     // Saves the current pokemonGrid HTML only the first time the button is clicked
//     if (!originalPokemonGridHTML) {
//       originalPokemonGridHTML = pokemonGrid.innerHTML;
//     }

//     // Hides the current pokemonGrid
//     pokemonGrid.style.display = 'none';

//     // Creates a new pokemonGrid with only the caught pokemons
//     caughtPokemonGrid = document.createElement('div');
//     caughtPokemonGrid.classList.add('cs-card-group', 'caught-pokemon-grid');

//     // Loops through the caughtPokemon array and create a new pokemon card for each one
//     caughtPokemon.forEach((pokemon) => {
//       const pokemonCard = document.createElement('li');
//       pokemonCard.classList.add('cs-item', 'caught-pokemon');

//       // Adds the pokemon name and image to the card
//       const pokemonName = document.createElement('h3');
//       pokemonName.classList.add('cs-h3');
//       pokemonName.textContent = pokemon.name;
//       pokemonCard.appendChild(pokemonName);

//       const pokemonImage = document.createElement('img');
//       pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
//       pokemonCard.appendChild(pokemonImage);

//       caughtPokemonGrid.appendChild(pokemonCard);
//     });

//     // Adds the new pokemonGrid to the page
//     document.querySelector('.cs-container').appendChild(caughtPokemonGrid);

//     // Shows the caught pokemon grid
//     caughtPokemonGrid.style.display = 'grid';
//     showingCaughtPokemon = true;
//   }
// });

// function switchUI() {
//   const pokemonToggleGrid = document.getElementById('pokemonGrid');
//   if (pokemonToggleGrid.style.visibility === 'visible') {
//     pokemonToggleGrid.style.visibility = 'hidden';
//   }

//   }


});
