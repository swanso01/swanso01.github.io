document.getElementById('search-button').addEventListener('click', function() {
    const superheroName = document.getElementById('superhero-name').value.trim();
    const displaySection = document.getElementById('superhero-details');
    displaySection.innerHTML = '';

    if (!superheroName) {
        displaySection.innerHTML = '<p>Please enter a superhero name!</p>';
        return;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(superheroName)) {
        displaySection.innerHTML = '<p>ENTER A VALID NAME OML</p>';
        return;
    }

    fetch(`https://www.superheroapi.com/api.php/dd4a575299f18429c074e06d33427130/search/${superheroName}`)
        .then(response => response.json())
        .then(data => {
            if (data.response === 'error') {
                displaySection.innerHTML = `<p>Superhero not found!</p>`;
            } else if (data.results.length === 0) {
                displaySection.innerHTML = `<p>No results found for ${superheroName}. Please try again.</p>`;
            } else {
                const superhero = data.results[0];
                displaySection.innerHTML = `
                    <h3>${superhero.name}</h3>
                    <img src="${superhero.image.url}" alt="${superhero.name}">
                    <p><strong>Power Stats:</strong></p>
                    <ul>
                        <li>Intelligence: ${superhero.powerstats.intelligence}</li>
                        <li>Strength: ${superhero.powerstats.strength}</li>
                        <li>Speed: ${superhero.powerstats.speed}</li>
                        <li>Durability: ${superhero.powerstats.durability}</li>
                        <li>Power: ${superhero.powerstats.power}</li>
                        <li>Combat: ${superhero.powerstats.combat}</li>
                    </ul>
                    <p><strong>Biography:</strong> ${superhero.biography['full-name']}</p>
                `;
            }
        })
        .catch(error => {
            displaySection.innerHTML = `<p>ErRoR!!!!.</p>`;
        });
});